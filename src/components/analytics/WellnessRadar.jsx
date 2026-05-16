import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const DEFAULT_DATA = [
  { subject: 'Sleep',      A: 50 },
  { subject: 'Mood',       A: 50 },
  { subject: 'Pain',       A: 50 },
  { subject: 'Regularity', A: 50 },
  { subject: 'Wellness',   A: 50 },
]

const WellnessRadar = ({ radarData = [] }) => {
  const data = radarData.length > 0 ? radarData : DEFAULT_DATA

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-2">Wellness Radar</h3>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <Radar
              name="Wellness"
              dataKey="A"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="#c4b5fd"
              fillOpacity={radarData.length > 0 ? 0.4 : 0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default WellnessRadar
