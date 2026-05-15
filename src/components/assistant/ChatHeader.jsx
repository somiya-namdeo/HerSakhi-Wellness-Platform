import { Bot } from 'lucide-react'

const ChatHeader = () => {
  return (
    <div className="flex items-center gap-4 p-6 border-b border-gray-100">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-softPink flex items-center justify-center text-white shadow-soft">
        <Bot size={24} />
      </div>
      <div>
        <h2 className="font-poppins font-semibold text-xl text-dark">AI Wellness Assistant</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span className="text-xs text-gray-500 font-medium">Online</span>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
