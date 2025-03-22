import * as bip39 from "bip39";

export function generateMnemonic(strength: 256 | 128 | 160 | 192 | 224 = 256): string {
  return bip39.generateMnemonic(strength);
}

export function mnemonicToSeed(mnemonic: string, passphrase: string = ""): Buffer {
  return bip39.mnemonicToSeedSync(mnemonic, passphrase);
}