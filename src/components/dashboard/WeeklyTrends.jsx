import { motion } from 'framer-motion'

const WeeklyTrends = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Weekly Trends</h3>
      
      {/* Mock Chart Area */}
      <div className="relative w-full flex-1 min-h-[220px] mt-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-xs text-gray-500 font-medium z-10">
          <span className="-mt-2">12</span>
          <span className="-mt-2">9</span>
          <span className="-mt-2">6</span>
          <span className="-mt-2">3</span>
          <span className="-mt-2">0</span>
        </div>

        {/* Chart Container */}
        <div className="absolute left-8 right-0 top-0 bottom-6">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="w-full border-t border-dashed border-gray-200"></div>
            <div className="w-full border-t border-dashed border-gray-200"></div>
            <div className="w-full border-t border-dashed border-gray-200"></div>
            <div className="w-full border-t border-dashed border-gray-200"></div>
            <div className="w-full border-t border-solid border-gray-200"></div>
          </div>

          {/* SVG Line Chart */}
          <div className="absolute inset-0 h-full overflow-hidden">
            <svg viewBox="0 0 600 200" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                d="M 0 83.3 C 50 66.6, 50 66.6, 100 66.6 C 150 66.6, 150 100, 200 100 C 250 100, 250 83.3, 300 83.3 C 350 83.3, 350 50, 400 50 C 450 50, 450 66.6, 500 66.6 C 550 66.6, 550 83.3, 600 83.3"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                d="M 0 83.3 C 50 66.6, 50 66.6, 100 66.6 C 150 66.6, 150 100, 200 100 C 250 100, 250 83.3, 300 83.3 C 350 83.3, 350 50, 400 50 C 450 50, 450 66.6, 500 66.6 C 550 66.6, 550 83.3, 600 83.3 L 600 200 L 0 200 Z"
                fill="url(#chartGradient)"
              />
              
              {/* Small dot on Sat */}
              <motion.circle
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.3 }}
                cx="500" cy="66.6" r="4" fill="white" stroke="#A78BFA" strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* Tooltip Card for Sat */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.3 }}
            className="absolute bg-white px-3 py-1.5 rounded-xl shadow-[0_4px_20px_-4px_rgba(167,139,250,0.3)] border border-primary/10 text-center"
            style={{ left: '83.33%', top: '33.3%', transform: 'translate(-50%, -140%)' }}
          >
            <div className="text-xs font-semibold text-dark">Sat</div>
            <div className="text-[10px] text-gray-500 font-medium whitespace-nowrap">mood: 8</div>
            {/* Tooltip Arrow */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-primary/10 rotate-45"></div>
          </motion.div>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-xs text-gray-500 font-medium px-[1px]">
          <span className="w-6 text-center -ml-3">Mon</span>
          <span className="w-6 text-center">Tue</span>
          <span className="w-6 text-center">Wed</span>
          <span className="w-6 text-center">Thu</span>
          <span className="w-6 text-center">Fri</span>
          <span className="w-6 text-center">Sat</span>
          <span className="w-6 text-center -mr-3">Sun</span>
        </div>
      </div>
    </motion.div>
  )
}

export default WeeklyTrends
