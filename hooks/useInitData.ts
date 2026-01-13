'use client'

import { useEffect, useState } from 'react'
import { useTelegram } from './useTelegram'
import { validateInitData } from '@/utils/telegram'

export function useInitData() {
  const { webApp, isReady, isDevMode } = useTelegram()
  const [isValidated, setIsValidated] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!webApp || !isReady || isDevMode) {
      // В dev режиме пропускаем валидацию
      if (isDevMode) {
        setIsValidated(true)
        setIsValid(true)
      }
      return
    }

    const initData = webApp.initData

    if (!initData) {
      setError('initData не найден')
      setIsValidated(true)
      return
    }

    // Валидируем initData на бэкенде
    validateInitData(initData)
      .then((result) => {
        setIsValid(result.valid)
        setIsValidated(true)
        if (!result.valid) {
          setError('Невалидный initData')
        }
      })
      .catch((err) => {
        setError(err.message)
        setIsValidated(true)
      })
  }, [webApp, isReady, isDevMode])

  return {
    isValidated,
    isValid,
    error,
    initData: webApp?.initData || null,
  }
}

