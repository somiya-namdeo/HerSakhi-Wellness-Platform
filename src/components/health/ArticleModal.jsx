import { X, Clock, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ArticleModal = ({ article, isOpen, onClose }) => {
  if (!article) return null

  let pillColor = 'bg-purple-50 text-purple-600 border border-purple-100'
  if (article.category === 'Diet & Lifestyle') pillColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  if (article.category === 'Emotional Wellness') pillColor = 'bg-pink-50 text-pink-600 border border-pink-100'
  if (article.category === 'Medical Guidance') pillColor = 'bg-amber-50 text-amber-600 border border-amber-100'
  if (article.category === 'Body & Cycle') pillColor = 'bg-sky-50 text-sky-600 border border-sky-100'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-2xl w-full shadow-xl border border-pink-100 relative z-10 max-h-[85vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Header info */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pillColor}`}>
                {article.category}
              </span>
              
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Clock size={12} />
                {article.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-poppins font-bold text-xl lg:text-2xl text-[#2d1b45] mb-4 leading-snug">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-gray-500 font-medium italic border-l-4 border-[#a78bfa] pl-4 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Main content body */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-4 mb-8 whitespace-pre-wrap">
              {article.content}
            </div>

            {/* Footer tags */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mr-1">
                <Tag size={12} />
                Tags:
              </span>
              {article.tags && article.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-purple-50 text-[#a78bfa] px-3 py-1 rounded-lg font-medium border border-purple-100/30">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ArticleModal
