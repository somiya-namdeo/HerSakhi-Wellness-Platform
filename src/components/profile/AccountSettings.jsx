import { useState } from 'react'
import { Lock, Shield, Globe, Sun } from 'lucide-react'

const AccountSettings = () => {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Account Settings</h3>

      <div className="space-y-2">
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
          <Lock size={20} className="text-[#a78bfa]" />
          <span className="font-medium text-gray-700 group-hover:text-dark transition-colors">Change Password</span>
        </button>
        
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
          <Shield size={20} className="text-pink-400" />
          <span className="font-medium text-gray-700 group-hover:text-dark transition-colors">Privacy Settings</span>
        </button>
        
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
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
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${darkMode ? 'bg-gray-700' : 'bg-[#6b7280]'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
