import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User, LogOut, Settings, Clock, Sparkles } from 'lucide-react'
import { getStoredUser, getUserInitials, logoutUser } from '../../utils/userHelpers'
import { BASE_URL } from '../../api/api'

const Topbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [profilePhoto, setProfilePhoto] = useState(null)
  
  const userMenuRef = useRef(null)
  const bellMenuRef = useRef(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    setUser(storedUser)
    setProfilePhoto(localStorage.getItem('hersakhi_profile_photo'))

    // Load active reminders from localStorage
    const savedReminders = localStorage.getItem('hersakhi_reminders')
    const reminders = savedReminders ? JSON.parse(savedReminders) : {
      periodReminder: true,
      ovulationReminder: true,
      hydrationReminder: true,
      wellnessCheckIn: true,
      medicineReminder: false
    }

    // Try fetching predictions for dynamic notifications
    if (storedUser?.id) {
      fetchPredictionsAndGenerateNotifications(storedUser.id, reminders)
    } else {
      generateStaticNotifications(reminders)
    }

    // Handle clicks outside of dropdowns to close them
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false)
      }
      if (bellMenuRef.current && !bellMenuRef.current.contains(e.target)) {
        setIsBellDropdownOpen(false)
      }
    }

    const handleStorageChange = () => {
      const updatedUser = getStoredUser()
      setUser(updatedUser)
      setProfilePhoto(localStorage.getItem('hersakhi_profile_photo'))
    }

    document.addEventListener('mousedown', handleOutsideClick)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const fetchPredictionsAndGenerateNotifications = async (userId, reminders) => {
    try {
      const response = await fetch(`${BASE_URL}/predictions/full/${userId}`)
      if (response.ok) {
        const data = await response.json()
        const list = []
        
        if (reminders.periodReminder && data.next_period_date) {
          list.push({
            id: 'period',
            type: 'cycle',
            title: 'Upcoming Period',
            message: `Your next period is expected on ${formatDateStr(data.next_period_date)}.`,
            time: 'Upcoming'
          })
        }
        
        if (reminders.ovulationReminder && data.ovulation_date) {
          list.push({
            id: 'ovulation',
            type: 'fertility',
            title: 'Ovulation Predicted',
            message: `Ovulation is predicted around ${formatDateStr(data.ovulation_date)}.`,
            time: 'Upcoming'
          })
        }

        if (reminders.ovulationReminder && data.fertile_window_start && data.fertile_window_end) {
          list.push({
            id: 'fertile',
            type: 'fertility',
            title: 'Fertile Window',
            message: `Your fertile window is expected between ${formatDateStr(data.fertile_window_start)} and ${formatDateStr(data.fertile_window_end)}.`,
            time: 'Upcoming'
          })
        }

        addDailyReminders(reminders, list)
        setNotifications(list)
      } else {
        generateStaticNotifications(reminders)
      }
    } catch (e) {
      generateStaticNotifications(reminders)
    }
  }

  const generateStaticNotifications = (reminders) => {
    const list = []
    
    // Fallback static dates based on current date for UI richness
    if (reminders.periodReminder) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 5)
      list.push({
        id: 'period',
        type: 'cycle',
        title: 'Upcoming Period',
        message: `Your next period is expected on ${formatDateStr(futureDate.toISOString())}.`,
        time: 'In 5 days'
      })
    }

    if (reminders.ovulationReminder) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 14)
      list.push({
        id: 'ovulation',
        type: 'fertility',
        title: 'Ovulation Predicted',
        message: `Ovulation is predicted around ${formatDateStr(futureDate.toISOString())}.`,
        time: 'In 14 days'
      })
    }

    addDailyReminders(reminders, list)
    setNotifications(list)
  }

  const addDailyReminders = (reminders, list) => {
    if (reminders.hydrationReminder) {
      list.push({
        id: 'hydration',
        type: 'wellness',
        title: 'Hydration Alert',
        message: 'Stay hydrated! Time to drink a glass of water.',
        time: 'Now'
      })
    }

    if (reminders.wellnessCheckIn) {
      list.push({
        id: 'wellness',
        type: 'wellness',
        title: 'Wellness Check-in',
        message: 'Time for a wellness check-in. Log your symptoms and mood!',
        time: 'Daily'
      })
    }

    if (reminders.medicineReminder) {
      list.push({
        id: 'medicine',
        type: 'medical',
        title: 'Medicine Reminder',
        message: 'Friendly reminder to take your scheduled supplements.',
        time: 'Scheduled'
      })
    }
  }

  const formatDateStr = (dateStr) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const initials = getUserInitials(user?.full_name)

  const handleLogoutClick = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <div className="w-full h-24 px-6 lg:px-10 flex items-center justify-between z-30 sticky top-0 bg-[#fdf7fb]/80 backdrop-blur-md border-b border-pink-100/10">
      <div className="ml-14 lg:ml-0">
        <h1 className="text-2xl font-poppins font-bold text-[#2d1b45]">
          {title}
        </h1>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 relative">
        
        {/* Notification Bell Icon & Dropdown */}
        <div className="relative" ref={bellMenuRef}>
          <button 
            onClick={() => {
              setIsBellDropdownOpen(!isBellDropdownOpen)
              setIsUserDropdownOpen(false)
            }}
            className="relative p-2 text-gray-500 hover:text-[#a78bfa] hover:bg-pink-50/50 rounded-xl transition-all shadow-sm bg-white border border-pink-100/20"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Bell Dropdown panel */}
          {isBellDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl border border-pink-100/60 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-pink-100/30 bg-[#fdf7fb]/50 flex justify-between items-center">
                <span className="font-poppins font-semibold text-sm text-[#2d1b45] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#a78bfa]" />
                  Notifications & Reminders
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">
                  {notifications.length}
                </span>
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-pink-50/20 transition-colors flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa] mt-2 shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-bold text-[#2d1b45]">{notif.title}</span>
                          <span className="text-[9px] font-semibold text-gray-400 flex items-center gap-0.5 shrink-0">
                            <Clock size={8} />
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-gray-400">
                    No active reminders yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* User initials Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <div 
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen)
              setIsBellDropdownOpen(false)
            }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#c4b5fd] flex items-center justify-center text-white shadow-soft cursor-pointer hover:shadow-md transition-all font-bold text-sm tracking-wide border border-white overflow-hidden"
          >
            {profilePhoto ? (
              <img src={profilePhoto} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              initials
            )}
          </div>

          {/* Avatar Dropdown panel */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl border border-pink-100/60 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Identity info block */}
              <div className="p-5 border-b border-pink-100/30 bg-[#fdf7fb]/50">
                <p className="font-poppins font-bold text-sm text-[#2d1b45] truncate">{user?.full_name || 'Guest User'}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || 'guest@hersakhi.com'}</p>
              </div>

              {/* Navigation list */}
              <div className="p-2 space-y-1">
                <Link 
                  to="/profile"
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-[#2d1b45] hover:bg-pink-50/30 hover:text-[#a78bfa] transition-colors"
                >
                  <User size={16} />
                  View Profile
                </Link>
                
                <button 
                  onClick={handleLogoutClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Topbar