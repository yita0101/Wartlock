import keytar from 'keytar';

const SERVICE_NAME = 'wartlock';

export async function storePrivateKey(address: string, privateKey: string) {
    await keytar.setPassword(SERVICE_NAME, address, privateKey);
}

export async function getPrivateKey(address: string) {
  return await keytar.getPassword(SERVICE_NAME, address);
}

export async function deletePrivateKey(address: string) {
  await keytar.deletePassword(SERVICE_NAME, address);
}