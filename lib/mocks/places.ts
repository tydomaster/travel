/**
 * Моковые данные популярных мест для тестирования
 */

export interface MockPlace {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  description?: string
  city: string
  category: 'attraction' | 'restaurant' | 'hotel' | 'museum' | 'park' | 'shopping'
}

export const MOCK_PLACES: MockPlace[] = [
  // Москва
  {
    id: 'moscow-red-square',
    name: 'Красная площадь',
    latitude: 55.7539,
    longitude: 37.6208,
    address: 'Красная площадь, Москва',
    description: 'Главная площадь Москвы, объект Всемирного наследия ЮНЕСКО',
    city: 'Москва',
    category: 'attraction',
  },
  {
    id: 'moscow-kremlin',
    name: 'Московский Кремль',
    latitude: 55.752,
    longitude: 37.6175,
    address: 'Московский Кремль, Москва',
    description: 'Исторический комплекс в центре Москвы',
    city: 'Москва',
    category: 'attraction',
  },
  {
    id: 'moscow-tretyakov',
    name: 'Третьяковская галерея',
    latitude: 55.7415,
    longitude: 37.6208,
    address: 'Лаврушинский переулок, 10, Москва',
    description: 'Крупнейший музей русского искусства',
    city: 'Москва',
    category: 'museum',
  },
  {
    id: 'moscow-gorky-park',
    name: 'Парк Горького',
    latitude: 55.7321,
    longitude: 37.6014,
    address: 'Крымский Вал, 9, Москва',
    description: 'Центральный парк культуры и отдыха',
    city: 'Москва',
    category: 'park',
  },
  {
    id: 'moscow-arbat',
    name: 'Арбат',
    latitude: 55.7522,
    longitude: 37.5916,
    address: 'Арбат, Москва',
    description: 'Пешеходная улица в центре Москвы',
    city: 'Москва',
    category: 'shopping',
  },

  // Санкт-Петербург
  {
    id: 'spb-hermitage',
    name: 'Эрмитаж',
    latitude: 59.9398,
    longitude: 30.3146,
    address: 'Дворцовая площадь, 2, Санкт-Петербург',
    description: 'Один из крупнейших художественных музеев мира',
    city: 'Санкт-Петербург',
    category: 'museum',
  },
  {
    id: 'spb-palace-square',
    name: 'Дворцовая площадь',
    latitude: 59.9387,
    longitude: 30.3162,
    address: 'Дворцовая площадь, Санкт-Петербург',
    description: 'Главная площадь Санкт-Петербурга',
    city: 'Санкт-Петербург',
    category: 'attraction',
  },
  {
    id: 'spb-neva',
    name: 'Невский проспект',
    latitude: 59.9343,
    longitude: 30.3351,
    address: 'Невский проспект, Санкт-Петербург',
    description: 'Главная улица Санкт-Петербурга',
    city: 'Санкт-Петербург',
    category: 'shopping',
  },
  {
    id: 'spb-peterhof',
    name: 'Петергоф',
    latitude: 59.8857,
    longitude: 29.9075,
    address: 'Петергоф, Санкт-Петербург',
    description: 'Дворцово-парковый ансамбль с фонтанами',
    city: 'Санкт-Петербург',
    category: 'attraction',
  },

  // Париж
  {
    id: 'paris-eiffel',
    name: 'Эйфелева башня',
    latitude: 48.8584,
    longitude: 2.2945,
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    description: 'Символ Парижа и Франции',
    city: 'Париж',
    category: 'attraction',
  },
  {
    id: 'paris-louvre',
    name: 'Лувр',
    latitude: 48.8606,
    longitude: 2.3376,
    address: 'Rue de Rivoli, 75001 Paris',
    description: 'Крупнейший художественный музей мира',
    city: 'Париж',
    category: 'museum',
  },
  {
    id: 'paris-notre-dame',
    name: 'Собор Парижской Богоматери',
    latitude: 48.853,
    longitude: 2.3499,
    address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris',
    description: 'Готический собор на острове Сите',
    city: 'Париж',
    category: 'attraction',
  },
  {
    id: 'paris-arc',
    name: 'Триумфальная арка',
    latitude: 48.8738,
    longitude: 2.295,
    address: 'Place Charles de Gaulle, 75008 Paris',
    description: 'Триумфальная арка на площади Шарля де Голля',
    city: 'Париж',
    category: 'attraction',
  },

  // Лондон
  {
    id: 'london-big-ben',
    name: 'Биг-Бен',
    latitude: 51.4994,
    longitude: -0.1245,
    address: 'Westminster, London SW1A 0AA',
    description: 'Знаменитая часовая башня',
    city: 'Лондон',
    category: 'attraction',
  },
  {
    id: 'london-tower',
    name: 'Тауэр',
    latitude: 51.5081,
    longitude: -0.0759,
    address: 'London EC3N 4AB',
    description: 'Историческая крепость на берегу Темзы',
    city: 'Лондон',
    category: 'attraction',
  },
  {
    id: 'london-british-museum',
    name: 'Британский музей',
    latitude: 51.5194,
    longitude: -0.127,
    address: 'Great Russell St, London WC1B 3DG',
    description: 'Один из крупнейших музеев мира',
    city: 'Лондон',
    category: 'museum',
  },

  // Нью-Йорк
  {
    id: 'nyc-statue',
    name: 'Статуя Свободы',
    latitude: 40.6892,
    longitude: -74.0445,
    address: 'Liberty Island, New York, NY 10004',
    description: 'Символ свободы и демократии',
    city: 'Нью-Йорк',
    category: 'attraction',
  },
  {
    id: 'nyc-times-square',
    name: 'Таймс-сквер',
    latitude: 40.758,
    longitude: -73.9855,
    address: 'Times Square, New York, NY 10036',
    description: 'Знаменитая площадь в центре Манхэттена',
    city: 'Нью-Йорк',
    category: 'attraction',
  },
  {
    id: 'nyc-central-park',
    name: 'Центральный парк',
    latitude: 40.7829,
    longitude: -73.9654,
    address: 'Central Park, New York, NY',
    description: 'Знаменитый парк в центре Манхэттена',
    city: 'Нью-Йорк',
    category: 'park',
  },

  // Токио
  {
    id: 'tokyo-shibuya',
    name: 'Синдзюку',
    latitude: 35.6895,
    longitude: 139.6917,
    address: 'Shibuya, Tokyo',
    description: 'Один из самых оживленных районов Токио',
    city: 'Токио',
    category: 'shopping',
  },
  {
    id: 'tokyo-sensoji',
    name: 'Сэнсо-дзи',
    latitude: 35.7148,
    longitude: 139.7967,
    address: '2 Chome-3-1 Asakusa, Taito City, Tokyo',
    description: 'Старейший буддийский храм Токио',
    city: 'Токио',
    category: 'attraction',
  },
]

export function getPlacesByCity(city?: string): MockPlace[] {
  if (!city) return MOCK_PLACES
  return MOCK_PLACES.filter((place) => place.city === city)
}

export function getPlacesByCategory(category?: MockPlace['category']): MockPlace[] {
  if (!category) return MOCK_PLACES
  return MOCK_PLACES.filter((place) => place.category === category)
}

export function getCities(): string[] {
  return Array.from(new Set(MOCK_PLACES.map((place) => place.city)))
}

export function getCategories(): MockPlace['category'][] {
  return Array.from(new Set(MOCK_PLACES.map((place) => place.category)))
}

