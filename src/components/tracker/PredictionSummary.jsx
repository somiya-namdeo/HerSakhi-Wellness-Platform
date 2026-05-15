import { CalendarDays, Flower2, Sparkles, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const PredictionSummary = () => {
  const predictions = [
    {
      icon: CalendarDays,
      title: "Next Period Prediction",
      detail: "Your next period is expected in 5 days.",
      colorClass: "bg-primary/5 border-primary/10 text-primary"
    },
    {
      icon: Flower2,
      title: "Fertile Window",
      detail: "Estimated fertile window: May 25–30.",
      colorClass: "bg-pink-50 border-pink-100 text-pink-400"
    },
    {
      icon: Sparkles,
      title: "Ovulation Day",
      detail: "Predicted ovulation: May 28.",
      colorClass: "bg-orange-50 border-orange-100 text-orange-400"
    },
    {
      icon: Activity,
      title: "Cycle Regularity",
      detail: "Your cycle looks 95% regular based on recent logs.",
      colorClass: "bg-green-50 border-green-100 text-green-500"
    }
  ]

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

      <div className="space-y-4">
        {predictions.map((item, index) => (
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
      </div>
    </motion.div>
  )
}

export default PredictionSummary
