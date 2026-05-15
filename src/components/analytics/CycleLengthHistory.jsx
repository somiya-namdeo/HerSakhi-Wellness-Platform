import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { month: 'Jan', length: 28 },
  { month: 'Feb', length: 29 },
  { month: 'Mar', length: 27 },
  { month: 'Apr', length: 28 },
  { month: 'May', length: 28 }
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-xl border border-primary/10 text-sm text-center">
        <p className="font-semibold text-dark mb-1">{label}</p>
        <p className="text-[#a78bfa]">length : {payload[0].value}</p>
      </div>
    )
  }
  return null
}

const CycleLengthHistory = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Cycle Length History</h3>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 32]}
              ticks={[0, 8, 16, 24, 32]}
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
    </motion.div>
  )
}

export default CycleLengthHistory
