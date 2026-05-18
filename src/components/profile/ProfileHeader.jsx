import { Edit2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { getUserInitials } from '../../utils/userHelpers'

const ProfileHeader = ({ user }) => {
  const [photo, setPhoto] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const savedPhoto = localStorage.getItem('hersakhi_profile_photo')
    if (savedPhoto) {
      setPhoto(savedPhoto)
    }

    const handleStorageChange = () => {
      setPhoto(localStorage.getItem('hersakhi_profile_photo'))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert("Please upload image files only.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target.result
      localStorage.setItem('hersakhi_profile_photo', base64String)
      setPhoto(base64String)
      
      // Dispatch storage event so Topbar or other headers sync immediately
      window.dispatchEvent(new Event('storage'))
    }
    reader.readAsDataURL(file)
  }

  const initials = getUserInitials(user?.full_name);
  const fullName = user?.full_name || "User Name";

  return (
    <div className="flex items-center gap-6 mb-10">
      <div className="relative">
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="w-24 h-24 rounded-full bg-[#c4b5fd] flex items-center justify-center text-white text-3xl font-poppins font-medium shadow-md overflow-hidden border-2 border-white">
          {photo ? (
            <img src={photo} className="w-full h-full object-cover" alt="Profile" />
          ) : (
            initials
          )}
        </div>
        <button 
          onClick={handleEditClick}
          className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#a78bfa] shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          title="Upload profile photo"
        >
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
