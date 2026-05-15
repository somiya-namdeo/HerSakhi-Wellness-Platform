import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import ChatContainer from '../components/assistant/ChatContainer'
import SuggestedQuestions from '../components/assistant/SuggestedQuestions'
import { useState } from 'react'

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your HerSakhi AI wellness companion. How can I help you today?",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  ])

  const handleSendMessage = (text) => {
    const newUserMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    setMessages(prev => [...prev, newUserMsg])

    setTimeout(() => {
      const newAIMsg = {
        id: Date.now() + 1,
        text: "I understand. Let me help you with that.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }

      setMessages(prev => [...prev, newAIMsg])
    }, 1000)
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
              <ChatContainer
                messages={messages}
                onSendMessage={handleSendMessage}
              />
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