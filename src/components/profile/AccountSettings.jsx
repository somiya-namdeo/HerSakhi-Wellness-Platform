import { useState } from 'react'
import { Lock, Shield, Globe, Info, X, Check, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStoredUser } from '../../utils/userHelpers'
import { changePassword } from '../../api/authApi'

const AccountSettings = () => {
  // Modal toggle states
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)

  // Password fields state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required.')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and Confirm password do not match.')
      return
    }

    const currentUser = getStoredUser()
    if (!currentUser || !currentUser.id) {
      setPasswordError('User session not found. Please log in again.')
      return
    }

    try {
      await changePassword({
        user_id: currentUser.id,
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      })

      setPasswordSuccess('Password changed successfully!')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess('')
      }, 1500)
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.')
    }
  }

  const resetPasswordForm = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setPasswordSuccess('')
    setShowPasswordModal(false)
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8 relative">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Account Settings</h3>

      <div className="space-y-1">
        {/* Change Password Button */}
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50/10 transition-all text-left group"
        >
          <Lock size={18} className="text-[#8b5cf6] shrink-0" />
          <span className="font-semibold text-gray-700 text-xs md:text-sm group-hover:text-[#8b5cf6] transition-colors">Change Password</span>
        </button>
        
        {/* Privacy Settings Button */}
        <button 
          onClick={() => setShowPrivacyModal(true)}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-50/10 transition-all text-left group"
        >
          <Shield size={18} className="text-pink-400 shrink-0" />
          <span className="font-semibold text-gray-700 text-xs md:text-sm group-hover:text-[#8b5cf6] transition-colors">Privacy & Data Security</span>
        </button>
        
        {/* Language Selection Button */}
        <button
          onClick={() => setShowLanguageModal(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-purple-50/10 transition-all text-left group"
        >
          <div className="flex items-center gap-4">
            <Globe size={18} className="text-orange-400 shrink-0" />
            <div>
              <p className="font-semibold text-gray-700 text-xs md:text-sm group-hover:text-[#8b5cf6] transition-colors">Language</p>
              <p className="text-[10px] text-gray-400 mt-0.5">English (India)</p>
            </div>
          </div>
          <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-bold">Active</span>
        </button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-purple-100/50 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-poppins font-bold text-lg text-[#2d1b45] flex items-center gap-2">
                  <Lock size={20} className="text-[#8b5cf6]" />
                  Change Password
                </h4>
                <button 
                  onClick={resetPasswordForm}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPass ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b5cf6] text-xs font-medium"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="•••••••• (Min 8 characters)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b5cf6] text-xs font-medium"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPass ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#8b5cf6] text-xs font-medium"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Validation Warnings / Success */}
                {passwordError && (
                  <div className="p-3 rounded-xl text-xs font-bold bg-red-50 text-red-500 border border-red-200/50 flex items-start gap-2 animate-shake">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/50 flex items-start gap-2">
                    <Check size={14} className="shrink-0 mt-0.5" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-2xl transition-all shadow-soft mt-2"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY & DATA SECURITY MODAL */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-pink-100/50 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-poppins font-bold text-lg text-[#2d1b45] flex items-center gap-2">
                  <Shield size={20} className="text-pink-400" />
                  Privacy & Data Security
                </h4>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-gray-600 leading-relaxed mb-6">
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/30">
                  <Check size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <p><strong>Secure Data Storage:</strong> All cycle and medical indicators are stored with high encryption standard protocols in transit.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/30">
                  <Check size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <p><strong>Emergency Contacts Local Storage:</strong> Personal safety emergency logs and SOS contact entries reside securely in your browser's local sandbox.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/30">
                  <Check size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <p><strong>Reminders Cached Locally:</strong> Settings for pill intervals, hydration schedules, and period alerts stay completely on your device.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/30">
                  <Check size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <p><strong>Data Control:</strong> All cycles and indicator data remain under your total ownership, with full security controls.</p>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded-xl bg-pink-50/30">
                  <Check size={14} className="text-pink-400 shrink-0 mt-0.5" />
                  <p><strong>Safe Deletion Requests:</strong> You can submit clean deletion requests inside your danger panel to wipe cached records.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-2xl transition-colors shadow-soft"
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LANGUAGE MODAL */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-orange-100 relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4 border border-orange-100/30">
                  <Globe size={24} />
                </div>
                
                <h4 className="font-poppins font-bold text-lg text-[#2d1b45] mb-2">
                  Active Language
                </h4>
                
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  English (India) is currently selected. More languages coming soon.
                </p>

                <button 
                  onClick={() => setShowLanguageModal(false)}
                  className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs rounded-2xl transition-colors shadow-soft"
                >
                  Confirm Language
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default AccountSettings
