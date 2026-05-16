import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * Build cycle-length bars from cycle logs.
 * Groups period-start logs by month. If there aren't enough logs,
 * we fall back to showing the predicted cycle length from onboarding.
 */
const buildCycleData = (cycleLogs, insights) => {
  // Group logs by month, track first log date per month (proxy for cycle start)
  const monthMap = {}
  cycleLogs.forEach((log) => {
    const d = new Date(log.log_date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!monthMap[key]) {
      monthMap[key] = { month: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), date: d }
    }
  })

  // We need at least 2 month buckets to compute a meaningful bar chart
  const buckets = Object.values(monthMap).sort((a, b) => a.date - b.date)

  if (buckets.length >= 2) {
    // Compute approximate cycle length as gap between first logs of consecutive months
    return buckets.slice(1).map((bucket, i) => {
      const gap = Math.round((bucket.date - buckets[i].date) / (1000 * 60 * 60 * 24))
      const length = gap > 0 && gap <= 45 ? gap : (insights?.predicted_cycle_length ?? 28)
      return { month: bucket.month, length }
    })
  }

  // Not enough data — return null to show fallback
  return null
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-primary/10 text-sm text-center">
        <p className="font-semibold text-dark mb-1">{label}</p>
        <p className="text-[#a78bfa]">length : {payload[0].value} days</p>
      </div>
    )
  }
  return null
}

const CycleLengthHistory = ({ cycleLogs = [], insights = null }) => {
  const cycleData = buildCycleData(cycleLogs, insights)
  const hasData   = cycleData !== null && cycleData.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Cycle Length History</h3>

      {hasData ? (
        <div className="flex-1 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cycleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f3f4f6" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={[0, 40]}
                ticks={[0, 10, 20, 30, 40]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3e8ff', radius: 8 }} />
              <Bar
                dataKey="length"
                fill="#a78bfa"
                radius={[8, 8, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <p className="text-sm font-medium text-dark mb-1">Track more cycles to see history</p>
          <p className="text-xs text-gray-400">Log daily entries across multiple months to unlock your cycle length chart.</p>
        </div>
      )}
    </motion.div>
  )
}

export default CycleLengthHistory
