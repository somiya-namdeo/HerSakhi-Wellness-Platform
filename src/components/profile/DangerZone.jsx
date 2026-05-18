import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { deleteAccount } from '../../api/authApi'

const DangerZone = ({ user }) => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [deleteInput, setDeleteInput] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const handleDeleteConfirm = async () => {
    setDeleteError('')

    if (deleteInput !== 'DELETE') {
      setDeleteError("You must type 'DELETE' exactly to confirm account removal.")
      return
    }

    if (!passwordInput.trim()) {
      setDeleteError("Password is required to confirm deletion.")
      return
    }

    if (!user || !user.id) {
      setDeleteError('User session not found. Please log in again.')
      return
    }

    try {
      await deleteAccount({
        user_id: user.id,
        password: passwordInput,
        confirmation_text: deleteInput
      })
      
      // Clear localStorage session
      localStorage.clear()
      
      alert("Account deleted successfully.")
      setShowDeleteModal(false)
      navigate('/register')
    } catch (err) {
      setDeleteError(err.message || 'Incorrect password. Failed to delete account.')
    }
  }

  const handleCloseDelete = () => {
    setPasswordInput('')
    setDeleteInput('')
    setDeleteError('')
    setShowDeleteModal(false)
  }

  const isDeleteEnabled = passwordInput.trim().length > 0 && deleteInput === 'DELETE'

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-red-100/50 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-[#2d1b45] mb-2">Danger Zone</h3>
      <p className="text-xs text-gray-500 mb-6">These operations are high-impact. Please review options carefully.</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-3 rounded-2xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-1.5"
        >
          <Trash2 size={14} />
          Delete Account
        </button>
      </div>

      {/* Stateful Password-Secured Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-[#2d1b45]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-red-100 relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 border border-red-100/30">
                  <AlertTriangle size={24} />
                </div>
                
                <h4 className="font-poppins font-bold text-lg text-[#2d1b45] mb-2">
                  Delete Account?
                </h4>
                
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  This action is irreversible. All of your cycle records, daily logs, predictions, and history will be permanently deleted.
                </p>

                {/* Password field */}
                <div className="w-full text-left mb-3">
                  <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Confirm Your Password</label>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#8b5cf6]"
                  />
                </div>

                {/* Typing DELETE field */}
                <div className="w-full text-left mb-4">
                  <label className="block text-[10px] font-bold text-red-500 mb-1 uppercase tracking-wider">Type 'DELETE' to confirm</label>
                  <input 
                    type="text" 
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-3 rounded-xl border border-red-200 text-xs font-semibold text-center focus:outline-none focus:border-red-400"
                  />
                </div>

                {deleteError && (
                  <div className="p-3 rounded-xl text-xs font-bold bg-red-50 text-red-500 border border-red-200/50 flex items-start gap-2 mb-3 w-full text-left">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 w-full mt-2">
                  <button 
                    onClick={handleDeleteConfirm}
                    disabled={!isDeleteEnabled}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-2xl transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Delete Permanently
                  </button>
                  <button 
                    onClick={handleCloseDelete}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold text-xs rounded-2xl transition-colors border border-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DangerZone
