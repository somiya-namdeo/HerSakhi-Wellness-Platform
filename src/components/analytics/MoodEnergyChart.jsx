import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const FALLBACK = [
  { week: 'Week 1', mood: 5, energy: 4, stress: 5 },
  { week: 'Week 2', mood: 5, energy: 4, stress: 5 },
  { week: 'Week 3', mood: 5, energy: 4, stress: 5 },
  { week: 'Week 4', mood: 5, energy: 4, stress: 5 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-primary/10 text-sm">
        <p className="font-semibold text-dark mb-2">{label}</p>
        <p className="text-[#a78bfa] mb-1">Mood : {payload[0]?.value}</p>
        <p className="text-[#f472b6] mb-1">Energy : {payload[1]?.value}</p>
        <p className="text-[#fbbf24]">Stress : {payload[2]?.value}</p>
      </div>
    )
  }
  return null
}

const MoodEnergyChart = ({ moodSeries = [] }) => {
  const hasData = moodSeries.length > 0
  const data    = hasData ? moodSeries : FALLBACK

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Mood &amp; Energy Trends</h3>
        {!hasData && (
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            Sample data — log more to unlock
          </span>
        )}
      </div>

      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f3f4f6" />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3e8ff', strokeWidth: 2, strokeDasharray: '3 3' }} />

            <Line
              type="monotone"
              dataKey="mood"
              stroke="#a78bfa"
              strokeWidth={3}
              strokeOpacity={hasData ? 1 : 0.35}
              dot={{ r: 4, fill: '#fff', stroke: '#a78bfa', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#a78bfa', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#f472b6"
              strokeWidth={3}
              strokeOpacity={hasData ? 1 : 0.35}
              dot={{ r: 4, fill: '#fff', stroke: '#f472b6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#f472b6', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#fbbf24"
              strokeWidth={3}
              strokeOpacity={hasData ? 1 : 0.35}
              dot={{ r: 4, fill: '#fff', stroke: '#fbbf24', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#a78bfa] bg-white" />
          <span className="text-xs font-medium text-[#a78bfa]">Mood</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#f472b6] bg-white" />
          <span className="text-xs font-medium text-[#f472b6]">Energy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#fbbf24] bg-white" />
          <span className="text-xs font-medium text-[#fbbf24]">Stress</span>
        </div>
      </div>
    </motion.div>
  )
}

export default MoodEnergyChart
