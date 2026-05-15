import { motion } from 'framer-motion'

const MythBusters = () => {
  const items = [
    {
      myth: "You can't exercise during your period",
      fact: "Light to moderate exercise can actually help reduce cramps and improve mood."
    },
    {
      myth: "PMS is all in your head",
      fact: "PMS is caused by hormonal changes and is a real medical condition."
    },
    {
      myth: "Period pain is normal and you should just deal with it",
      fact: "While some discomfort is common, severe pain may indicate underlying conditions."
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Myth Busters</h3>

      <div className="space-y-4 flex-1">
        {items.map((item, index) => (
          <div key={index} className="p-5 rounded-2xl bg-[#fff5f5] border border-red-100">
            <p className="text-sm font-semibold text-red-500 mb-2">
              Myth: <span className="font-medium text-gray-700">{item.myth}</span>
            </p>
            <p className="text-sm font-semibold text-primary">
              Fact: <span className="font-medium text-gray-600">{item.fact}</span>
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default MythBusters
