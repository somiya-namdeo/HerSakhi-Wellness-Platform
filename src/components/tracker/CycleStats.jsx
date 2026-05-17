import { motion } from 'framer-motion'

const CycleStats = ({ prediction }) => {
  const getDaysRemaining = () => {
    if (!prediction?.next_period_date) return '—';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextPeriod = new Date(prediction.next_period_date);
    nextPeriod.setHours(0, 0, 0, 0);
    
    const diffTime = nextPeriod - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '0';
    if (diffDays < 0) return 'Late';
    return diffDays;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Cycle Statistics</h3>
        {!prediction && <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Track more cycles to improve prediction</span>}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 transition-colors hover:bg-primary/10">
          <div className="text-xs font-medium text-gray-500 mb-1">Cycle Length</div>
          <div className="text-2xl font-bold font-poppins text-primary">
            {prediction?.predicted_cycle_length || '—'} <span className="text-sm font-medium">days</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-pink-400/5 rounded-2xl p-4 border border-pink-400/10 transition-colors hover:bg-pink-400/10">
          <div className="text-xs font-medium text-gray-500 mb-1">Period Length</div>
          <div className="text-2xl font-bold font-poppins text-pink-400">
            {prediction?.period_length || '—'} <span className="text-sm font-medium">days</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-peach/10 rounded-2xl p-4 border border-peach/20 transition-colors hover:bg-peach/20">
          <div className="text-xs font-medium text-gray-500 mb-1">Next Period</div>
          <div className="text-2xl font-bold font-poppins text-peach">
            {getDaysRemaining()} {prediction?.next_period_date && getDaysRemaining() !== 'Late' && <span className="text-sm font-medium">days</span>}
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/10 transition-colors hover:bg-red-500/10">
          <div className="text-xs font-medium text-gray-500 mb-1">Regularity</div>
          <div className="text-2xl font-bold font-poppins text-red-500">
            {prediction?.regularity_score ? `${prediction.regularity_score}%` : '—'}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CycleStats
