import axios from 'axios'
import { createHash } from 'crypto'
import ecPkg from 'elliptic'

const { ec: EC } = ecPkg
const ec = new EC('secp256k1')

type BalanceResponse = {
  code: number;
  data: {
    accountId: number;
    address: string;
    balance: string;
    balanceE8: number;
  };
};

export async function sendTransaction(
  recipient: string,
  amount: number,
  fee: number,
  privateKey: string,
  peerUrl: string,
) {
  try {
    const normalizedUrl = peerUrl.replace(/\/+$/, '');

    // Validate private key (must be 64 hex characters)
    if (!/^[0-9a-fA-F]{64}$/.test(privateKey)) {
      throw new Error('Invalid private key format. Must be a 64-character hex string.');
    }

    // Fetch pinHash and pinHeight
    const { data: headData } = await axios.get(`${normalizedUrl}/chain/head`);
    if (!headData.data || !headData.data.pinHash || !headData.data.pinHeight) {
      throw new Error('Invalid response from chain head.');
    }
    const pinHash = headData.data.pinHash;
    const pinHeight = headData.data.pinHeight;

    // Generate unique nonceId
    const nonceId = Math.floor(Math.random() * 4294967295);

    // Ensure amountE8 and feeE8 are integers
    const amountE8 = Math.round(amount * 10 ** 8);
    const roundedFeeE8 = Math.round(fee * 10 ** 8);
    const { data: feeResponse } = await axios.get(
      `${normalizedUrl}/tools/encode16bit/from_e8/${String(roundedFeeE8)}`
    );
    if (!feeResponse.data || feeResponse.data.roundedE8 === undefined) {
      throw new Error('Invalid fee rounding response.');
    }
    const feeE8 = Math.round(feeResponse.data.roundedE8)

    // Generate bytes to sign
    const buf1 = Buffer.from(pinHash, 'hex');
    const buf2 = Buffer.alloc(19);
    buf2.writeUInt32BE(pinHeight, 0);
    buf2.writeUInt32BE(nonceId, 4);
    buf2.writeUInt8(0, 8);
    buf2.writeUInt8(0, 9);
    buf2.writeUInt8(0, 10);
    buf2.writeBigUInt64BE(BigInt(feeE8), 11);
    const buf3 = Buffer.from(recipient, 'hex').subarray(0, 20);
    const buf4 = Buffer.alloc(8);
    buf4.writeBigUInt64BE(BigInt(amountE8), 0);
    const toSign = Buffer.concat([buf1, buf2, buf3, buf4]);

    // Hash transaction data
    const digest = createHash('sha256').update(toSign).digest();

    // Sign transaction
    const keyPair = ec.keyFromPrivate(privateKey, 'hex');
    const signed = keyPair.sign(digest, { canonical: true });

    if (!signed) {
      throw new Error('Failed to sign transaction. Check private key.');
    }

    let recid = signed.recoveryParam ?? 0;
    const r = signed.r.toArrayLike(Buffer, 'be', 32);
    const s = signed.s.toArrayLike(Buffer, 'be', 32);
    if (signed.s.cmp(ec.curve.n.shrn(1)) > 0) {
      recid ^= 1;
    }
    const recidBuffer = Buffer.alloc(1);
    recidBuffer.writeUInt8(recid);
    const signature65 = Buffer.concat([r, s, recidBuffer]);

    // Submit transaction
    const transaction = {
      pinHeight,
      nonceId,
      toAddr: recipient,
      amountE8,
      feeE8,
      signature65: signature65.toString('hex'),
    };

    const { data: response } = await axios.post(`${normalizedUrl}/transaction/add`, transaction);
    console.log('Transaction sent:', response);
    return response;
  } catch (error) {
    console.error('Transaction failed:', error);
    return null;
  }
}

export async function getBalance(peerUrl: string, address: string): Promise<string | null> {
  try {
    // Normalize URL: Remove trailing slash (but keep 'https://')
    const normalizedUrl = peerUrl.replace(/\/+$/, '');
    const response = await axios.get<BalanceResponse>(`${normalizedUrl}/account/${address}/balance`);

    if (response.data.code === 0) {
      return response.data.data.balance;
    }
    return null;
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
}

export async function fetchWarthogPrice(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=warthog&vs_currencies=usd'
    )
    return response.data?.warthog?.usd || 0
  } catch (error) {
    console.error('Failed to fetch WART price:', error)
    return 0
  }
}


// https://wartscan.io/api/v1/accounts/transactions?address=aca4916c89b8fb47784d37ad592d378897f616569d3ee0d4
export async function getWalletTransactions(address: string) {
  try {
    const url = `https://wartscan.io/api/v1/accounts/transactions?address=${address}`
    try {
      const response = await axios.get(url)

      if (response.status === 400) {
        return []
      }

      return response.data
    } catch (requestError) {
      console.error('Request error fetching wallet transactions:', requestError)
      return []
    }
  } catch (error) {
    console.error('Error fetching wallet transactions:', error)
    return []
  }
}

