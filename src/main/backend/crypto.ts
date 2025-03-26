/* eslint-disable @typescript-eslint/no-require-imports */
import base64url from 'base64url' // Install via `npm install base64url`
import crypto from 'crypto'

const { Secret, Token } = require('fernet')
const PBKDF2_ITERATIONS = 480000
const KEY_LENGTH = 32
const SALT_LENGTH = 16

/**
 * Encrypts a private key using Fernet-like encryption.
 */
export function encryptPrivateKey(
  pk: string,
  password: string,
): { encrypted: string; salt: string } {
  // Generate a random salt (16 bytes)
  const salt = crypto.randomBytes(SALT_LENGTH)

  // Derive a 32-byte key using PBKDF2-HMAC-SHA256
  const key = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    'sha256',
  )

  // Encode key in base64 (Fernet requires 32-byte base64-encoded keys)
  const fernetKey = base64url.encode(key)

  // Create a Fernet token and encrypt the private key
  const secret = new Secret(fernetKey)
  const token = new Token({ secret })
  const encrypted = token.encode(pk) // Encrypt the private key

  return {
    encrypted, // Encrypted private key (Fernet format)
    salt: salt.toString('base64'), // Convert salt to base64 string
  }
}

/**
 * Decrypts a private key using the same method as Python's Fernet.
 */
export function decryptPrivateKey(
  encrypted: string,
  password: string,
  salt: string,
): string | null {
  const key = crypto.pbkdf2Sync(
    password,
    Buffer.from(salt, 'base64'),
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    'sha256',
  )

  const fernetKey = base64url.encode(key)

  const fernet = new Secret(fernetKey)
  const token = new Token({
    secret: fernet,
    token: encrypted,
    ttl: 0, // No expiration time
  })

  try {
    return token.decode()
  } catch {
    return null // Wrong password or corrupted data
  }
}
