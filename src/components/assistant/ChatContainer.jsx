import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

const ChatContainer = ({ messages, onSendMessage, isSending }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-[2rem] shadow-card border border-primary/5 h-full flex flex-col overflow-hidden"
    >
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 scroll-smooth">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isSending && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-50 text-gray-400 text-xs px-4 py-2 rounded-2xl flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Assistant is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSendMessage} disabled={isSending} />
    </motion.div>
  )
}

export default ChatContainer
