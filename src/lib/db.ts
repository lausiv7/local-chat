import { Message } from '@/hooks/use-local-chat'

const DB_NAME = 'local-chat-db'
const DB_VERSION = 1
const MESSAGES_STORE = 'messages'
const CONVERSATIONS_STORE = 'conversations'

export interface Conversation {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[]
}

class LocalDatabase {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create conversations store
        if (!db.objectStoreNames.contains(CONVERSATIONS_STORE)) {
          const conversationsStore = db.createObjectStore(CONVERSATIONS_STORE, { keyPath: 'id' })
          conversationsStore.createIndex('createdAt', 'createdAt', { unique: false })
        }

        // Create messages store
        if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
          const messagesStore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' })
          messagesStore.createIndex('conversationId', 'conversationId', { unique: false })
          messagesStore.createIndex('createdAt', 'createdAt', { unique: false })
        }
      }
    })
  }

  async saveConversation(conversation: Conversation): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONVERSATIONS_STORE], 'readwrite')
      const store = transaction.objectStore(CONVERSATIONS_STORE)
      const request = store.put(conversation)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getConversations(): Promise<Conversation[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONVERSATIONS_STORE], 'readonly')
      const store = transaction.objectStore(CONVERSATIONS_STORE)
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const conversations = request.result.map(conv => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt)
        }))
        resolve(conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()))
      }
    })
  }

  async saveMessages(conversationId: string, messages: Message[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readwrite')
      const store = transaction.objectStore(MESSAGES_STORE)

      // Clear existing messages for this conversation
      const clearRequest = store.clear()
      clearRequest.onerror = () => reject(clearRequest.error)

      clearRequest.onsuccess = () => {
        // Add new messages
        const addPromises = messages.map(message => {
          return new Promise<void>((resolveAdd, rejectAdd) => {
            const addRequest = store.add({
              ...message,
              conversationId,
              createdAt: message.createdAt.toISOString()
            })
            addRequest.onerror = () => rejectAdd(addRequest.error)
            addRequest.onsuccess = () => resolveAdd()
          })
        })

        Promise.all(addPromises)
          .then(() => resolve())
          .catch(reject)
      }
    })
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([MESSAGES_STORE], 'readonly')
      const store = transaction.objectStore(MESSAGES_STORE)
      const index = store.index('conversationId')
      const request = index.getAll(conversationId)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const messages = request.result.map(msg => ({
          ...msg,
          createdAt: new Date(msg.createdAt)
        }))
        resolve(messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()))
      }
    })
  }

  async deleteConversation(conversationId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([CONVERSATIONS_STORE, MESSAGES_STORE], 'readwrite')
      
      // Delete conversation
      const convStore = transaction.objectStore(CONVERSATIONS_STORE)
      const convRequest = convStore.delete(conversationId)
      
      // Delete messages
      const msgStore = transaction.objectStore(MESSAGES_STORE)
      const msgIndex = msgStore.index('conversationId')
      const msgRequest = msgIndex.getAllKeys(conversationId)
      
      msgRequest.onsuccess = () => {
        const messageKeys = msgRequest.result
        messageKeys.forEach(key => {
          msgStore.delete(key)
        })
      }

      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export const db = new LocalDatabase() 