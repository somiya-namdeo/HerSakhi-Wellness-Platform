import { Calendar as CalendarIcon, Droplet, Smile, Meh, Frown, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const DailyLogPanel = ({ selectedDate }) => {
  const [flow, setFlow] = useState(null)
  const [painLevel, setPainLevel] = useState(4)
  const [mood, setMood] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState(false)

  const flowOptions = ['Light', 'Medium', 'Heavy', 'Spotting']
  const moodOptions = [
    { name: 'Happy', icon: Smile, color: 'text-primary' },
    { name: 'Neutral', icon: Meh, color: 'text-orange-400' },
    { name: 'Sad', icon: Frown, color: 'text-red-400' }
  ]
  const symptomOptions = ['Cramps', 'Headache', 'Bloating', 'Fatigue', 'Back Pain', 'Acne', 'Tender Breasts', 'Mood Swings']

  useEffect(() => {
    setShowToast(false)
  }, [selectedDate])

  const toggleSymptom = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom))
    } else {
      setSymptoms([...symptoms, symptom])
    }
  }

  const handleSave = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 relative"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-poppins font-bold text-dark">Log for May {selectedDate}</h2>
        <CalendarIcon className="text-primary/50" size={24} />
      </div>

      <div className="space-y-8">
        {/* Flow Intensity */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Flow Intensity</h3>
          <div className="grid grid-cols-2 gap-3">
            {flowOptions.map(option => (
              <button
                key={option}
                onClick={() => setFlow(option)}
                className={`py-3 px-4 rounded-3xl flex flex-col items-center gap-1 border-2 transition-all duration-200 ${
                  flow === option 
                    ? 'border-primary/30 bg-primary/5 text-primary' 
                    : 'border-gray-100 bg-white text-gray-600 hover:border-primary/20 hover:bg-gray-50'
                }`}
              >
                <Droplet size={18} className={flow === option ? 'fill-current' : ''} />
                <span className="text-xs font-medium">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pain Level */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-700">Pain Level: {painLevel}/10</h3>
          </div>
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Mood */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mood</h3>
          <div className="grid grid-cols-3 gap-3">
            {moodOptions.map(option => (
              <button
                key={option.name}
                onClick={() => setMood(option.name)}
                className={`py-3 flex justify-center rounded-[2rem] border-2 transition-all duration-200 ${
                  mood === option.name 
                    ? `border-primary/30 bg-primary/5 ${option.color}` 
                    : `border-gray-100 bg-white ${option.color} hover:border-gray-200 hover:bg-gray-50 opacity-60 hover:opacity-100`
                }`}
              >
                <option.icon size={24} strokeWidth={mood === option.name ? 2.5 : 2} />
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Symptoms</h3>
          <div className="grid grid-cols-2 gap-2">
            {symptomOptions.map(symptom => (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`py-2 px-3 rounded-full text-xs font-medium border-2 transition-all duration-200 ${
                  symptoms.includes(symptom)
                    ? 'border-primary/30 bg-primary/5 text-primary'
                    : 'border-transparent bg-background text-gray-600 hover:border-gray-200'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Notes</h3>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            className="w-full h-24 rounded-2xl border-2 border-gray-100 p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none transition-all bg-white"
          />
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5"
        >
          + Save Entry
        </button>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-dark text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium whitespace-nowrap z-50"
          >
            <CheckCircle2 size={16} className="text-green-400" />
            Entry saved for selected date
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DailyLogPanel
