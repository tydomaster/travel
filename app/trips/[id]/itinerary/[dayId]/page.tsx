'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TelegramHeader from '@/components/TelegramHeader'
import {
  getDay,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
  Day,
  Item,
  CreateItemData,
  UpdateItemData,
} from '@/lib/api/itinerary'

export default function DayPage({
  params,
}: {
  params: { id: string; dayId: string }
}) {
  const router = useRouter()
  const tripId = Number(params.id)
  const dayId = Number(params.dayId)
  const [day, setDay] = useState<Day | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [draggedItem, setDraggedItem] = useState<Item | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  useEffect(() => {
    loadDay()
  }, [tripId, dayId])

  const loadDay = async () => {
    try {
      setLoading(true)
      const data = await getDay(tripId, dayId)
      setDay(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки дня')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async (data: CreateItemData) => {
    try {
      // Optimistic update
      const tempId = Date.now()
      const tempItem: Item = {
        id: tempId,
        dayId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (day) {
        setDay({
          ...day,
          items: [...day.items, tempItem].sort((a, b) => a.order - b.order),
        })
      }

      const newItem = await createItem(tripId, dayId, data)
      
      if (day) {
        setDay({
          ...day,
          items: day.items
            .map((item) => (item.id === tempId ? newItem : item))
            .sort((a, b) => a.order - b.order),
        })
      }
      setShowAddItem(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания пункта')
      loadDay() // Rollback
    }
  }

  const handleUpdateItem = async (itemId: number, data: UpdateItemData) => {
    try {
      // Optimistic update
      if (day) {
        setDay({
          ...day,
          items: day.items.map((item) =>
            item.id === itemId
              ? { ...item, ...data, updatedAt: new Date().toISOString() }
              : item
          ),
        })
      }

      const updatedItem = await updateItem(tripId, dayId, itemId, data)
      
      if (day) {
        setDay({
          ...day,
          items: day.items.map((item) =>
            item.id === itemId ? updatedItem : item
          ),
        })
      }
      setEditingItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления пункта')
      loadDay() // Rollback
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      // Optimistic update
      if (day) {
        setDay({
          ...day,
          items: day.items.filter((item) => item.id !== itemId),
        })
      }

      await deleteItem(tripId, dayId, itemId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления пункта')
      loadDay() // Rollback
    }
  }

  const handleDragStart = (item: Item) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent, targetItem: Item) => {
    e.preventDefault()
    if (!draggedItem || !day || draggedItem.id === targetItem.id) return

    const targetIndex = day.items.findIndex((i) => i.id === targetItem.id)
    setDragOverIndex(targetIndex)

    const draggedIndex = day.items.findIndex((i) => i.id === draggedItem.id)

    if (draggedIndex === targetIndex) return

    const newItems = [...day.items]
    newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    // Обновляем order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    setDay({ ...day, items: updatedItems })
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDragEnd = async () => {
    if (!draggedItem || !day) return

    try {
      const itemIds = day.items.map((item) => item.id)
      await reorderItems(tripId, dayId, itemIds)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка изменения порядка')
      loadDay() // Rollback
    } finally {
      setDraggedItem(null)
      setDragOverIndex(null)
    }
  }

  const calculateNextTime = (items: Item[], index: number): string | undefined => {
    if (index === 0) return undefined

    const prevItem = items[index - 1]
    if (!prevItem.startTime || !prevItem.durationMinutes) return undefined

    const [hours, minutes] = prevItem.startTime.split(':').map(Number)
    const start = new Date()
    start.setHours(hours, minutes, 0, 0)
    start.setMinutes(start.getMinutes() + prevItem.durationMinutes)

    return `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
  }

  const recalculateTimings = async () => {
    if (!day || day.items.length === 0) return

    const firstItem = day.items[0]
    if (!firstItem.startTime) {
      setError('Установите время начала для первого пункта')
      return
    }

    try {
      const updatedItems: Item[] = []
      let currentTime = firstItem.startTime

      for (let i = 0; i < day.items.length; i++) {
        const item = day.items[i]
        const updatedItem = { ...item }

        if (i === 0) {
          updatedItem.startTime = currentTime
        } else {
          const prevItem = updatedItems[i - 1]
          if (prevItem.startTime && prevItem.durationMinutes) {
            const [hours, minutes] = prevItem.startTime.split(':').map(Number)
            const start = new Date()
            start.setHours(hours, minutes, 0, 0)
            start.setMinutes(start.getMinutes() + prevItem.durationMinutes)
            currentTime = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`
            updatedItem.startTime = currentTime
          }
        }

        updatedItems.push(updatedItem)
      }

      // Обновляем все items
      await Promise.all(
        updatedItems.map((item) =>
          updateItem(tripId, dayId, item.id, {
            startTime: item.startTime,
            durationMinutes: item.durationMinutes,
            title: item.title,
            placeId: item.placeId,
            notes: item.notes,
            order: item.order,
          })
        )
      )

      // Перезагружаем день
      await loadDay()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка пересчёта таймингов')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="День" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
            Загрузка...
          </p>
        </main>
      </div>
    )
  }

  if (error && !day) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
      >
        <TelegramHeader title="День" showBack={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              Назад
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!day) return null

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}
    >
      <TelegramHeader title={formatDate(day.date)} showBack={true} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center gap-2">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            {formatDate(day.date)}
          </h1>
          <div className="flex gap-2">
            {day.items.length > 0 && (
              <button
                onClick={recalculateTimings}
                className="px-3 py-2 rounded-lg text-sm font-medium transition opacity-90 hover:opacity-100"
                style={{
                  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
                  color: 'var(--tg-theme-text-color, #000000)',
                }}
                title="Пересчитать тайминги"
              >
                ⏱ Пересчитать
              </button>
            )}
            <button
              onClick={() => setShowAddItem(true)}
              className="px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
                color: 'var(--tg-theme-button-text-color, #ffffff)',
              }}
            >
              + Добавить пункт
            </button>
          </div>
        </div>

        {error && (
          <div
            className="rounded-lg p-4 mb-4"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {showAddItem && (
          <ItemForm
            onSubmit={(data) => {
              const maxOrder = day.items.length > 0 
                ? Math.max(...day.items.map(i => i.order)) + 1 
                : 0
              handleCreateItem({ ...data, order: maxOrder })
            }}
            onCancel={() => setShowAddItem(false)}
            suggestedTime={day.items.length > 0 
              ? calculateNextTime(day.items, day.items.length) 
              : undefined}
          />
        )}

        {editingItem && (
          <ItemForm
            item={editingItem}
            onSubmit={(data) => handleUpdateItem(editingItem.id, data)}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {day.items.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            }}
          >
            <p style={{ color: 'var(--tg-theme-hint-color, #999999)' }}>
              Нет запланированных пунктов
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {day.items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={() => setEditingItem(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onDragStart={() => handleDragStart(item)}
                onDragOver={(e) => handleDragOver(e, item)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                isDragging={draggedItem?.id === item.id}
                isDragOver={dragOverIndex === index}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface ItemFormProps {
  item?: Item
  onSubmit: (data: CreateItemData | UpdateItemData) => void
  onCancel: () => void
  suggestedTime?: string
}

function ItemForm({ item, onSubmit, onCancel, suggestedTime }: ItemFormProps) {
  const [title, setTitle] = useState(item?.title || '')
  const [startTime, setStartTime] = useState(item?.startTime || suggestedTime || '')
  const [durationMinutes, setDurationMinutes] = useState(
    item?.durationMinutes?.toString() || ''
  )
  const [notes, setNotes] = useState(item?.notes || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmit({
      title: title.trim(),
      startTime: startTime || undefined,
      durationMinutes: durationMinutes ? parseInt(durationMinutes) : undefined,
      notes: notes.trim() || undefined,
      order: item?.order || 0,
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg p-4 mb-4 space-y-3"
      style={{
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
      }}
    >
      <input
        type="text"
        placeholder="Название пункта *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border"
        style={{
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          color: 'var(--tg-theme-text-color, #000000)',
          borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="time"
          placeholder="Время начала"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            color: 'var(--tg-theme-text-color, #000000)',
            borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
          }}
        />
        <input
          type="number"
          placeholder="Длительность (мин)"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          min="1"
          className="px-4 py-2 rounded-lg border"
          style={{
            backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
            color: 'var(--tg-theme-text-color, #000000)',
            borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
          }}
        />
      </div>
      <textarea
        placeholder="Заметки (необязательно)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full px-4 py-2 rounded-lg border"
        style={{
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          color: 'var(--tg-theme-text-color, #000000)',
          borderColor: 'var(--tg-theme-hint-color, #e5e5e5)',
        }}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
          style={{
            backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
            color: 'var(--tg-theme-button-text-color, #ffffff)',
          }}
        >
          {item ? 'Сохранить' : 'Добавить'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 rounded-lg font-medium transition opacity-90 hover:opacity-100"
          style={{
            backgroundColor: 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
            color: 'var(--tg-theme-text-color, #000000)',
          }}
        >
          Отмена
        </button>
      </div>
    </form>
  )
}

interface ItemCardProps {
  item: Item
  onEdit: () => void
  onDelete: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDragEnd: () => void
  isDragging: boolean
  isDragOver: boolean
}

function ItemCard({
  item,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  isDragging,
  isDragOver,
}: ItemCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDragEnd={onDragEnd}
      className={`rounded-lg p-4 transition ${
        isDragging ? 'opacity-50 scale-95' : isDragOver ? 'scale-105 border-2' : 'opacity-100'
      }`}
      style={{
        backgroundColor: isDragOver
          ? 'var(--tg-theme-button-color, #2481cc)'
          : 'var(--tg-theme-secondary-bg-color, #f1f1f1)',
        cursor: 'move',
        borderColor: isDragOver ? 'var(--tg-theme-button-color, #2481cc)' : 'transparent',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {item.startTime && (
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: 'var(--tg-theme-link-color, #2481cc)' }}
              >
                {item.startTime}
              </span>
            )}
            {item.durationMinutes && (
              <span
                className="text-xs"
                style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
              >
                {item.durationMinutes} мин
              </span>
            )}
          </div>
          <h3
            className="font-semibold mb-1"
            style={{ color: 'var(--tg-theme-text-color, #000000)' }}
          >
            {item.title}
          </h3>
          {item.notes && (
            <p
              className="text-sm"
              style={{ color: 'var(--tg-theme-hint-color, #999999)' }}
            >
              {item.notes}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm rounded transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: 'var(--tg-theme-button-color, #2481cc)',
              color: 'var(--tg-theme-button-text-color, #ffffff)',
            }}
          >
            Изменить
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm rounded transition opacity-90 hover:opacity-100"
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}

