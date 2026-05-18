import { useState, useEffect } from 'react'
import { UserPlus, Phone, Trash2, Edit2, X, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PersonalContacts = () => {
  const LOCAL_STORAGE_KEY = 'hersakhi_emergency_contacts'

  const defaultContacts = [
    { id: '1', name: "Mom", role: "Mother", phone: "+919876543210" },
    { id: '2', name: "Dr. Anjali Mehta", role: "Gynecologist", phone: "+919123456789" }
  ]

  const [contacts, setContacts] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({ name: '', role: '', phone: '' })
  const [error, setError] = useState('')

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (stored) {
      try {
        setContacts(JSON.parse(stored))
      } catch (e) {
        setContacts(defaultContacts)
      }
    } else {
      setContacts(defaultContacts)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultContacts))
    }
  }, [])

  // Save updated contact list to localStorage
  const saveContacts = (updated) => {
    setContacts(updated)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }

  // Validate and normalize to +91XXXXXXXXXX
  const validateAndNormalizePhone = (phoneStr) => {
    const clean = phoneStr.replace(/[\s\-\(\)]/g, "")
    
    // Exactly 10 digits (e.g., 9876543210)
    if (/^\d{10}$/.test(clean)) {
      return "+91" + clean
    }
    // +91 followed by exactly 10 digits (e.g., +919876543210)
    if (/^\+91\d{10}$/.test(clean)) {
      return clean
    }
    // 91 followed by exactly 10 digits (e.g., 919876543210)
    if (/^91\d{10}$/.test(clean)) {
      return "+" + clean
    }
    return null
  }

  const handleOpenAdd = () => {
    setEditingContact(null)
    setFormData({ name: '', role: '', phone: '' })
    setError('')
    setIsFormOpen(true)
  }

  const handleOpenEdit = (contact) => {
    setEditingContact(contact)
    setFormData({ name: contact.name, role: contact.role, phone: contact.phone })
    setError('')
    setIsFormOpen(true)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      const updated = contacts.filter(c => c.id !== id)
      saveContacts(updated)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const { name, role, phone } = formData
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!role.trim()) {
      setError('Relation or role is required.')
      return
    }

    const normalizedPhone = validateAndNormalizePhone(phone)
    if (!normalizedPhone) {
      setError('Invalid Indian phone number. Enter a 10-digit number (e.g., 9876543210) or +91 followed by 10 digits.')
      return
    }

    if (editingContact) {
      // Edit mode
      const updated = contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, name: name.trim(), role: role.trim(), phone: normalizedPhone } 
          : c
      )
      saveContacts(updated)
    } else {
      // Add mode
      const newContact = {
        id: Date.now().toString(),
        name: name.trim(),
        role: role.trim(),
        phone: normalizedPhone
      }
      saveContacts([...contacts, newContact])
    }

    setIsFormOpen(false)
    setFormData({ name: '', role: '', phone: '' })
  }

  const handleCall = (e, name, phone) => {
    if (!window.confirm(`Call ${name} (${phone})?`)) {
      e.preventDefault()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-pink-100/30 h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-poppins font-semibold text-xl text-[#2d1b45]">Personal Emergency Contacts</h3>
          {!isFormOpen && (
            <button 
              onClick={handleOpenAdd}
              className="text-sm font-semibold text-[#a78bfa] flex items-center gap-1 hover:text-[#a78bfa]/80 transition-colors"
            >
              <UserPlus size={16} />
              Add Contact
            </button>
          )}
        </div>

        {/* Form Overlay/Inline Area */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#fff7fb] border border-pink-100 rounded-2xl p-4 mb-6 overflow-hidden"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-poppins font-semibold text-sm text-[#2d1b45]">
                  {editingContact ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
                </h4>
                <button 
                  type="button" 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>

              {error && (
                <div className="flex items-start gap-1.5 text-xs text-red-500 mb-3 bg-red-50 p-2 rounded-lg">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                  <input 
                    type="text"
                    placeholder="e.g., Mom, Sister, Dr. Sarah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#a78bfa] bg-white text-[#2d1b45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Relation / Role</label>
                  <input 
                    type="text"
                    placeholder="e.g., Mother, Friend, Gynecologist"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#a78bfa] bg-white text-[#2d1b45]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number (Indian)</label>
                  <input 
                    type="text"
                    placeholder="e.g., 9876543210 or +919876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-pink-200 focus:outline-none focus:border-[#a78bfa] bg-white text-[#2d1b45]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-[#a78bfa] hover:bg-[#a78bfa]/90 text-white font-semibold text-xs rounded-xl shadow-soft transition-colors"
                >
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Contacts Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-gray-400 text-sm">
              No emergency contacts added yet.
            </div>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="flex justify-between items-center p-4 rounded-2xl bg-[#fff7fb] border border-pink-100/20 hover:bg-pink-50/50 transition-colors"
              >
                <div>
                  <p className="font-poppins font-semibold text-[#2d1b45] text-sm">{contact.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{contact.role}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#a78bfa] font-semibold font-mono bg-pink-50 px-2 py-0.5 rounded-full hidden md:inline-block">
                    {contact.phone}
                  </span>
                  
                  <div className="flex gap-1">
                    <a 
                      href={`tel:${contact.phone}`}
                      onClick={(e) => handleCall(e, contact.name, contact.phone)}
                      className="w-9 h-9 rounded-xl border border-[#a78bfa]/20 flex items-center justify-center text-[#a78bfa] hover:bg-[#a78bfa] hover:text-white transition-colors"
                      title="Call Contact"
                    >
                      <Phone size={14} />
                    </a>
                    
                    <button 
                      onClick={() => handleOpenEdit(contact)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                      title="Edit Contact"
                    >
                      <Edit2 size={14} />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(contact.id, contact.name)}
                      className="w-9 h-9 rounded-xl border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <p className="text-[10px] text-gray-400 mt-6 leading-relaxed border-t border-gray-100 pt-3">
        Your emergency contacts are stored securely on your local device. Make sure you obtain their permission to receive emergency calls.
      </p>
    </motion.div>
  )
}

export default PersonalContacts
