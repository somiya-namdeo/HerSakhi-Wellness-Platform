import { Smile, Meh, Frown, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { saveCycleLog } from '../../api/cycleApi'
import { getStoredUser } from '../../utils/userHelpers'

const MoodCard = () => {
  const [selectedMood, setSelectedMood] = useState('Happy')
  const [saving, setSaving] = useState(false)

  const moods = [
    { name: 'Happy', icon: Smile, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Neutral', icon: Meh, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { name: 'Sad', icon: Frown, color: 'text-red-400', bg: 'bg-red-400/10' },
  ]

  const handleMoodSelect = async (moodName) => {
    setSelectedMood(moodName)
    const user = getStoredUser()
    if (!user?.id) return

    setSaving(true)
    const today = new Date().toISOString().split('T')[0]

    try {
      await saveCycleLog({
        user_id: user.id,
        log_date: today,
        mood: moodName
      })
    } catch (err) {
      console.error("Failed to sync mood to cycle logs:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 relative"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Today's Mood</h3>
        {saving && <Loader2 size={14} className="animate-spin text-primary" />}
      </div>
      
      <div className="flex justify-between items-center px-4">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.name
          return (
            <div 
              key={mood.name}
              onClick={() => handleMoodSelect(mood.name)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected ? `${mood.bg} ${mood.color} shadow-sm` : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                }`}
              >
                <mood.icon size={28} strokeWidth={isSelected ? 2.5 : 2} />
              </motion.div>
              <span className={`text-xs font-medium transition-colors ${isSelected ? 'text-dark' : 'text-gray-400'}`}>
                {mood.name}
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default MoodCard
