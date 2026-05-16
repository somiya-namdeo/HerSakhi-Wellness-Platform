import { motion } from 'framer-motion'

// Style class map for each recommendation card variant
const STYLE_MAP = {
  primary: 'bg-primary/5 border-primary/10',
  pink:    'bg-pink-400/5 border-pink-400/10',
  peach:   'bg-peach/10 border-peach/20',
  gray:    'bg-gray-50 border-gray-100',
}

const LABEL_COLOR_MAP = {
  primary: 'text-primary',
  pink:    'text-pink-500',
  peach:   'text-orange-500',
  gray:    'text-gray-600',
}

const AIRecommendations = ({ recommendations = [], insights = null }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.6 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const hasInsights = !!insights

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white rounded-[30px] p-6 lg:p-8 shadow-card border border-primary/5 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">AI Recommendations</h3>
        {!hasInsights && (
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            Based on your logs
          </span>
        )}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {recommendations.map((rec, i) => (
          <motion.div
            key={i}
            variants={item}
            className={`p-5 rounded-2xl border ${STYLE_MAP[rec.style] ?? STYLE_MAP.gray}`}
          >
            <p className="text-sm text-gray-700">
              <span className={`font-semibold ${LABEL_COLOR_MAP[rec.style] ?? 'text-dark'}`}>
                {rec.label}:{' '}
              </span>
              {rec.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AIRecommendations
