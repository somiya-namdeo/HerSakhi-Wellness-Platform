import { Edit2 } from 'lucide-react'
import { getUserInitials } from '../../utils/userHelpers'

const ProfileHeader = ({ user }) => {
  const initials = getUserInitials(user?.full_name);
  const fullName = user?.full_name || "User Name";

  return (
    <div className="flex items-center gap-6 mb-10">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-[#c4b5fd] flex items-center justify-center text-white text-3xl font-poppins font-medium shadow-md">
          {initials}
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#a78bfa] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
          <Edit2 size={14} />
        </button>
      </div>
      
      <div>
        <h2 className="text-3xl font-poppins font-bold text-dark mb-1">{fullName}</h2>
        <p className="text-gray-500 font-medium">Member</p>
      </div>
    </div>
  )
}

export default ProfileHeader
