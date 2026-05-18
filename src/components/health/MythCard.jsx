import { useState } from 'react'
import { AlertCircle, CheckCircle, ChevronDown, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MythCard = ({ mythItem }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Map categories to high-contrast pastel pills
  let catColor = 'bg-purple-50 text-[#6d28d9] border border-purple-200'
  if (mythItem.category === 'Hygiene') catColor = 'bg-sky-50 text-[#0369a1] border border-sky-200'
  if (mythItem.category === 'Exercise') catColor = 'bg-emerald-50 text-[#047857] border border-emerald-200'
  if (mythItem.category === 'Period Myths') catColor = 'bg-rose-50 text-[#be185d] border border-rose-200'
  if (mythItem.category === 'Fertility') catColor = 'bg-indigo-50 text-[#4338ca] border border-indigo-200'
  if (mythItem.category === 'Nutrition') catColor = 'bg-amber-50 text-[#b45309] border border-amber-200'
  if (mythItem.category === 'PCOS Myths') catColor = 'bg-amber-50 text-[#b45309] border border-amber-200'
  if (mythItem.category === 'Pregnancy Myths') catColor = 'bg-pink-50 text-[#be185d] border border-pink-200'
  if (mythItem.category === 'Mental Health') catColor = 'bg-violet-50 text-[#5c10c5] border border-violet-200'
  if (mythItem.category === 'Hormones') catColor = 'bg-purple-50 text-[#6d28d9] border border-purple-200'
  if (mythItem.category === 'Lifestyle') catColor = 'bg-slate-50 text-slate-700 border border-slate-200'

  return (
    <motion.div 
      layout
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-100/30 flex flex-col justify-between"
    >
      <div>
        {/* Category & Tags Row */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${catColor}`}>
            {mythItem.category}
          </span>
          
          <div className="flex gap-1">
            {mythItem.tags && mythItem.tags.slice(0, 1).map((tag, idx) => (
              <span key={idx} className="text-[9px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Myth Block */}
        <div className="flex gap-3 items-start mb-4 bg-red-50/40 p-4 rounded-2xl border border-red-100/30">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider block mb-0.5">
              Common Myth
            </span>
            <p className="text-xs md:text-sm font-semibold text-[#2d1b45] leading-relaxed">
              "{mythItem.myth}"
            </p>
          </div>
        </div>

        {/* Fact Block */}
        <div className="flex gap-3 items-start mb-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/30">
          <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block mb-0.5">
              The Fact
            </span>
            <p className="text-xs md:text-sm font-semibold text-emerald-800 leading-relaxed">
              {mythItem.fact}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {/* Toggle explanation button */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 rounded-2xl bg-gray-50 hover:bg-[#8b5cf6]/10 text-xs font-bold text-[#8b5cf6] flex items-center justify-center gap-1.5 transition-colors"
        >
          <BookOpen size={14} />
          {isExpanded ? "Hide Details" : "Learn More"}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </button>

        {/* Expandable Explanation block */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <div className="p-4 bg-purple-50/20 border border-purple-100/30 rounded-2xl text-xs text-gray-600 leading-relaxed">
                {mythItem.explanation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default MythCard
