import { useEffect, useRef } from 'react'

/**
 * Custom hook for accessing previous value of a state
 * @param value The current value
 * @returns The previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
