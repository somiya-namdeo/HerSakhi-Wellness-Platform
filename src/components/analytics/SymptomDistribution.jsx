import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { name: 'Cramps', value: 35, color: '#a78bfa' },
  { name: 'Bloating', value: 25, color: '#fbbf24' },
  { name: 'Headache', value: 20, color: '#f9a8d4' },
  { name: 'Fatigue', value: 15, color: '#c4b5fd' },
  { name: 'Other', value: 5, color: '#fbcfe8' }
]

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill={data[index].color} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${data[index].name}: ${data[index].value}%`}
    </text>
  );
};

const SymptomDistribution = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 h-[400px] flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Symptom Distribution</h3>
      
      <div className="flex-1 w-full relative -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
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
