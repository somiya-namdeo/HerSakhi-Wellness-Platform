import { Heart, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="w-full bg-background px-6 py-4 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary/50 text-white">
            <Heart size={20} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="font-poppins font-semibold text-xl text-dark tracking-tight">
            HerSakhi
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-primary transition-colors">Home</a>
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Login
          </Link>
          <Link to="/register" className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow-soft inline-flex">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-dark">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
