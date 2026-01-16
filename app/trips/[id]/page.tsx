'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import { getTrip, createInvite, updateMemberRole, Trip, MembershipRole } from '@/lib/api/trips'
import { useTelegram } from '@/hooks/useTelegram'
import { createTelegramMiniAppLink } from '@/utils/telegramLinks'

export default function TripOverviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { webApp } = useTelegram()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [creatingInvite, setCreatingInvite] = useState(false)
  const [updatingRole, setUpdatingRole] = useState<number | null>(null)

  const loadTrip = async () => {
    try {
      setLoading(true)
      const data = await getTrip(Number(params.id))
      setTrip(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки поездки')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrip()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleCreateInvite = async () => {
    if (!trip) return

    try {
      setCreatingInvite(true)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 дней

      const invite = await createInvite(trip.id, expiresAt.toISOString())
      
      // Создаем Telegram Mini App deep link
      const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim()
      const appName = process.env.NEXT_PUBLIC_TELEGRAM_APP_NAME?.trim()
      
      console.log('Bot username:', botUsername, 'App name:', appName)
      
      let link: string
      if (!botUsername || !appName || botUsername === 'your_bot_username' || appName === 'travel-planner') {
        console.warn(
          'NEXT_PUBLIC_TELEGRAM_BOT_USERNAME и NEXT_PUBLIC_TELEGRAM_APP_NAME не настроены. ' +
          'Используется fallback ссылка. См. TELEGRAM_INVITES.md для настройки.'
        )
        // Fallback: обычная ссылка, если переменные не настроены
        link = `${window.location.origin}/trips/${trip.id}/join?token=${invite.token}`
      } else {
        link = createTelegramMiniAppLink(botUsername, appName, invite.token)
        console.log('Created Telegram Mini App link:', link)
      }
      
      setInviteLink(link)

      // Копируем в буфер обмена с обработкой ошибок
      try {
        // Фокусируемся на документе перед копированием (требуется для Clipboard API)
        if (document.hasFocus()) {
          await navigator.clipboard.writeText(link)
        } else {
          // Если документ не в фокусе, используем альтернативный способ
          const textArea = document.createElement('textarea')
          textArea.value = link
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          try {
            document.execCommand('copy')
          } catch (err) {
            console.error('Failed to copy using execCommand:', err)
          }
          document.body.removeChild(textArea)
        }
      } catch (err) {
        console.error('Failed to copy to clipboard:', err)
        // Показываем ссылку в alert, если копирование не удалось
        alert(`Ссылка создана:\n${link}\n\nСкопируйте её вручную.`)
        return
      }

      // Показываем уведомление через Telegram или обычный alert
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success')
      }
      alert('Ссылка скопирована в буфер обмена!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания приглашения')
    } finally {
      setCreatingInvite(false)
    }
  }

  const copyInviteLink = async () => {
    if (!inviteLink) return

    try {
      // Фокусируемся на документе перед копированием
      if (document.hasFocus()) {
        await navigator.clipboard.writeText(inviteLink)
      } else {
        // Альтернативный способ копирования
        const textArea = document.createElement('textarea')
        textArea.value = inviteLink
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Failed to copy using execCommand:', err)
        }
        document.body.removeChild(textArea)
      }
      
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success')
      }
      alert('Ссылка скопирована!')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      alert(`Ссылка:\n${inviteLink}\n\nСкопируйте её вручную.`)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const getRoleName = (role: MembershipRole) => {
    switch (role) {
      case MembershipRole.Owner:
        return 'Владелец'
      case MembershipRole.Editor:
        return 'Редактор'
      case MembershipRole.Viewer:
        return 'Наблюдатель'
      default:
        return 'Участник'
    }
  }

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="Поездка" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
            Загрузка...
          </p>
        </main>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="Поездка" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }}>
              {error || 'Поездка не найдена'}
            </p>
            <button
              onClick={() => router.push('/trips')}
              className="mt-4 px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              Вернуться к поездкам
            </button>
          </div>
        </main>
      </div>
    )
  }

  const canCreateInvite = trip.role === MembershipRole.Owner || trip.role === MembershipRole.Editor
  const canChangeRoles = trip.role === MembershipRole.Owner

  const handleRoleChange = async (userId: number, newRole: MembershipRole) => {
    if (!trip) return

    try {
      setUpdatingRole(userId)
      await updateMemberRole(trip.id, userId, newRole)
      // Перезагружаем поездку, чтобы получить обновленные данные
      await loadTrip()
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка изменения роли'
      setError(errorMessage)
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('error')
      }
    } finally {
      setUpdatingRole(null)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title={trip.title} showBack={true} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Информация о поездке */}
        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            {trip.title}
          </h1>
          {(trip.startDate || trip.endDate) && (
            <p
              className="text-sm mb-2"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              {formatDate(trip.startDate) || 'Дата начала не указана'} -{' '}
              {formatDate(trip.endDate) || 'дата окончания не указана'}
            </p>
          )}
          <p
            className="text-sm"
            style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
          >
            Владелец: {trip.ownerName}
          </p>
        </div>

        {/* Участники */}
        <div
          className="rounded-lg p-6 mb-6"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            Участники ({trip.members.length})
          </h2>
          <div className="space-y-3">
            {trip.members.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
                }}
              >
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                        color: 'var(--tg-theme-button-text-color, #ffffff)',
                      }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p
                      className="font-medium"
                      style={{ color: 'var(--tg-theme-text-color, #000000)' }}
                    >
                      {member.name}
                    </p>
                    {canChangeRoles && member.role !== MembershipRole.Owner ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.userId, Number(e.target.value) as MembershipRole)
                        }
                        disabled={updatingRole === member.userId}
                        className="text-xs rounded px-2 py-1 mt-1"
                        style={{
                          backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                          color: 'var(--tg-theme-text-color, #000000)',
                          border: '1px solid var(--tg-theme-hint-color, #999999)',
                        }}
                      >
                        <option value={MembershipRole.Editor}>Редактор</option>
                        <option value={MembershipRole.Viewer}>Наблюдатель</option>
                      </select>
                    ) : (
                      <p
                        className="text-xs"
                        style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                      >
                        {getRoleName(member.role)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Приглашение */}
        {canCreateInvite && (
          <div
            className="rounded-lg p-6 mb-6"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Пригласить участников
            </h2>
            {!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || !process.env.NEXT_PUBLIC_TELEGRAM_APP_NAME ? (
              <div
                className="p-3 rounded-lg mb-3"
                style={{
                  backgroundColor: '#fff3cd',
                  color: '#856404',
                }}
              >
                <p className="text-sm mb-2">
                  ⚠️ Для создания Telegram Mini App ссылок настройте переменные окружения:
                </p>
                <p className="text-xs font-mono">
                  NEXT_PUBLIC_TELEGRAM_BOT_USERNAME<br />
                  NEXT_PUBLIC_TELEGRAM_APP_NAME
                </p>
                <p className="text-xs mt-2">
                  См. TELEGRAM_INVITES.md для инструкций
                </p>
              </div>
            ) : null}
            {inviteLink ? (
              <div className="space-y-3">
                <div
                  className="p-3 rounded-lg break-all"
                  style={{
                    backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
                    color: 'var(--tg-theme-text-color, #000000)',
                  }}
                >
                  {inviteLink}
                </div>
                {inviteLink.startsWith('https://t.me/') && (
                  <p
                    className="text-xs text-center"
                    style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
                  >
                    ✅ Telegram Mini App ссылка
                  </p>
                )}
                <button
                  onClick={copyInviteLink}
                  className="w-full px-4 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100"
                  style={{
                    backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                    color: 'var(--tg-theme-button-text-color, #ffffff)',
                  }}
                >
                  Скопировать ссылку
                </button>
              </div>
            ) : (
              <button
                onClick={handleCreateInvite}
                disabled={creatingInvite}
                className="w-full px-4 py-3 rounded-lg font-medium transition opacity-90 hover:opacity-100 disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)',
                }}
              >
                {creatingInvite ? 'Создание...' : 'Создать ссылку-приглашение'}
              </button>
            )}
          </div>
        )}

        {/* Быстрые кнопки */}
        <div className="mb-6">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            Разделы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href={`/trips/${params.id}/itinerary`}
            className="rounded-lg p-6 transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Маршрут
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Планируйте программу по дням
            </p>
          </Link>

          <Link
            href={`/trips/${params.id}/places`}
            className="rounded-lg p-6 transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Места
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Ищите и добавляйте места
            </p>
          </Link>

          <Link
            href={`/trips/${params.id}/lists`}
            className="rounded-lg p-6 transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Списки
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Вещи, дела, покупки
            </p>
          </Link>

          <Link
            href={`/trips/${params.id}/flights`}
            className="rounded-lg p-6 transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Рейсы
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              Управление рейсами
            </p>
          </Link>

          <Link
            href={`/trips/${params.id}/assistant`}
            className="rounded-lg p-6 transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--tg-theme-text-color, #000000)' }}
            >
              Ассистент
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              AI-помощник для планирования
            </p>
          </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

