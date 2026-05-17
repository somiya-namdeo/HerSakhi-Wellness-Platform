import { useState, useEffect } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import ChatContainer from '../components/assistant/ChatContainer'
import SuggestedQuestions from '../components/assistant/SuggestedQuestions'
import { getStoredUser } from '../utils/userHelpers'
import { getChatHistory, sendChatMessage } from '../api/aiApi'
import { Loader2 } from 'lucide-react'

const AIAssistant = () => {
  const user = getStoredUser()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  const welcomeMessage = {
    id: 'welcome',
    text: "Hi, I’m HerSakhi — your AI wellness companion. How can I support you today?",
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false)
        setMessages([welcomeMessage])
        return
      }

      try {
        const history = await getChatHistory(user.id)
        if (history && history.length > 0) {
          const formatted = history.map(m => ({
            id: m.id,
            text: m.text,
            sender: m.sender,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))
          setMessages(formatted)
        } else {
          setMessages([welcomeMessage])
        }
      } catch (err) {
        console.error("Failed to load history:", err)
        setError("Could not load previous messages.")
        setMessages([welcomeMessage])
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [user?.id])

  const handleSendMessage = async (text) => {
    if (!text.trim() || !user?.id) return

    setSending(true)
    
    // 1. Optimistic update for UI feel
    const tempId = Date.now()
    const tempMsg = {
      id: tempId,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      // 2. Call backend
      const turn = await sendChatMessage(user.id, text)
      
      // 3. Extract exact records from backend ChatTurnResponse
      const userMsg = {
        id: turn.user_message.id,
        text: turn.user_message.text,
        sender: turn.user_message.sender,
        timestamp: new Date(turn.user_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      const aiMsg = {
        id: turn.ai_response.id,
        text: turn.ai_response.text,
        sender: turn.ai_response.sender,
        timestamp: new Date(turn.ai_response.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => {
        // Replace the optimistic tempMsg with the official backend database record
        const filtered = prev.filter(m => m.id !== tempId)
        return [...filtered, userMsg, aiMsg]
      })
    } catch (err) {
      console.error("Chat error:", err)
      // 4. Requirement 7: Fallback bubble if message sending fails
      const errMsg = {
        id: `err-${Date.now()}`,
        text: "Sorry, I couldn’t respond right now. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex font-inter">
      <Sidebar />

      <div className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">

        {/* Updated Topbar */}
        <Topbar title="AI Assistant" />

        <main className="flex-1 p-6 lg:p-10 max-w-[1400px] mx-auto w-full flex flex-col h-[calc(100vh-6rem)]">

          <div className="flex flex-col xl:flex-row gap-6 h-full">

            {/* Chat Section */}
            <div className="flex-1 flex flex-col min-h-[500px] xl:min-h-0 relative z-10">
              {loading ? (
                <div className="flex-1 bg-white rounded-[2rem] shadow-card border border-primary/5 flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Loading conversation...</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl text-center font-medium">
                      {error}
                    </div>
                  )}
                  <ChatContainer
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isSending={sending}
                  />
                </>
              )}
            </div>

            {/* Suggested Questions */}
            <div className="w-full xl:w-[380px] flex-shrink-0 min-h-[400px] xl:min-h-0">
              <SuggestedQuestions onSelect={handleSendMessage} />
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default AIAssistant