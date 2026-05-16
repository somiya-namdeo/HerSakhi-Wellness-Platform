import { useState, useEffect } from 'react'
import { Lock, Shield, Globe, Sun, Info } from 'lucide-react'

const AccountSettings = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('hersakhi_darkMode')
    if (saved === 'true') setDarkMode(true)
  }, [])

  const toggleDarkMode = () => {
    const newVal = !darkMode
    setDarkMode(newVal)
    localStorage.setItem('hersakhi_darkMode', String(newVal))
  }

  const showComingSoon = () => {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8 relative">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Account Settings</h3>

      {toast && (
        <div className="absolute top-4 right-8 bg-dark text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-2 animate-bounce">
          <Info size={12} />
          Coming soon!
        </div>
      )}

      <div className="space-y-2">
        <button 
          onClick={showComingSoon}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
        >
          <Lock size={20} className="text-primary" />
          <span className="font-medium text-gray-700 group-hover:text-dark transition-colors">Change Password</span>
        </button>
        
        <button 
          onClick={showComingSoon}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group"
        >
          <Shield size={20} className="text-pink-400" />
          <span className="font-medium text-gray-700 group-hover:text-dark transition-colors">Privacy Settings</span>
        </button>
        
        <div 
          onClick={showComingSoon}
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <Globe size={20} className="text-orange-400" />
            <div>
              <p className="font-medium text-gray-700 group-hover:text-dark transition-colors">Language</p>
              <p className="text-xs text-gray-500">English</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-4">
            <Sun size={20} className="text-yellow-500" />
            <span className="font-medium text-gray-700">Dark Mode</span>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${darkMode ? 'bg-dark' : 'bg-gray-200'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
