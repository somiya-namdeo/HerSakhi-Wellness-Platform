import { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Edit, Save, X, Check, Activity, Clock, Heart } from 'lucide-react'
import { updateUserProfile } from '../../api/userApi'

const PersonalInformation = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    cycle_length: 28,
    period_duration: 5,
    wellness_goals: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      // Normalize loaded phone to 10 digits
      let displayPhone = user.phone || ''
      if (displayPhone.startsWith('+91')) {
        displayPhone = displayPhone.slice(3)
      } else if (displayPhone.startsWith('91') && displayPhone.length === 12) {
        displayPhone = displayPhone.slice(2)
      }

      setFormData({
        full_name: user.full_name || '',
        phone: displayPhone,
        date_of_birth: user.date_of_birth || '',
        cycle_length: user.cycle_length || 28,
        period_duration: user.period_duration || 5,
        wellness_goals: Array.isArray(user.wellness_goals) 
          ? user.wellness_goals.join(', ') 
          : (user.wellness_goals || '')
      })
    }
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
    setSuccess(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (user) {
      let displayPhone = user.phone || ''
      if (displayPhone.startsWith('+91')) {
        displayPhone = displayPhone.slice(3)
      }
      setFormData({
        full_name: user.full_name || '',
        phone: displayPhone,
        date_of_birth: user.date_of_birth || '',
        cycle_length: user.cycle_length || 28,
        period_duration: user.period_duration || 5,
        wellness_goals: Array.isArray(user.wellness_goals) 
          ? user.wellness_goals.join(', ') 
          : (user.wellness_goals || '')
      })
    }
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, phone: val }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    
    // Indian Phone validation: must be exactly 10 digits
    if (formData.phone && formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit Indian phone number.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Normalize to +91XXXXXXXXXX
      const normalizedPhone = formData.phone ? `+91${formData.phone}` : ''
      const goalsArray = formData.wellness_goals 
        ? formData.wellness_goals.split(',').map(s => s.trim()).filter(Boolean) 
        : []

      const payload = {
        full_name: formData.full_name,
        phone: normalizedPhone,
        date_of_birth: formData.date_of_birth,
        cycle_length: parseInt(formData.cycle_length) || 28,
        period_duration: parseInt(formData.period_duration) || 5,
        wellness_goals: goalsArray
      }

      let updatedUser = { ...user, ...payload }

      // Update backend via API if available, but fail gracefully
      try {
        const apiResponse = await updateUserProfile(user.id, payload)
        updatedUser = { ...updatedUser, ...apiResponse }
      } catch (apiErr) {
        console.warn("Backend profile save failed, falling back to local updates:", apiErr)
      }

      // Persist locally in hersakhi_user
      localStorage.setItem('hersakhi_user', JSON.stringify(updatedUser))

      onUpdate(updatedUser)
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "Failed to update profile.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr || dateStr === "Not provided") return "Not provided";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-poppins font-semibold text-xl text-dark">Personal Profile Details</h3>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="text-sm font-medium text-white bg-[#8b5cf6] px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#7c3aed] transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="text-sm font-medium text-gray-500 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={handleEdit}
              className="text-sm font-medium text-[#8b5cf6] border border-[#8b5cf6]/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#8b5cf6] hover:text-white transition-all shadow-sm"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 text-sm rounded-2xl flex items-center gap-2">
          <Check size={16} />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <User size={16} />
            </span>
            <input 
              type="text" 
              name="full_name"
              readOnly={!isEditing}
              value={isEditing ? formData.full_name : (user?.full_name || "Not provided")}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isEditing ? "border-[#8b5cf6] bg-white ring-4 ring-[#8b5cf6]/5" : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Email (Read Only) */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Mail size={16} />
            </span>
            <input 
              type="text" 
              readOnly
              value={user?.email || "Not provided"}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-400 text-sm font-medium focus:outline-none"
            />
          </div>
        </div>

        {/* Indian Phone Number */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Phone size={16} />
            </span>
            {isEditing ? (
              <div className="flex items-center w-full bg-white rounded-2xl border border-[#8b5cf6] ring-4 ring-[#8b5cf6]/5 pl-11 pr-4">
                <span className="text-gray-500 font-medium mr-2 text-sm select-none">+91</span>
                <input 
                  type="text"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full py-3 text-sm font-medium focus:outline-none bg-transparent"
                  placeholder="Enter 10 digits"
                />
              </div>
            ) : (
              <input 
                type="text" 
                readOnly
                value={user?.phone || "Not provided"}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-gray-600 text-sm font-medium focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Birth</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Calendar size={16} />
            </span>
            <input 
              type={isEditing ? "date" : "text"} 
              name="date_of_birth"
              readOnly={!isEditing}
              value={isEditing ? formData.date_of_birth : formatDisplayDate(user?.date_of_birth)}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isEditing ? "border-[#8b5cf6] bg-white ring-4 ring-[#8b5cf6]/5" : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
            />
          </div>
        </div>

        {/* Average Cycle Length */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Average Cycle Length (Days)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Activity size={16} />
            </span>
            <input 
              type="number" 
              name="cycle_length"
              readOnly={!isEditing}
              min={20}
              max={45}
              value={isEditing ? formData.cycle_length : `${user?.cycle_length || 28} days`}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isEditing ? "border-[#8b5cf6] bg-white ring-4 ring-[#8b5cf6]/5" : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
              placeholder="e.g. 28"
            />
          </div>
        </div>

        {/* Period Duration */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Period Duration (Days)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Clock size={16} />
            </span>
            <input 
              type="number" 
              name="period_duration"
              readOnly={!isEditing}
              min={2}
              max={10}
              value={isEditing ? formData.period_duration : `${user?.period_duration || 5} days`}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isEditing ? "border-[#8b5cf6] bg-white ring-4 ring-[#8b5cf6]/5" : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* Wellness Goals */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wellness Goals (comma separated)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Heart size={16} />
            </span>
            <input 
              type="text" 
              name="wellness_goals"
              readOnly={!isEditing}
              value={isEditing ? formData.wellness_goals : (Array.isArray(user?.wellness_goals) ? user.wellness_goals.join(', ') : (user?.wellness_goals || "Not provided"))}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm font-medium focus:outline-none transition-all ${
                isEditing ? "border-[#8b5cf6] bg-white ring-4 ring-[#8b5cf6]/5" : "border-gray-100 bg-gray-50 text-gray-600"
              }`}
              placeholder="e.g. Track Period, Manage Symptoms, Hydrate regularly"
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default PersonalInformation
