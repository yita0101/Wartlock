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
  Switch,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { BiDollar } from 'react-icons/bi'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

export const CreateTransactionModal = () => {
  const { t } = useTranslation()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { walletId } = useParams<{ walletId: string }>()

  const [amount, setAmount] = useState('')
  const [networkFee, setNetworkFee] = useState('0.00000001')
  const [developerFee, setDeveloperFee] = useState('0')
  const [recipient, setRecipient] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [payDevFee, setPayDevFee] = useState(true)

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
    if (amount && payDevFee) {
      // 计算5%的开发者费用
      const devFee = (parseFloat(amount) * 0.05).toFixed(8)
      setDeveloperFee(devFee)
    } else {
      setDeveloperFee('0')
    }
  }, [amount, payDevFee])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!walletAddress) {
      addToast({
        title: t('toasts.error.title', 'Error'),
        description: t('toasts.walletNotFound.description', 'Wallet address not found'),
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

      await window.walletAPI.sendTransaction(
        txData.recipient,
        txData.amount,
        txData.fee,
        String(privateKey),
        peerUrl,
      )

      addToast({
        title: t('walletDetails.transactionSent', 'Transaction Sent'),
        description: t('walletDetails.transactionSuccess', 'Your transaction has been sent successfully!'),
        color: 'success',
        timeout: 2000,
      })

      onClose()
    } catch (err) {
      console.error('Transaction failed:', err)
      addToast({
        title: t('walletDetails.transactionFailed', 'Transaction Failed'),
        description: t('walletDetails.transactionError', 'Something went wrong while sending the transaction'),
        color: 'danger',
        timeout: 2000,
      })
    }
  }

  return (
    <>
      <Button
        color="primary"
        variant="shadow"
        className="px-4 py-2 font-medium rounded-md"
        startContent={<BiDollar className="text-white" size={18} />}
        onPress={onOpen}
      >
        {t('walletDetails.makeTransaction')}
      </Button>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        hideCloseButton
        classNames={{
          wrapper: 'overflow-hidden',
          base: "rounded-lg border border-border dark:border-border shadow-lg"
        }}
        className="bg-background dark:bg-background"
      >
        <ModalContent>
          <div className="space-y-8 px-8 py-8">
            <ModalHeader className="block space-y-4 text-center px-0">
              <h3 className="text-2xl font-medium text-text-primary dark:text-text-primary">
                {t('walletDetails.makeTransaction')}
              </h3>
              <p className="text-base font-normal text-text-tertiary dark:text-text-tertiary">
                {t('walletDetails.sendDescription', 'Send WART to other wallets through Wartlock')}
              </p>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={onSubmit} className="space-y-6">
                <Input
                  name="amount"
                  type="number"
                  labelPlacement="outside"
                  label={t('walletDetails.amount', 'Amount')}
                  isRequired
                  size="lg"
                  autoFocus
                  variant="bordered"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-surface dark:bg-surface"
                  classNames={{
                    input: "text-text-primary dark:text-text-primary",
                    label: "text-text-secondary dark:text-text-secondary font-medium"
                  }}
                />
                <Input
                  name="networkFee"
                  type="number"
                  labelPlacement="outside"
                  label={t('walletDetails.networkFee', 'Network Fee')}
                  isRequired
                  size="lg"
                  variant="bordered"
                  value={networkFee}
                  onChange={(e) => setNetworkFee(e.target.value)}
                  className="bg-surface dark:bg-surface"
                  classNames={{
                    input: "text-text-primary dark:text-text-primary",
                    label: "text-text-secondary dark:text-text-secondary font-medium"
                  }}
                />
                <div className="flex items-center justify-between mb-4">
                  <span className="text-md font-medium text-text-secondary dark:text-text-secondary mr-4">
                    {t('walletDetails.payDevFee', 'Pay Developer Fee (5%)')}
                  </span>
                  <Switch 
                    isSelected={payDevFee}
                    onValueChange={setPayDevFee}
                    size="md"
                    color="primary"
                  />
                </div>
                <Input
                  name="developerFee"
                  type="number"
                  labelPlacement="outside"
                  size="lg"
                  variant="bordered"
                  value={developerFee}
                  isDisabled={!payDevFee}
                  onChange={(e) => setDeveloperFee(e.target.value)}
                  className="bg-surface dark:bg-surface"
                  classNames={{
                    input: "text-text-primary dark:text-text-primary",
                    label: "text-text-secondary dark:text-text-secondary font-medium"
                  }}
                />
                <Input
                  name="recipient"
                  type="text"
                  labelPlacement="outside"
                  label={t('walletDetails.recipient', 'Recipient')}
                  isRequired
                  size="lg"
                  variant="bordered"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="bg-surface dark:bg-surface"
                  classNames={{
                    input: "text-text-primary dark:text-text-primary",
                    label: "text-text-secondary dark:text-text-secondary font-medium"
                  }}
                />
                <div className="flex gap-4 pt-4">
                  <Button
                    color="danger"
                    variant="flat"
                    className="flex-1"
                    onPress={onClose}
                  >
                    {t('passwordModal.cancel')}
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    className="flex-1"
                  >
                    {t('walletDetails.confirm', 'Confirm')}
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
