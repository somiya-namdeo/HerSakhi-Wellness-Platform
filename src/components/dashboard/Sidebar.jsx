import { Link, useLocation } from 'react-router-dom'
import { Heart, LayoutDashboard, Calendar as CalendarIcon, Sparkles, LineChart, BookOpen, HelpCircle, AlertCircle, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logoutUser } from '../../utils/userHelpers'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Period Tracker', path: '/tracker', icon: CalendarIcon },
  { name: 'AI Assistant', path: '/assistant', icon: Sparkles },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Health Tips', path: '/health-tips', icon: BookOpen },
  { name: 'Myth Busters', path: '/myth-busters', icon: HelpCircle },
  { name: 'Emergency', path: '/emergency', icon: AlertCircle },
  { name: 'Profile', path: '/profile', icon: User },
]

const Sidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-primary/5 px-6 py-8">
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
        <div className="bg-gradient-to-br from-primary to-softPink p-2 rounded-xl text-white shadow-soft">
          <Heart size={28} fill="currentColor" strokeWidth={0} />
        </div>
        <span className="font-poppins font-bold text-2xl text-dark tracking-tight">
          HerSakhi
        </span>
      </Link>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.name === 'Dashboard' && location.pathname === '/dashboard')
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-primary to-softPink text-white shadow-md' 
                  : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-white' : ''} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-primary/5">
        <button 
          onClick={logoutUser}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 w-full text-left"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-5 left-5 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-xl shadow-md text-primary"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-dark/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-72 h-screen z-50 shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
