import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

const WeeklyTrends = ({ cycleLogs = [], wellnessLogs = [] }) => {
  const [activeTab, setActiveTab] = useState('mood');

  const { chartData, labels, hasEnoughData } = useMemo(() => {
    // Get last 7 days
    const dates = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    // Mood mapping
    const moodScoreMap = {
      'happy': 10, 'calm': 8, 'energetic': 9, 'focused': 7,
      'neutral': 5, 'sensitive': 4, 'sad': 2, 'anxious': 3, 'angry': 1
    };

    let dataCount = 0;
    const moodData = dates.map(date => {
      const log = cycleLogs.find(l => l.log_date === date);
      if (log?.mood) {
        dataCount++;
        return moodScoreMap[log.mood.toLowerCase()] || 5;
      }
      return null;
    });

    const energyData = dates.map(date => {
      const log = wellnessLogs.find(l => l.log_date === date);
      if (log?.energy_level) {
        dataCount++;
        return log.energy_level; // 1-10
      }
      return null;
    });

    const stressData = dates.map(date => {
      const log = wellnessLogs.find(l => l.log_date === date);
      if (log?.stress_level) {
        dataCount++;
        return log.stress_level; // 1-10
      }
      return null;
    });

    return {
      chartData: { mood: moodData, energy: energyData, stress: stressData },
      labels,
      hasEnoughData: dataCount >= 2
    };
  }, [cycleLogs, wellnessLogs]);

  // Helper to generate SVG path from data array (values 0-10)
  const generatePath = (dataArray) => {
    // Filter out nulls by interpolating or just skipping. 
    // For simplicity, we treat nulls as 0 but hide the dot, OR we draw lines between valid points.
    // Let's draw lines only between valid points.
    const validPoints = dataArray.map((val, idx) => ({ val, idx })).filter(p => p.val !== null);
    
    if (validPoints.length === 0) return { path: "", dots: [] };

    const width = 600;
    const height = 150; // Use 150 of the 200 viewbox for the chart
    const yOffset = 25; // padding top
    
    // x spacing
    const xStep = width / 6;

    const points = validPoints.map(p => {
      const x = p.idx * xStep;
      // y is inverted (10 is top, 0 is bottom)
      const y = yOffset + height - ((p.val / 10) * height);
      return { x, y, val: p.val, idx: p.idx };
    });

    if (points.length === 1) {
      // Just a dot
      return { path: `M ${points[0].x} ${points[0].y}`, dots: points };
    }

    // Generate smooth curve
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 2;
      const cpX2 = prev.x + (curr.x - prev.x) / 2;
      d += ` C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return { path: d, dots: points };
  };

  const activeData = chartData[activeTab];
  const { path, dots } = generatePath(activeData);

  const colors = {
    mood: { stroke: "#A78BFA", fill: "url(#moodGradient)", dot: "#A78BFA" },
    energy: { stroke: "#FDBA74", fill: "url(#energyGradient)", dot: "#FDBA74" },
    stress: { stroke: "#F9A8D4", fill: "url(#stressGradient)", dot: "#F9A8D4" },
  };

  const activeColor = colors[activeTab];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Weekly Trends</h3>
        
        {hasEnoughData && (
          <div className="flex bg-gray-50 rounded-full p-1 border border-gray-100">
            {['mood', 'energy', 'stress'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {!hasEnoughData ? (
        <div className="flex-1 flex items-center justify-center min-h-[220px] bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium text-sm">Track more daily logs to view weekly trends.</p>
        </div>
      ) : (
        <div className="relative w-full flex-1 min-h-[220px] mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-xs text-gray-400 font-medium z-10">
            <span className="-mt-2 text-primary/70">High</span>
            <span className="-mt-2">Mid</span>
            <span className="-mt-2">Low</span>
          </div>

          {/* Chart Container */}
          <div className="absolute left-10 right-2 top-0 bottom-6">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-dashed border-gray-100"></div>
              <div className="w-full border-t border-dashed border-gray-100"></div>
              <div className="w-full border-t border-dashed border-gray-100"></div>
              <div className="w-full border-t border-dashed border-gray-100"></div>
              <div className="w-full border-t border-solid border-gray-100"></div>
            </div>

            {/* SVG Line Chart */}
            <div className="absolute inset-0 h-full overflow-visible">
              <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F9A8D4" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F9A8D4" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {path && (
                  <>
                    <motion.path
                      key={`path-${activeTab}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      d={path}
                      fill="none"
                      stroke={activeColor.stroke}
                      strokeWidth="3"
                      vectorEffect="non-scaling-stroke"
                    />
                    
                    {/* Fill underneath */}
                    {dots.length > 1 && (
                      <motion.path
                        key={`fill-${activeTab}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        d={`${path} L ${dots[dots.length - 1].x} 200 L ${dots[0].x} 200 Z`}
                        fill={activeColor.fill}
                      />
                    )}

                    {/* Dots */}
                    {dots.map((dot, i) => (
                      <motion.circle
                        key={`dot-${activeTab}-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.2 }}
                        cx={dot.x} cy={dot.y} r="4" 
                        fill="white" 
                        stroke={activeColor.dot} 
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-10 right-2 flex justify-between text-xs text-gray-500 font-medium px-[1px]">
            {labels.map((label, i) => (
              <span key={i} className="w-8 text-center" style={{ transform: i === 0 ? 'translateX(-50%)' : i === 6 ? 'translateX(50%)' : 'none' }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default WeeklyTrends
