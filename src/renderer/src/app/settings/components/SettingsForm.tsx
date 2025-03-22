import { addToast, Button, Form, Input } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const SettingsForm = () => {
  const [, setPeer] = useState('')
  const [inputValue, setInputValue] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchPeer = async () => {
      const fetchedPeer = await window.dbAPI.getPeer()
      if (isMounted) {
        setPeer(fetchedPeer)
        setInputValue(fetchedPeer)
      }
    }

    fetchPeer()

    return () => {
      isMounted = false
    }
  }, [])

  const handleCancel = () => {
    navigate('/')
  }

  const handleConfirm = async () => {
    if (!inputValue.trim()) {
      alert('Please enter a valid peer')
      return
    }

    try {
      await window.dbAPI.updatePeer(inputValue)
      addToast({
        title: 'Peer updated successfully',
        description: 'Your peer has been updated successfully',
        color: 'success',
        timeout: 2000,
      })
    } catch (error) {
      addToast({
        title: 'Failed to update peer',
        description: 'Your peer has not been updated',
        color: 'danger',
        timeout: 2000,
      })
    }
  }

  return (
    <Form
      className="w-full max-w-lg space-y-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        type="text"
        name="peer"
        errorMessage="Please enter a valid peer"
        placeholder="Enter your Peer"
        className="w-full"
        labelPlacement="outside"
        label="Peer"
        size="lg"
        isRequired
        variant="faded"
        autoFocus
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        classNames={{ inputWrapper: 'bg-default-200' }}
      />

      <div className="ml-auto flex w-3/5 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          color="danger"
          size="lg"
          fullWidth
          onPress={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          color="secondary"
          size="lg"
          fullWidth
          onPress={handleConfirm}
        >
          Confirm
        </Button>
      </div>
    </Form>
  )
}
