import { CalendarDays, Flower2, Sparkles, Activity, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { calculateDaysUntil, formatDaysUntil, formatShortDate, formatDateRange } from '../../utils/dateHelpers'

const PredictionSummary = ({ prediction, loading, error }) => {

  const daysRemaining = calculateDaysUntil(prediction?.next_period_date)

  const defaultPredictions = [
    {
      icon: CalendarDays,
      title: "Next Period Prediction",
      detail: "Complete onboarding to see this.",
      colorClass: "bg-primary/5 border-primary/10 text-primary"
    },
    {
      icon: Flower2,
      title: "Fertile Window",
      detail: "Complete onboarding to see this.",
      colorClass: "bg-pink-50 border-pink-100 text-pink-400"
    },
    {
      icon: Sparkles,
      title: "Ovulation Day",
      detail: "Complete onboarding to see this.",
      colorClass: "bg-orange-50 border-orange-100 text-orange-400"
    },
    {
      icon: Activity,
      title: "Cycle Regularity",
      detail: "Complete onboarding to see this.",
      colorClass: "bg-green-50 border-green-100 text-green-500"
    }
  ]

  const mappedPredictions = prediction ? [
    {
      icon: CalendarDays,
      title: "Next Period Prediction",
      detail: `Your next period is ${formatDaysUntil(daysRemaining)}.`,
      colorClass: "bg-primary/5 border-primary/10 text-primary"
    },
    {
      icon: Flower2,
      title: "Fertile Window",
      detail: `Estimated fertile window: ${formatDateRange(prediction.fertile_window_start, prediction.fertile_window_end)}.`,
      colorClass: "bg-pink-50 border-pink-100 text-pink-400"
    },
    {
      icon: Sparkles,
      title: "Ovulation Day",
      detail: `Predicted ovulation: ${formatShortDate(prediction.ovulation_date)}.`,
      colorClass: "bg-orange-50 border-orange-100 text-orange-400"
    },
    {
      icon: Activity,
      title: "Cycle Regularity",
      detail: prediction.cycle_regularity
        ? `Your cycle is ${prediction.cycle_regularity.toLowerCase()} based on recent logs.`
        : `Your cycle looks ${prediction.regularity_score}% regular based on recent logs.`,
      colorClass: "bg-green-50 border-green-100 text-green-500"
    }
  ] : defaultPredictions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">
        Cycle Prediction Summary
      </h3>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-primary">
          <Loader2 className="animate-spin w-8 h-8 mb-4" />
          <span className="font-medium text-sm">Calculating your cycle predictions...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 text-sm font-medium rounded-xl border border-red-100 text-center">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {mappedPredictions.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border ${item.colorClass}`}
            >
              <div className="mt-0.5 shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm text-dark mb-0.5">{item.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            </motion.div>
          ))}
          
          {prediction?.recommendation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-800 font-medium leading-relaxed">
                <span className="font-bold text-blue-900 block mb-1">Health Insight:</span>
                {prediction.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default PredictionSummary

