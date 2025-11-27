const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'

class WebSocketService {
  constructor() {
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.messageHandlers = []
    this.isConnecting = false
  }

  connect(conversationId) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress')
      return
    }

    this.isConnecting = true
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      console.error('No access token found')
      this.isConnecting = false
      return
    }

    const wsUrl = `${WS_BASE_URL}/ws/chat/${conversationId}/?token=${token}`
    
    try {
      this.socket = new WebSocket(wsUrl)

      this.socket.onopen = () => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        this.isConnecting = false
      }

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.messageHandlers.forEach(handler => handler(data))
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.isConnecting = false
      }

      this.socket.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        this.isConnecting = false
        this.socket = null

        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
          setTimeout(() => {
            this.connect(conversationId)
          }, this.reconnectDelay * this.reconnectAttempts)
        } else {
          console.error('Max reconnection attempts reached')
        }
      }
    } catch (error) {
      console.error('Error creating WebSocket:', error)
      this.isConnecting = false
    }
  }

  disconnect() {
    if (this.socket) {
      this.reconnectAttempts = this.maxReconnectAttempts // Prevent reconnection
      this.socket.close()
      this.socket = null
      this.messageHandlers = []
    }
  }

  sendMessage(message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      return true
    } else {
      console.error('WebSocket is not connected')
      return false
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler)
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler)
    }
  }

  isConnected() {
    return this.socket?.readyState === WebSocket.OPEN
  }
}

// Export singleton instance
export const wsService = new WebSocketService()
export default wsService
