import { Calendar, Heart, Smile, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const AnalyticsOverviewCards = ({ analytics }) => {
  const {
    avgCycleLength,
    regularityPct,
    cycleRegularity,
    avgMoodScore,
    wellnessScore,
    hasEnoughData,
  } = analytics

  const wellnessLabel = () => {
    if (!hasEnoughData) return 'No data yet'
    if (wellnessScore >= 8)  return 'Excellent!'
    if (wellnessScore >= 6)  return 'Good'
    if (wellnessScore >= 4)  return 'Fair'
    return 'Needs attention'
  }

  const regularityLabel = () => {
    if (cycleRegularity === 'Regular') return 'Very consistent'
    if (cycleRegularity?.startsWith('Analyzing')) return 'Analyzing…'
    return 'Insufficient data'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

      {/* Card 1 – Avg Cycle Length */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-primary">
            {hasEnoughData ? avgCycleLength : '—'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Avg Cycle Length</h3>
        <p className="text-xs text-gray-400 mt-1">
          {hasEnoughData ? 'days (from onboarding)' : 'Start tracking to see data'}
        </p>
      </motion.div>

      {/* Card 2 – Cycle Regularity */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-400/10 flex items-center justify-center text-pink-400">
            <Heart size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-pink-400">
            {regularityPct !== '—' ? `${regularityPct}%` : '—'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Cycle Regularity</h3>
        <p className="text-xs text-gray-400 mt-1">{regularityLabel()}</p>
      </motion.div>

      {/* Card 3 – Avg Mood Score */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-peach/20 flex items-center justify-center text-orange-400">
            <Smile size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-orange-400">
            {hasEnoughData ? avgMoodScore : '—'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Avg Mood Score</h3>
        <p className="text-xs text-gray-400 mt-1">
          {hasEnoughData ? 'Out of 10' : 'Log moods to see score'}
        </p>
      </motion.div>

      {/* Card 4 – Wellness Score */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[30px] p-6 shadow-card border border-primary/5 relative overflow-hidden"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp size={24} />
          </div>
          <span className="text-3xl font-poppins font-bold text-primary">
            {hasEnoughData ? wellnessScore : '—'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-dark">Wellness Score</h3>
        <p className="text-xs text-gray-400 mt-1">{wellnessLabel()}</p>
      </motion.div>

    </div>
  )
}

export default AnalyticsOverviewCards
