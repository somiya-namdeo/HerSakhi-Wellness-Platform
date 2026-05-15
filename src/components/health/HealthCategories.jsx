import CategoryCard from './CategoryCard'
import { Heart, Activity, Droplet, Apple, Dumbbell, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

const HealthCategories = () => {
  const categories = [
    { title: 'Menstrual Health', count: 4, icon: Heart, colorClass: 'bg-gradient-to-br from-[#a78bfa] to-[#c4b5fd]' },
    { title: 'PCOS Awareness', count: 3, icon: Activity, colorClass: 'bg-gradient-to-br from-[#f472b6] to-[#fbcfe8]' },
    { title: 'Hygiene Tips', count: 5, icon: Droplet, colorClass: 'bg-gradient-to-br from-[#fbbf24] to-[#fde68a]' },
    { title: 'Nutrition Guide', count: 6, icon: Apple, colorClass: 'bg-gradient-to-br from-[#a78bfa] to-[#e879f9]' },
    { title: 'Exercise & Yoga', count: 4, icon: Dumbbell, colorClass: 'bg-gradient-to-br from-[#fb923c] to-[#fdba74]' },
    { title: 'Mental Wellness', count: 5, icon: Brain, colorClass: 'bg-gradient-to-br from-[#8b5cf6] to-[#d8b4fe]' },
  ]

  return (
    <div className="mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-poppins font-bold text-dark mb-2">Health Education</h2>
        <p className="text-gray-500">Expert-backed articles and guides for your wellness journey</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat, index) => (
          <CategoryCard 
            key={index}
            title={cat.title}
            count={cat.count}
            icon={cat.icon}
            colorClass={cat.colorClass}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default HealthCategories
