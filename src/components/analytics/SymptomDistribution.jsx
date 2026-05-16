import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const EMPTY_STATE = [{ name: 'No data yet', value: 100, color: '#e5e7eb' }]

const renderCustomizedLabel = (data) =>
  ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    if (data[index]?.name === 'No data yet') return null
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.3
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill={data[index]?.color}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-medium"
        style={{ fontSize: '11px' }}
      >
        {`${data[index]?.name}: ${data[index]?.value}%`}
      </text>
    )
  }

const SymptomDistribution = ({ symptomData = [] }) => {
  const hasData = symptomData.length > 0
  const data    = hasData ? symptomData : EMPTY_STATE

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Symptom Distribution</h3>

      {!hasData && (
        <p className="text-xs text-gray-400 text-center -mt-4 mb-2">
          Log symptoms to see distribution
        </p>
      )}

      <div className="flex-1 w-full relative -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel(data)}
              outerRadius={90}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SymptomDistribution
