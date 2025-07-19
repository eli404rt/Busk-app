export interface Session {
  id: number
  sessionType: string
  locationId?: string
  startTimestamp: string
  endTimestamp?: string
  duration?: number // in minutes
  timeSpentSinging?: number
  timeSpentPlaying?: number
  earnings?: number
  startingFloat?: number
  biggestTip?: number
  notes?: string
  performanceRating?: number // 1-5
  weather?: {
    temperature: number
    conditions: string
    windSpeed?: number
    humidity?: number
  }
  traffic?: string
  audienceEngagement?: string
  incidents?: string[]
  voiceLogTranscript?: string
}

export interface Location {
  id: number
  name: string
  address: string
  gpsCoordinates?: {
    latitude: number
    longitude: number
  }
  isArchived: boolean
}

export interface Expense {
  id: number
  sessionId?: string
  date: string
  description: string
  category: string
  amount: number
  receiptPhoto?: Blob
}

export interface Goal {
  id: number
  type: string
  target: number
  startDate: string
  endDate: string
}

export interface Settings {
  currency: string
  darkMode: boolean
}
