"use client"

import { useState, useEffect } from "react"
import type { Session, Expense, Location, Goal } from "@/types/database"

// IndexedDB wrapper for easier usage
class BuskingDatabase {
  private db: IDBDatabase | null = null
  private readonly dbName = "BuskingTracker"
  private readonly version = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Sessions store
        if (!db.objectStoreNames.contains("sessions")) {
          const sessionStore = db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true })
          sessionStore.createIndex("locationId", "locationId", { unique: false })
          sessionStore.createIndex("startTimestamp", "startTimestamp", { unique: false })
        }

        // Locations store
        if (!db.objectStoreNames.contains("locations")) {
          const locationStore = db.createObjectStore("locations", { keyPath: "id", autoIncrement: true })
          locationStore.createIndex("name", "name", { unique: false })
        }

        // Expenses store
        if (!db.objectStoreNames.contains("expenses")) {
          const expenseStore = db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true })
          expenseStore.createIndex("sessionId", "sessionId", { unique: false })
          expenseStore.createIndex("date", "date", { unique: false })
        }

        // Goals store
        if (!db.objectStoreNames.contains("goals")) {
          db.createObjectStore("goals", { keyPath: "id", autoIncrement: true })
        }

        // Settings store
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" })
        }
      }
    })
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async add<T>(storeName: string, data: Omit<T, "id">): Promise<number> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.add(data)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as number)
    })
  }

  async update<T>(storeName: string, id: number, data: Partial<T>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const existingData = getRequest.result
        if (existingData) {
          const updatedData = { ...existingData, ...data }
          const putRequest = store.put(updatedData)
          putRequest.onsuccess = () => resolve()
          putRequest.onerror = () => reject(putRequest.error)
        } else {
          reject(new Error("Record not found"))
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async delete(storeName: string, id: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async clear(storeName: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

const db = new BuskingDatabase()

export function useDatabase() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize database and load data
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await db.init()
        await loadAllData()
      } catch (error) {
        console.error("Failed to initialize database:", error)
      } finally {
        setLoading(false)
      }
    }

    initDatabase()
  }, [])

  const loadAllData = async () => {
    try {
      const [sessionsData, expensesData, locationsData, goalsData] = await Promise.all([
        db.getAll<Session>("sessions"),
        db.getAll<Expense>("expenses"),
        db.getAll<Location>("locations"),
        db.getAll<Goal>("goals"),
      ])

      setSessions(sessionsData)
      setExpenses(expensesData)
      setLocations(locationsData)
      setGoals(goalsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  // Session operations
  const addSession = async (sessionData: Omit<Session, "id">) => {
    try {
      const id = await db.add<Session>("sessions", sessionData)
      const newSession = { ...sessionData, id }
      setSessions((prev) => [...prev, newSession])
      return id
    } catch (error) {
      console.error("Failed to add session:", error)
      throw error
    }
  }

  const updateSession = async (id: number, sessionData: Partial<Session>) => {
    try {
      await db.update<Session>("sessions", id, sessionData)
      setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, ...sessionData } : session)))
    } catch (error) {
      console.error("Failed to update session:", error)
      throw error
    }
  }

  const deleteSession = async (id: number) => {
    try {
      await db.delete("sessions", id)
      setSessions((prev) => prev.filter((session) => session.id !== id))
    } catch (error) {
      console.error("Failed to delete session:", error)
      throw error
    }
  }

  // Expense operations
  const addExpense = async (expenseData: Omit<Expense, "id">) => {
    try {
      const id = await db.add<Expense>("expenses", expenseData)
      const newExpense = { ...expenseData, id }
      setExpenses((prev) => [...prev, newExpense])
      return id
    } catch (error) {
      console.error("Failed to add expense:", error)
      throw error
    }
  }

  const updateExpense = async (id: number, expenseData: Partial<Expense>) => {
    try {
      await db.update<Expense>("expenses", id, expenseData)
      setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, ...expenseData } : expense)))
    } catch (error) {
      console.error("Failed to update expense:", error)
      throw error
    }
  }

  const deleteExpense = async (id: number) => {
    try {
      await db.delete("expenses", id)
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    } catch (error) {
      console.error("Failed to delete expense:", error)
      throw error
    }
  }

  // Location operations
  const addLocation = async (locationData: Omit<Location, "id">) => {
    try {
      const id = await db.add<Location>("locations", locationData)
      const newLocation = { ...locationData, id }
      setLocations((prev) => [...prev, newLocation])
      return id
    } catch (error) {
      console.error("Failed to add location:", error)
      throw error
    }
  }

  const updateLocation = async (id: number, locationData: Partial<Location>) => {
    try {
      await db.update<Location>("locations", id, locationData)
      setLocations((prev) => prev.map((location) => (location.id === id ? { ...location, ...locationData } : location)))
    } catch (error) {
      console.error("Failed to update location:", error)
      throw error
    }
  }

  const deleteLocation = async (id: number) => {
    try {
      await db.delete("locations", id)
      setLocations((prev) => prev.filter((location) => location.id !== id))
    } catch (error) {
      console.error("Failed to delete location:", error)
      throw error
    }
  }

  // Goal operations
  const addGoal = async (goalData: Omit<Goal, "id">) => {
    try {
      const id = await db.add<Goal>("goals", goalData)
      const newGoal = { ...goalData, id }
      setGoals((prev) => [...prev, newGoal])
      return id
    } catch (error) {
      console.error("Failed to add goal:", error)
      throw error
    }
  }

  const updateGoal = async (id: number, goalData: Partial<Goal>) => {
    try {
      await db.update<Goal>("goals", id, goalData)
      setGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...goalData } : goal)))
    } catch (error) {
      console.error("Failed to update goal:", error)
      throw error
    }
  }

  const deleteGoal = async (id: number) => {
    try {
      await db.delete("goals", id)
      setGoals((prev) => prev.filter((goal) => goal.id !== id))
    } catch (error) {
      console.error("Failed to delete goal:", error)
      throw error
    }
  }

  // Clear all data
  const clearAllData = async () => {
    try {
      await Promise.all([db.clear("sessions"), db.clear("expenses"), db.clear("locations"), db.clear("goals")])

      setSessions([])
      setExpenses([])
      setLocations([])
      setGoals([])
    } catch (error) {
      console.error("Failed to clear data:", error)
      throw error
    }
  }

  return {
    // Data
    sessions,
    expenses,
    locations,
    goals,
    loading,

    // Session operations
    addSession,
    updateSession,
    deleteSession,

    // Expense operations
    addExpense,
    updateExpense,
    deleteExpense,

    // Location operations
    addLocation,
    updateLocation,
    deleteLocation,

    // Goal operations
    addGoal,
    updateGoal,
    deleteGoal,

    // Utility
    clearAllData,
    loadAllData,
  }
}
