import { Shield, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const SafetyResources = () => {
  const resources = [
    {
      title: "Domestic Violence Hotline",
      description: "Confidential support 24/7 for women in crisis",
      contact: "1-800-799-7233"
    },
    {
      title: "Sexual Assault Support",
      description: "Free, confidential support from trained staff",
      contact: "1-800-656-4673"
    },
    {
      title: "Mental Health Crisis",
      description: "Immediate mental health support and counseling",
      contact: "988"
    }
  ]

  return (
    <div className="mb-10">
      <h3 className="text-xl font-poppins font-semibold text-dark mb-6">Safety Resources</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
            className="bg-white rounded-[2rem] p-6 shadow-card border border-primary/5 flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-400 mb-4">
              <Shield size={24} />
            </div>
            
            <h4 className="font-semibold text-dark mb-2">{resource.title}</h4>
            <p className="text-sm text-gray-500 mb-6 flex-1">{resource.description}</p>
            
            <div className="mt-auto">
              <p className="text-xs font-medium text-gray-400 mb-1">Contact:</p>
              <p className="text-xl font-poppins font-medium text-pink-400 mb-4 tracking-wide">
                {resource.contact}
              </p>
              <button className="w-full py-2.5 rounded-2xl border border-[#a78bfa]/30 text-[#a78bfa] font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#a78bfa] hover:text-white transition-colors">
                <Phone size={16} />
                Call for Help
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SafetyResources
