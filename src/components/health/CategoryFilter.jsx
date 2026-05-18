import { motion } from 'framer-motion'

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
      {categories.map((category) => {
        const isActive = selectedCategory === category
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-2xl border transition-all duration-200 shrink-0 ${
              isActive 
                ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-md hover:bg-[#7c3aed]' 
                : 'bg-white border-pink-200 text-[#2d1b45] hover:bg-purple-50 hover:border-[#8b5cf6]/55'
            }`}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
