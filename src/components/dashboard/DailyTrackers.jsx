import { Droplet, Moon, Zap, Loader2, Plus, Minus, Save, Activity, Brain } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getTodayWellnessLog, saveWellnessLog } from '../../api/wellnessApi'
import { getStoredUser } from '../../utils/userHelpers'

const ENERGY_MAPPING = {
  'Low': 3,
  'Medium': 5,
  'Good': 7,
  'High': 9
};

const REVERSE_ENERGY_MAPPING = {
  3: 'Low',
  5: 'Medium',
  7: 'Good',
  9: 'High'
};

const DailyTrackers = () => {
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Tracker states
  const [hydration, setHydration] = useState(0)
  const [sleep, setSleep] = useState(0)
  const [energy, setEnergy] = useState(7) // Default Good
  const [stress, setStress] = useState(5)
  const [activity, setActivity] = useState(0)

  useEffect(() => {
    const fetchTodayLog = async () => {
      const user = getStoredUser()
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const data = await getTodayWellnessLog(user.id)
        if (data) {
          setLog(data)
          setHydration(data.hydration || 0)
          setSleep(data.sleep_hours || 0)
          setEnergy(data.energy_level || 7)
          setStress(data.stress_level || 5)
          setActivity(data.activity_count || 0)
        }
      } catch (err) {
        console.error("Failed to fetch today's wellness log:", err)
        setError("Could not load trackers.")
      } finally {
        setLoading(false)
      }
    }

    fetchTodayLog()
  }, [])

  const handleSave = async () => {
    const user = getStoredUser()
    if (!user?.id) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const today = new Date().toISOString().split('T')[0]

    try {
      const payload = {
        user_id: user.id,
        log_date: today,
        hydration,
        sleep_hours: sleep,
        energy_level: energy,
        stress_level: stress,
        activity_count: activity
      }
      
      const updatedData = await saveWellnessLog(payload)
      setLog(updatedData)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Failed to save wellness log:", err)
      setError("Failed to save data.")
    } finally {
      setSaving(false)
    }
  }

  // Calculate percentages for progress bars
  const hydrationPct = Math.min(100, (hydration / 8) * 100)
  const sleepPct = Math.min(100, (sleep / 8) * 100)
  const energyPct = Math.min(100, (energy / 10) * 100)

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Daily Trackers</h3>
        {success && (
          <span className="text-[10px] bg-green-50 text-green-500 px-3 py-1 rounded-full border border-green-100 font-medium">
            Saved!
          </span>
        )}
      </div>
      
      <div className="space-y-5">
        {/* Hydration */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-primary">
              <Droplet size={16} />
              <span className="text-sm font-medium text-dark">Hydration</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setHydration(Math.max(0, hydration - 1))}
                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-primary min-w-[50px] text-center">{hydration}/8 cups</span>
              <button 
                onClick={() => setHydration(hydration + 1)}
                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
          <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${hydrationPct}%` }}
              className="h-full bg-primary rounded-full transition-all duration-500"
            ></motion.div>
          </div>
        </div>

        {/* Sleep */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-softPink">
              <Moon size={16} />
              <span className="text-sm font-medium text-dark">Sleep</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSleep(Math.max(0, sleep - 0.5))}
                className="w-6 h-6 rounded-full bg-softPink/10 text-softPink flex items-center justify-center hover:bg-softPink/20 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-softPink min-w-[50px] text-center">{sleep} hrs</span>
              <button 
                onClick={() => setSleep(sleep + 0.5)}
                className="w-6 h-6 rounded-full bg-softPink/10 text-softPink flex items-center justify-center hover:bg-softPink/20 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
          <div className="h-2 w-full bg-softPink/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${sleepPct}%` }}
              className="h-full bg-softPink rounded-full transition-all duration-500"
            ></motion.div>
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-peach">
            <Zap size={16} />
            <span className="text-sm font-medium text-dark">Energy</span>
          </div>
          <select 
            value={REVERSE_ENERGY_MAPPING[energy] || 'Good'}
            onChange={(e) => setEnergy(ENERGY_MAPPING[e.target.value])}
            className="text-xs font-bold text-peach bg-peach/10 border-none rounded-lg px-2 py-1 outline-none cursor-pointer focus:ring-1 focus:ring-peach/30"
          >
            {Object.keys(ENERGY_MAPPING).map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        {/* Stress & Activity in a grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Brain size={16} />
              <span className="text-xs font-medium text-dark">Stress (1-10)</span>
            </div>
            <input 
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="w-full accent-purple-400 h-1.5 bg-purple-50 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-[10px] text-purple-400 font-bold mt-1 text-center">{stress}/10</div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Activity size={16} />
              <span className="text-xs font-medium text-dark">Activity</span>
            </div>
            <input 
              type="number"
              min="0"
              value={activity}
              onChange={(e) => setActivity(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-blue-50/50 border border-blue-100 rounded-lg px-2 py-1 text-xs font-bold text-blue-400 outline-none text-center"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-primary text-white py-3 rounded-2xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Today's Progress"}
        </button>

        {error && <p className="text-[10px] text-red-500 text-center mt-2">{error}</p>}
      </div>
    </motion.div>
  )
}

export default DailyTrackers
