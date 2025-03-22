import { cn } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import React, {
  createContext,
  useContext,
  useState,
  type ComponentProps,
} from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import { NavLink } from 'react-router'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as ComponentProps<'div'>)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar()
  return (
    <>
      <motion.div
        className={cn(
          'group/sidebar hidden h-full w-[90px] shrink-0 bg-default-100 px-4 py-4 md:flex md:flex-col',
          className,
        )}
        animate={{
          width: animate ? (open ? '342px' : '90px') : '90px',
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

export const MobileSidebar = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar()

  return (
    <>
      <div
        className={cn(
          'flex h-10 w-full flex-row justify-between px-4 py-4 md:hidden',
        )}
        {...props}
      >
        <button className="z-20 flex w-full cursor-pointer justify-end">
          <LuMenu className="" onClick={() => setOpen(!open)} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed inset-0 z-[100] flex h-full w-full flex-col justify-between p-10',
                className,
              )}
            >
              <button
                className="absolute right-10 top-10 z-50 cursor-pointer text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <LuX />
              </button>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
} & Omit<ComponentProps<typeof NavLink>, 'to'>) => {
  const { open, animate } = useSidebar()
  return (
    <NavLink
      to={link.href}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-start gap-2 py-2 hover:bg-default-200',
          isActive ? 'bg-default-200' : 'opacity-50',
          className,
        )
      }
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0, delay: 0 }}
        className="inline-block whitespace-pre text-sm"
      >
        {link.label}
      </motion.span>
    </NavLink>
  )
}
