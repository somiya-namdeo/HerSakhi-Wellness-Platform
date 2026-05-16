import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

const NotificationSettings = () => {
  const [toggles, setToggles] = useState({
    enableAll: true,
    period: true,
    ovulation: true,
    tips: true
  })

  useEffect(() => {
    const saved = localStorage.getItem('hersakhi_notifications')
    if (saved) {
      try {
        setToggles(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse notification settings", e)
      }
    }
  }, [])

  const handleToggle = (key) => {
    const newToggles = { ...toggles, [key]: !toggles[key] }
    setToggles(newToggles)
    localStorage.setItem('hersakhi_notifications', JSON.stringify(newToggles))
  }

  const settings = [
    { key: 'enableAll', title: "Enable Notifications", subtitle: "Receive wellness reminders and updates", icon: Bell },
    { key: 'period', title: "Period Reminders", subtitle: "Get notified 2 days before" },
    { key: 'ovulation', title: "Ovulation Reminders", subtitle: "Track fertile window" },
    { key: 'tips', title: "Wellness Tips", subtitle: "Daily health recommendations" }
  ]

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Notification Settings</h3>

      <div className="space-y-2">
        {settings.map((setting, index) => (
          <div key={index} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              {setting.icon && (
                <div className="mt-1 text-primary">
                  <setting.icon size={18} />
                </div>
              )}
              <div className={!setting.icon ? "ml-8" : ""}>
                <p className="font-medium text-gray-700">{setting.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.subtitle}</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleToggle(setting.key)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 ${toggles[setting.key] ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${toggles[setting.key] ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationSettings
