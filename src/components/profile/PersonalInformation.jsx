import { useState, useEffect } from 'react'
import { User, Mail, Phone, Calendar, Edit, Save, X, Check } from 'lucide-react'
import { updateUserProfile } from '../../api/userApi'

const PersonalInformation = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone ? user.phone.replace('+91', '') : '',
        date_of_birth: user.date_of_birth || ''
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
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone ? user.phone.replace('+91', '') : '',
        date_of_birth: user.date_of_birth || ''
      })
    }
  }

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, phone: val }))
  }

  const handleSave = async () => {
    if (!user?.id) return
    
    if (formData.phone && formData.phone.length !== 10) {
      setError("Phone number must be 10 digits.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...formData,
        phone: formData.phone ? `+91${formData.phone}` : ''
      }
      const updatedUser = await updateUserProfile(user.id, payload)
      onUpdate({ ...user, ...updatedUser })
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
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

  const fields = [
    { 
      name: "full_name", 
      label: "Full Name", 
      value: isEditing ? formData.full_name : (user?.full_name || "Not provided"), 
      icon: User, 
      editable: true 
    },
    { 
      name: "email", 
      label: "Email Address", 
      value: user?.email || "Not provided", 
      icon: Mail, 
      editable: false 
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      value: isEditing ? formData.phone : (user?.phone || "Not provided"), 
      icon: Phone, 
      editable: true 
    },
    { 
      name: "date_of_birth", 
      label: "Date of Birth", 
      value: isEditing ? formData.date_of_birth : formatDisplayDate(user?.date_of_birth), 
      icon: Calendar, 
      editable: true 
    }
  ]

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-poppins font-semibold text-xl text-dark">Personal Information</h3>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="text-sm font-medium text-white bg-primary px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Save
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
              className="text-sm font-medium text-primary border border-primary/30 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
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

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-600 mb-2">{field.label}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <field.icon size={18} />
              </div>
              
              {field.name === 'phone' && isEditing ? (
                <div className="flex items-center w-full bg-white rounded-2xl border border-primary/30 ring-4 ring-primary/5 pl-11 pr-4 overflow-hidden">
                  <span className="text-gray-500 font-medium mr-2 text-sm select-none">+91</span>
                  <input 
                    type="text"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full py-3 text-sm font-medium focus:outline-none bg-transparent"
                    placeholder="Enter 10 digits"
                  />
                </div>
              ) : (
                <input 
                  type={field.name === 'date_of_birth' && isEditing ? "date" : "text"} 
                  name={field.name}
                  readOnly={!isEditing || !field.editable}
                  value={field.value}
                  onChange={field.editable ? handleChange : undefined}
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border transition-all text-sm font-medium focus:outline-none ${
                    isEditing && field.editable 
                      ? "border-primary/30 bg-white ring-4 ring-primary/5" 
                      : "border-primary/10 bg-gray-50 text-gray-700"
                  }`}
                  placeholder={isEditing ? `Enter ${field.label.toLowerCase()}` : ""}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PersonalInformation
