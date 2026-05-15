import { motion } from 'framer-motion'

const CategoryCard = ({ title, count, icon: Icon, colorClass }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl p-6 shadow-card border border-primary/5 flex flex-col justify-between h-[180px] cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-soft ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-poppins font-semibold text-dark text-lg">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{count} articles</p>
      </div>
    </motion.div>
  )
}

export default CategoryCard
