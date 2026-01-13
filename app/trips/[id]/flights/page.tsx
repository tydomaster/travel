import Navigation from '@/components/Navigation'
import Link from 'next/link'

export default function FlightsPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/trips/${params.id}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Назад к поездке
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Рейсы</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-500">Управление рейсами (в разработке)</p>
        </div>
      </main>
    </div>
  )
}

