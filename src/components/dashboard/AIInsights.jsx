import { Sparkles, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const AIInsights = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">AI Wellness Insights</h3>
        <Sparkles size={20} className="text-primary" />
      </div>
      
      <div className="space-y-4 flex-1">
        {/* Insight 1 */}
        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 transition-colors hover:bg-primary/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            Your cycle has been consistent this month. Great tracking!
          </p>
        </div>

        {/* Insight 2 */}
        <div className="bg-softPink/5 p-4 rounded-2xl border border-softPink/10 transition-colors hover:bg-softPink/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            Consider increasing hydration to help reduce potential headaches.
          </p>
        </div>

        {/* Insight 3 */}
        <div className="bg-peach/5 p-4 rounded-2xl border border-peach/10 transition-colors hover:bg-peach/10 cursor-default">
          <p className="text-sm text-gray-700 leading-relaxed">
            Your energy levels are highest during the follicular phase. Plan activities accordingly!
          </p>
        </div>
      </div>

      <button 
        onClick={() => navigate('/assistant')}
        className="w-full mt-6 py-3.5 rounded-2xl border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
      >
        Chat with AI Assistant 
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  )
}

export default AIInsights
