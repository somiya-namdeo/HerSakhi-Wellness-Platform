import { Phone, Heart, PlusSquare, Shield, Smile, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

const HotlineCards = () => {
  const hotlines = [
    { 
      title: "National Emergency", 
      number: "112", 
      description: "Unified emergency response service for medical, police, or safety crises.",
      icon: Shield,
      bg: "bg-red-50 text-red-500",
      color: "border-red-100"
    },
    { 
      title: "Ambulance", 
      number: "108", 
      description: "24/7 free medical emergency response, first-aid, and hospital transport.",
      icon: PlusSquare,
      bg: "bg-emerald-50 text-emerald-500",
      color: "border-emerald-100"
    },
    { 
      title: "Women Helpline", 
      number: "181", 
      description: "24/7 immediate support, grievance redressal, and rescue for women in distress.",
      icon: Heart,
      bg: "bg-pink-50 text-pink-500",
      color: "border-pink-100"
    },
    { 
      title: "Women Police Helpline", 
      number: "1091", 
      description: "Dedicated national police service for women's safety, abuse, or harassment.",
      icon: Shield,
      bg: "bg-indigo-50 text-indigo-500",
      color: "border-indigo-100"
    },
    { 
      title: "Child Helpline", 
      number: "1098", 
      description: "Free, confidential 24-hour emergency phone outreach service for children.",
      icon: Smile,
      bg: "bg-amber-50 text-amber-500",
      color: "border-amber-100"
    },
    { 
      title: "Health Helpline", 
      number: "104", 
      description: "State-level health information, medical advice, and support services.",
      icon: Activity,
      bg: "bg-sky-50 text-sky-500",
      color: "border-sky-100"
    }
  ]

  const handleCallConfirm = (e, name, number) => {
    if (!window.confirm(`Are you sure you want to call the ${name} (${number})?`)) {
      e.preventDefault()
    }
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl font-poppins font-semibold text-[#2d1b45] mb-6">India Emergency Helplines</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotlines.map((hotline, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-100/30 flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl ${hotline.bg} flex items-center justify-center mb-4`}>
                <hotline.icon size={22} />
              </div>
              
              <h4 className="font-poppins font-semibold text-[#2d1b45] text-base mb-1">
                {hotline.title}
              </h4>
              
              <p className="text-xs text-gray-500 mb-4 leading-relaxed min-h-[40px]">
                {hotline.description}
              </p>
            </div>
            
            <div>
              <p className="text-2xl font-poppins font-bold text-[#a78bfa] mb-4 tracking-wide">
                {hotline.number}
              </p>
              
              <a 
                href={`tel:${hotline.number}`}
                onClick={(e) => handleCallConfirm(e, hotline.title, hotline.number)}
                className="w-full py-2.5 rounded-2xl border border-[#a78bfa]/30 text-[#a78bfa] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#a78bfa] hover:text-white transition-all duration-300"
              >
                <Phone size={14} />
                Call Now
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HotlineCards
