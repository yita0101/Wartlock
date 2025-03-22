import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { useParams } from 'react-router'

export const CreateTransactionModal = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { walletId } = useParams<{ walletId: string }>()

  const [amount, setAmount] = useState('0.00000001')
  const [developerFee, setDeveloperFee] = useState('0.00000001')
  const [networkFee, setNetworkFee] = useState('0.00000001')
  const [recipient, setRecipient] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (!walletId) return
      try {
        const walletData = await window.dbAPI.getWalletById(Number(walletId))
        if (walletData?.address) {
          setWalletAddress(walletData.address)
        }
      } catch (err) {
        console.error('Failed to fetch wallet address:', err)
      }
    }
    fetchWalletAddress()
  }, [walletId])

  useEffect(() => {
    const calculatedDevFee = (parseFloat(amount) * 0.05).toFixed(8)
    setDeveloperFee(calculatedDevFee)
  }, [amount])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!walletAddress) {
      addToast({
        title: 'Error',
        description: 'Wallet address not found',
        color: 'danger',
        timeout: 2000,
      })
      return
    }

    try {
      const txData = {
        recipient,
        amount: parseFloat(amount),
        fee: parseFloat(networkFee),
      }

      const privateKey = await window.storageAPI.getPrivateKey(walletAddress)
      const peerUrl = await window.dbAPI.getPeer()

      await window.walletAPI.sendTransaction(
        txData.recipient,
        txData.amount,
        txData.fee,
        String(privateKey),
        peerUrl,
      )

      // Optional: Send dev fees if the user agrees to it
      // Could be disabled by setting developerFee to 0
      if (parseFloat(developerFee) > 0) {
        await window.walletAPI.sendTransaction(
          'aca4916c89b8fb47784d37ad592d378897f616569d3ee0d4',
          parseFloat(developerFee),
          0,
          String(privateKey),
          peerUrl,
        )
      }

      addToast({
        title: 'Transaction Sent',
        description: 'Your transaction has been sent successfully!',
        color: 'success',
        timeout: 2000,
      })

      onClose()
    } catch (err) {
      console.error('Transaction failed:', err)
      addToast({
        title: 'Transaction Failed',
        description: 'Something went wrong while sending the transaction',
        color: 'danger',
        timeout: 2000,
      })
    }
  }

  return (
    <>
      <Button
        color="secondary"
        variant="shadow"
        className="px-6 font-light"
        startContent={<BiDollar className="text-default-800" size={20} />}
        onPress={onOpen}
      >
        Make Transaction
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hideCloseButton
        classNames={{ wrapper: 'overflow-hidden' }}
        className="bg-default-100"
      >
        <ModalContent>
          <div className="space-y-12 px-12 py-12">
            <ModalHeader className="block space-y-6 text-center">
              <h3 className="text-[28px]">Make a Transaction</h3>
              <p className="text-lg font-normal text-default-400">
                Send WART to other wallets through Wartlock
              </p>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={onSubmit} className="space-y-10">
                <Input
                  name="amount"
                  type="number"
                  labelPlacement="outside"
                  label="Amount"
                  isRequired
                  size="lg"
                  autoFocus
                  variant="faded"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Input
                  name="networkFee"
                  type="number"
                  labelPlacement="outside"
                  label="Network Fee"
                  isRequired
                  size="lg"
                  variant="faded"
                  value={networkFee}
                  onChange={(e) => setNetworkFee(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Input
                  name="developerFee"
                  type="number"
                  labelPlacement="outside"
                  label="Developer Fee (5%)"
                  size="lg"
                  variant="faded"
                  value={developerFee}
                  onChange={(e) => setDeveloperFee(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Input
                  name="recipient"
                  type="text"
                  labelPlacement="outside"
                  label="Recipient"
                  isRequired
                  size="lg"
                  variant="faded"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Button color="default" type="submit" fullWidth radius="sm">
                  Make Transaction
                </Button>
              </Form>
            </ModalBody>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
