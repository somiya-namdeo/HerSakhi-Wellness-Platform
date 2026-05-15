import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const ArticleCard = ({ article }) => {
  let pillColor = 'bg-primary/10 text-primary'
  if (article.category === 'Nutrition') pillColor = 'bg-pink-400/10 text-pink-400'
  if (article.category === 'Mental Health') pillColor = 'bg-orange-400/10 text-orange-400'
  if (article.category === 'Exercise') pillColor = 'bg-blue-400/10 text-blue-400'
  if (article.category === 'PCOS') pillColor = 'bg-red-400/10 text-red-400'
  if (article.category === 'Hygiene') pillColor = 'bg-yellow-500/10 text-yellow-600'

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 flex flex-col h-full cursor-pointer"
    >
      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${pillColor}`}>
          {article.category}
        </span>
        <span className="text-xs text-gray-400 font-medium">{article.readTime}</span>
      </div>
      
      <h3 className="font-poppins font-semibold text-lg text-dark mb-2 line-clamp-2">
        {article.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-3">
        {article.description}
      </p>
      
      <button className="text-primary text-sm font-medium flex items-center gap-1 group w-max">
        Read Article 
        <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}

export default ArticleCard
