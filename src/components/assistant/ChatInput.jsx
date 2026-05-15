import { Send, Mic } from 'lucide-react'
import { useState } from 'react'

const ChatInput = ({ onSend }) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSend(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="p-4 sm:p-6 border-t border-gray-100">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-6 pr-24 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
        <div className="absolute right-2 flex items-center gap-2">
          <button 
            type="button"
            className="w-10 h-10 text-gray-400 hover:text-primary transition-colors flex items-center justify-center"
          >
            <Mic size={20} />
          </button>
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="w-10 h-10 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-full flex items-center justify-center shadow-soft transition-transform transform hover:scale-105 disabled:hover:scale-100"
          >
            <Send size={16} className="ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatInput
