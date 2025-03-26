/* eslint-disable @typescript-eslint/no-require-imports */
import { ripemd160 } from 'ethereum-cryptography/ripemd160'
import { secp256k1 } from 'ethereum-cryptography/secp256k1'
import { sha256 } from 'ethereum-cryptography/sha256'
import { toHex } from 'ethereum-cryptography/utils'

// Custom imports
const elliptic = require('elliptic')
const ec = new elliptic.ec('secp256k1')
const crypto = require('crypto-browserify')

// PRNG
function* block_generator(seed): Generator<number, void, void> {
  let counter = 0
  while (true) {
    for (const byte of crypto
      .createHash('sha256')
      .update('prng-' + counter.toString() + '-' + seed)
      .digest()) {
      yield byte
    }
    counter++
  }
}

class PRNG {
  generator
  constructor(seed) {
    this.generator = block_generator(seed)
  }

  get_bytes(n): Uint8Array {
    const a = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      a[i] = this.generator.next().value
    }
    return a
  }
}

// workaround
function uint8_to_byte_literal(uint8): string {
  const bytes = [
    '\\x00',
    '\\x01',
    '\\x02',
    '\\x03',
    '\\x04',
    '\\x05',
    '\\x06',
    '\\x07',
    '\\x08',
    '\\t',
    '\\n',
    '\\x0b',
    '\\x0c',
    '\\r',
    '\\x0e',
    '\\x0f',
    '\\x10',
    '\\x11',
    '\\x12',
    '\\x13',
    '\\x14',
    '\\x15',
    '\\x16',
    '\\x17',
    '\\x18',
    '\\x19',
    '\\x1a',
    '\\x1b',
    '\\x1c',
    '\\x1d',
    '\\x1e',
    '\\x1f',
    ' ',
    '!',
    '"',
    '#',
    '$',
    '%',
    '&',
    "'",
    '(',
    ')',
    '*',
    '+',
    ',',
    '-',
    '.',
    '/',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    ':',
    ';',
    '<',
    '=',
    '>',
    '?',
    '@',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '[',
    '\\\\',
    ']',
    '^',
    '_',
    '`',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '{',
    '|',
    '}',
    '~',
    '\\x7f',
    '\\x80',
    '\\x81',
    '\\x82',
    '\\x83',
    '\\x84',
    '\\x85',
    '\\x86',
    '\\x87',
    '\\x88',
    '\\x89',
    '\\x8a',
    '\\x8b',
    '\\x8c',
    '\\x8d',
    '\\x8e',
    '\\x8f',
    '\\x90',
    '\\x91',
    '\\x92',
    '\\x93',
    '\\x94',
    '\\x95',
    '\\x96',
    '\\x97',
    '\\x98',
    '\\x99',
    '\\x9a',
    '\\x9b',
    '\\x9c',
    '\\x9d',
    '\\x9e',
    '\\x9f',
    '\\xa0',
    '\\xa1',
    '\\xa2',
    '\\xa3',
    '\\xa4',
    '\\xa5',
    '\\xa6',
    '\\xa7',
    '\\xa8',
    '\\xa9',
    '\\xaa',
    '\\xab',
    '\\xac',
    '\\xad',
    '\\xae',
    '\\xaf',
    '\\xb0',
    '\\xb1',
    '\\xb2',
    '\\xb3',
    '\\xb4',
    '\\xb5',
    '\\xb6',
    '\\xb7',
    '\\xb8',
    '\\xb9',
    '\\xba',
    '\\xbb',
    '\\xbc',
    '\\xbd',
    '\\xbe',
    '\\xbf',
    '\\xc0',
    '\\xc1',
    '\\xc2',
    '\\xc3',
    '\\xc4',
    '\\xc5',
    '\\xc6',
    '\\xc7',
    '\\xc8',
    '\\xc9',
    '\\xca',
    '\\xcb',
    '\\xcc',
    '\\xcd',
    '\\xce',
    '\\xcf',
    '\\xd0',
    '\\xd1',
    '\\xd2',
    '\\xd3',
    '\\xd4',
    '\\xd5',
    '\\xd6',
    '\\xd7',
    '\\xd8',
    '\\xd9',
    '\\xda',
    '\\xdb',
    '\\xdc',
    '\\xdd',
    '\\xde',
    '\\xdf',
    '\\xe0',
    '\\xe1',
    '\\xe2',
    '\\xe3',
    '\\xe4',
    '\\xe5',
    '\\xe6',
    '\\xe7',
    '\\xe8',
    '\\xe9',
    '\\xea',
    '\\xeb',
    '\\xec',
    '\\xed',
    '\\xee',
    '\\xef',
    '\\xf0',
    '\\xf1',
    '\\xf2',
    '\\xf3',
    '\\xf4',
    '\\xf5',
    '\\xf6',
    '\\xf7',
    '\\xf8',
    '\\xf9',
    '\\xfa',
    '\\xfb',
    '\\xfc',
    '\\xfd',
    '\\xfe',
    '\\xff',
  ]
  return bytes[uint8]
}

// expects mnemonic phrase as string in format: "word1 word2 word3 word4 word5..."
// returns private key as integer (point on curve)
function warthog_mnemo_to_pk(mnemo): bigint {
  const order =
    BigInt(
      115792089237316195423570985008687907852837564279074904382605163141518161494337n,
    )
  const bytes = 32

  const mnemo_hash = crypto.pbkdf2Sync(mnemo, 'mnemonic', 2048, 64, 'sha512')

  let seed = ''
  for (const byte of mnemo_hash) {
    seed += uint8_to_byte_literal(byte)
  }
  if (seed.includes("'")) {
    seed = 'b"' + seed + '"'
  } else {
    seed = "b'" + seed + "'"
  }

  const prng = new PRNG(seed)
  while (true) {
    const extrabyte = new Uint8Array(1)
    extrabyte[0] = prng.get_bytes(1)[0] & 1

    const guess = new Uint8Array(33)
    guess.set(extrabyte)
    guess.set(prng.get_bytes(bytes), 1)
    const guess_int = BigInt('0x' + Buffer.from(guess).toString('hex'))

    // Compare to both variables to fix the type comparision issue
    if (BigInt(1) <= guess_int && guess_int < order) {
      return guess_int + BigInt(1)
    }
  }
}

// Wartlock implementations
export async function walletFromSeed(
  seed: string,
): Promise<{ address: string; privateKey: string }> {
  const privateKeyHex = ec
    .keyFromPrivate(warthog_mnemo_to_pk(seed), 10)
    .getPrivate()
    .toString('hex')
  const privateKey = new Uint8Array(Buffer.from(privateKeyHex, 'hex'))
  const publicKey = secp256k1.getPublicKey(privateKey, true)
  const address = addressFromPublicKey(publicKey)

  return { address, privateKey: toHex(privateKey) }
}

export async function walletFromPkHex(pkHex): Promise<{
  address: string
  privateKey: string
}> {
  const privateKey = Buffer.from(pkHex, 'hex')
  const publicKey = secp256k1.getPublicKey(privateKey, true)
  return {
    address: addressFromPublicKey(publicKey),
    privateKey: toHex(privateKey),
  }
}

function addressFromPublicKey(publicKey): string {
  const sha256Hash = sha256(publicKey)
  const ripemd160Hash = ripemd160(sha256Hash)
  const checksum = sha256(ripemd160Hash).slice(0, 4)
  const addressBytes = new Uint8Array([...ripemd160Hash, ...checksum])
  return toHex(addressBytes)
}
