import { UserPlus, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const PersonalContacts = () => {
  const contacts = [
    { name: "Mom", role: "Mother", phone: "+1 (555) 123-4567" },
    { name: "Dr. Sarah Wilson", role: "Gynecologist", phone: "+1 (555) 987-6543" },
    { name: "Emily Davis", role: "Emergency Contact", phone: "+1 (555) 456-7890" }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 h-full flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-poppins font-semibold text-xl text-dark">Personal Contacts</h3>
        <button className="text-sm font-medium text-[#a78bfa] flex items-center gap-1 hover:text-primary transition-colors">
          <UserPlus size={16} />
          Add Contact
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {contacts.map((contact, index) => (
          <div key={index} className="flex justify-between items-center p-5 rounded-2xl bg-[#fdf7fb] hover:bg-pink-50 transition-colors">
            <div>
              <p className="font-semibold text-dark text-sm">{contact.name}</p>
              <p className="text-xs text-gray-500 mt-1">{contact.role}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#a78bfa] font-medium hidden sm:block">{contact.phone}</span>
              <button className="w-10 h-10 rounded-full border border-[#a78bfa]/30 flex items-center justify-center text-[#a78bfa] hover:bg-[#a78bfa] hover:text-white transition-colors">
                <Phone size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default PersonalContacts
