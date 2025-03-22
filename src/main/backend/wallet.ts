import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256";
import { ripemd160 } from "ethereum-cryptography/ripemd160";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

export async function walletFromSeed(seed: string): Promise<{ address: string; privateKey: string }> {
  const seedBytes = utf8ToBytes(seed);
  const privateKey = derivePrivateKey(seedBytes);
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  const address = addressFromPublicKey(publicKey);

  return { address, privateKey: toHex(privateKey) };
}

export async function walletFromPkHex(pkHex) {
  const privateKey = Buffer.from(pkHex, 'hex');
  const publicKey = secp256k1.getPublicKey(privateKey, true);
  return {
      address: addressFromPublicKey(publicKey),
      privateKey: toHex(privateKey)
  };
}

function derivePrivateKey(seed) {
  const hash = sha256(seed);
  return hash.slice(0, 32);
}

function addressFromPublicKey(publicKey) {
  const sha256Hash = sha256(publicKey);
  const ripemd160Hash = ripemd160(sha256Hash);
  const checksum = sha256(ripemd160Hash).slice(0, 4);
  const addressBytes = new Uint8Array([...ripemd160Hash, ...checksum]);
  return toHex(addressBytes);
}
