import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface AssistedPasswordConfirmationProps {
  password: string
  children?: ReactNode
}

export function AssistedPasswordConfirmation({ password }: AssistedPasswordConfirmationProps) {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [shake, setShake] = useState(false)

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (
      confirmPassword.length >= password.length &&
      e.target.value.length > confirmPassword.length
    ) {
      setShake(true)
    } else {
      setConfirmPassword(e.target.value)
    }
  }

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [shake])

  const getLetterStatus = (letter: string, index: number) => {
    if (!confirmPassword[index]) return ''
    return confirmPassword[index] === letter
      ? 'bg-green-500/20'
      : 'bg-red-500/20'
  }

  const passwordsMatch = password === confirmPassword

  const bounceAnimation = {
    x: shake ? [-10, 10, -10, 10, 0] : 0,
    transition: { duration: 0.5 },
  }

  const matchAnimation = {
    scale: passwordsMatch ? [1, 1.05, 1] : 1,
    transition: { duration: 0.3 },
  }

  const borderAnimation = {
    borderColor: passwordsMatch ? '#10B981' : '#e5e7eb',
    transition: { duration: 0.3 },
  }

  return (
    <div className="relative flex w-full flex-col items-start justify-center">
      <span className="mb-3 text-sm text-foreground font-semibold">→ {password}</span>
      <motion.div
        className="mb-3 h-[52px] w-full rounded-xl border-2 bg-background px-2 py-2"
        animate={{
          ...bounceAnimation,
          ...matchAnimation,
          ...borderAnimation,
        }}
      >
        <div className="relative h-full w-fit overflow-hidden rounded-lg">
          <div className="z-10 flex h-full items-center justify-center bg-transparent px-0 py-1 tracking-[0.15em]">
            {password.split('').map((_, index) => (
              <div
                key={index}
                className="flex h-full w-4 shrink-0 items-center justify-center"
              >
                <span className="size-[5px] rounded-full bg-muted-foreground/50"></span>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 top-0 z-0 flex h-full w-full items-center justify-start">
            {password.split('').map((letter, index) => (
              <motion.div
                key={index}
                className={`ease absolute h-full w-4 transition-all duration-300 ${getLetterStatus(
                  letter,
                  index,
                )}`}
                style={{
                  left: `${index * 16}px`,
                  scaleX: confirmPassword[index] ? 1 : 0,
                  transformOrigin: 'left',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: confirmPassword[index] ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="h-[52px] w-full overflow-hidden rounded-xl border-2"
        animate={matchAnimation}
      >
        <motion.input
          className="h-full w-full rounded-xl border-0 bg-background px-3.5 py-3 tracking-[0.4em] outline-none placeholder:tracking-normal focus-visible:ring-2 focus-visible:ring-ring text-foreground placeholder:text-muted-foreground"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          animate={borderAnimation}
        />
      </motion.div>
    </div>
  )
}
