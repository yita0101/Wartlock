import { faker } from '@faker-js/faker'

export type Transaction = {
  hash: string
  timestamp: Date
  amount: number
  fee: number
  sender: string
  recipient: string
}

export const transactions: Transaction[] = Array.from({ length: 10 }, (_) => ({
  hash: faker.string.hexadecimal({ length: 32 }),
  timestamp: faker.date.past(),
  amount: faker.number.float({ min: 1, max: 1000 }),
  fee: faker.number.float({ min: 1, max: 1000 }),
  sender: faker.string.alpha(32),
  recipient: faker.string.alpha(32),
}))
