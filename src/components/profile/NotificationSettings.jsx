import { useState, useEffect } from 'react'
import { Bell, Heart, Droplet, UserCheck, Pill } from 'lucide-react'

const NotificationSettings = () => {
  const [toggles, setToggles] = useState({
    periodReminder: true,
    ovulationReminder: true,
    hydrationReminder: false,
    wellnessCheckIn: true,
    medicineReminder: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('hersakhi_reminders')
    if (saved) {
      try {
        setToggles(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse reminder settings", e)
      }
    }
  }, [])

  const handleToggle = (key) => {
    const newToggles = { ...toggles, [key]: !toggles[key] }
    setToggles(newToggles)
    localStorage.setItem('hersakhi_reminders', JSON.stringify(newToggles))
    
    // Dispatch a storage event so Topbar or other components know reminders changed
    window.dispatchEvent(new Event('storage'))
  }

  const settings = [
    { key: 'periodReminder', title: "Period Reminders", subtitle: "Receive alerts expected 2 days before period", icon: Bell },
    { key: 'ovulationReminder', title: "Ovulation & Fertility Alerts", subtitle: "Get alerts when entering fertile window", icon: Heart },
    { key: 'hydrationReminder', title: "Hydration Reminders", subtitle: "Remind me to drink water daily", icon: Droplet },
    { key: 'wellnessCheckIn', title: "Wellness Check-in", subtitle: "Daily reminders to log symptoms and mood", icon: UserCheck },
    { key: 'medicineReminder', title: "Medicine & Supplements Reminder", subtitle: "Notify me for scheduled medication intake", icon: Pill }
  ]

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Reminder Preferences</h3>

      <div className="space-y-3">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50/10 transition-colors border border-transparent hover:border-pink-100/10">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-primary shrink-0">
                <setting.icon size={18} />
              </div>
              <div>
                <p className="font-medium text-gray-700 text-sm">{setting.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{setting.subtitle}</p>
              </div>
            </div>
            
            <button 
              onClick={() => handleToggle(setting.key)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 ${toggles[setting.key] ? 'bg-[#8b5cf6]' : 'bg-gray-200'}`}
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
