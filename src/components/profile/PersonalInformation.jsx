import { User, Mail, Phone, Calendar, Edit } from 'lucide-react'

const PersonalInformation = () => {
  const fields = [
    { label: "Full Name", value: "Sarah Johnson", icon: User },
    { label: "Email Address", value: "sarah.johnson@email.com", icon: Mail },
    { label: "Phone Number", value: "+1 (555) 123-4567", icon: Phone },
    { label: "Date of Birth", value: "15-06-1995", icon: Calendar }
  ]

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-poppins font-semibold text-xl text-dark">Personal Information</h3>
        <button className="text-sm font-medium text-[#a78bfa] border border-[#a78bfa]/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#a78bfa] hover:text-white transition-colors">
          <Edit size={16} />
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <field.icon size={18} />
              </div>
              <input 
                type="text" 
                readOnly
                value={field.value}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-primary/10 bg-gray-50 text-gray-700 text-sm font-medium focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalInformation
