import { Phone, Heart, PlusSquare, ShieldAlert } from 'lucide-react'
import { motion } from 'framer-motion'

const HotlineCards = () => {
  const hotlines = [
    { title: "National Emergency", number: "911", icon: Phone },
    { title: "Women Helpline", number: "1091", icon: Heart },
    { title: "Health Helpline", number: "104", icon: PlusSquare },
    { title: "Mental Health", number: "1800-599-0019", icon: ShieldAlert }
  ]

  return (
    <div className="mb-10">
      <h3 className="text-xl font-poppins font-semibold text-dark mb-6">Emergency Hotlines</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotlines.map((hotline, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-card border border-primary/5 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-[#a78bfa] mb-4">
              <hotline.icon size={24} />
            </div>
            
            <h4 className="font-semibold text-dark text-sm mb-2">{hotline.title}</h4>
            
            <p className="text-2xl font-poppins font-medium text-[#a78bfa] mb-6 tracking-wide">
              {hotline.number}
            </p>
            
            <button className="w-full py-2.5 rounded-2xl border border-[#a78bfa]/30 text-[#a78bfa] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#a78bfa] hover:text-white transition-colors">
              <Phone size={16} />
              Call Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HotlineCards
