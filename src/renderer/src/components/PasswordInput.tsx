import { Input } from '@heroui/react'
import { useState, type ComponentProps } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

type PasswordInputProps = ComponentProps<typeof Input>

export const PasswordInput = ({
  label = 'Password',
  ...props
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Input
      name="password"
      size="sm"
      label={label}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
          aria-label="toggle password visibility"
        >
          {isVisible ? (
            <FaEye className="pointer-events-none text-default-400" size={20} />
          ) : (
            <FaEyeSlash
              className="pointer-events-none text-default-400"
              size={20}
            />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      {...props}
    />
  )
}
