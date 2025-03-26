import keytar from 'keytar'

const SERVICE_NAME = 'wartlock'

export async function storePrivateKey(
  address: string,
  privateKey: string,
): Promise<void> {
  await keytar.setPassword(SERVICE_NAME, address, privateKey)
}

export async function getPrivateKey(address: string): Promise<string | null> {
  return await keytar.getPassword(SERVICE_NAME, address)
}

export async function deletePrivateKey(address: string): Promise<void> {
  await keytar.deletePassword(SERVICE_NAME, address)
}
