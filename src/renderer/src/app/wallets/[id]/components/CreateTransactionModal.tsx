import {
  addToast,
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
  useDisclosure,
} from '@heroui/react'
import { useEffect, useState, type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { BiDollar } from 'react-icons/bi'
import { useParams } from 'react-router'

export const CreateTransactionModal: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { walletId } = useParams<{ walletId: string }>()
  const { t } = useTranslation()

  const [amount, setAmount] = useState('')
  const [networkFee, setNetworkFee] = useState('0.00000001')
  const [developerFee, setDeveloperFee] = useState('5')
  const [recipient, setRecipient] = useState('')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [payDevFee, setPayDevFee] = useState(true)

  useEffect(() => {
    const fetchWalletAddress = async (): Promise<void> => {
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
    }
  }, [amount, payDevFee])

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault()
    if (!walletAddress) {
      addToast({
        title: t('walletDetails.error'),
        description: t('walletDetails.walletNotFound'),
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
        title: t('walletDetails.transactionSent'),
        description: t('walletDetails.transactionSuccess'),
        color: 'success',
        timeout: 2000,
      })

      onClose()
    } catch (err) {
      console.error('Transaction failed:', err)
      addToast({
        title: t('walletDetails.transactionFailed'),
        description: t('walletDetails.transactionError'),
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
        {t('walletDetails.makeTransaction')}
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
              <h3 className="text-[28px]">
                {t('walletDetails.makeTransaction')}
              </h3>
              <p className="text-lg font-normal text-default-400">
                {t('walletDetails.sendDescription')}
              </p>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={onSubmit} className="space-y-10">
                <Input
                  name="amount"
                  type="number"
                  labelPlacement="outside"
                  label={t('walletDetails.amount')}
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
                  label={t('walletDetails.networkFee')}
                  isRequired
                  size="lg"
                  variant="faded"
                  value={networkFee}
                  onChange={(e) => setNetworkFee(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-md text-text-secondary dark:text-text-secondary mr-4 font-medium">
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
                  variant="faded"
                  value={developerFee}
                  isDisabled={!payDevFee}
                  onChange={(e) => setDeveloperFee(e.target.value)}
                />
                <Input
                  name="recipient"
                  type="text"
                  labelPlacement="outside"
                  label={t('walletDetails.recipient')}
                  isRequired
                  size="lg"
                  variant="faded"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  classNames={{ inputWrapper: 'bg-default-200' }}
                />
                <Button color="default" type="submit" fullWidth radius="sm">
                  {t('walletDetails.confirm')}
                </Button>
              </Form>
            </ModalBody>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
