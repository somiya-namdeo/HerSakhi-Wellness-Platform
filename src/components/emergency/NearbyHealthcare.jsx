import { MapPin, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

const NearbyHealthcare = () => {
  const facilities = [
    { 
      name: "Women's Health Clinic", 
      address: "123 Main Street, City", 
      category: "Gynecology", 
      distance: "0.8 mi" 
    },
    { 
      name: "City General Hospital", 
      address: "456 Healthcare Ave, City", 
      category: "Emergency Care", 
      distance: "1.2 mi" 
    },
    { 
      name: "Wellness Medical Center", 
      address: "789 Wellness Blvd, City", 
      category: "Women's Health", 
      distance: "2.1 mi" 
    }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Nearby Healthcare</h3>
        <button className="text-sm font-medium text-[#a78bfa] flex items-center gap-1 hover:text-primary transition-colors">
          <MapPin size={16} />
          Find More
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {facilities.map((facility, index) => (
          <div key={index} className="p-5 rounded-2xl bg-[#fdf7fb] hover:bg-pink-50 transition-colors relative">
            <div className="absolute top-5 right-5">
              <span className="text-[10px] font-semibold text-[#a78bfa] bg-[#a78bfa]/10 px-2 py-1 rounded-full">
                {facility.distance}
              </span>
            </div>
            
            <h4 className="font-semibold text-dark text-sm pr-12">{facility.name}</h4>
            <p className="text-xs text-gray-500 mt-1 mb-3">{facility.address}</p>
            
            <div className="flex justify-between items-center">
              <p className="text-xs font-medium text-gray-600">{facility.category}</p>
              <button className="text-[#a78bfa] hover:text-primary transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default NearbyHealthcare
