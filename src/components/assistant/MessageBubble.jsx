import { Bot } from 'lucide-react'
import { motion } from 'framer-motion'

const MessageBubble = ({ message }) => {
  const isAI = message.sender === 'ai'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isAI ? '' : 'flex-row-reverse'} mb-6`}
    >
      {isAI && (
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Bot size={20} />
        </div>
      )}
      
      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%]`}>
        <div 
          className={`px-5 py-3.5 text-sm ${
            isAI 
              ? 'bg-background text-gray-700 rounded-2xl rounded-tl-sm border border-primary/5' 
              : 'bg-primary text-white rounded-2xl rounded-tr-sm shadow-md shadow-primary/20'
          }`}
        >
          {message.text}
        </div>
        <span className="text-[10px] text-gray-400 font-medium mt-1 mx-1">
          {message.timestamp}
        </span>
      </div>
    </motion.div>
  )
}

export default MessageBubble
