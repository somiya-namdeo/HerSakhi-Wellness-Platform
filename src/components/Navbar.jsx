import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import logo from "../assets/hersakhi-logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full bg-background px-6 py-4 lg:px-12 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img 
            src={logo} 
            alt="HerSakhi Logo" 
            className="w-10 h-10 object-contain shrink-0" 
          />
          <span className="font-poppins font-semibold text-xl text-dark tracking-tight">
            HerSakhi
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#home" className="hover:text-primary transition-colors">Home</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
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
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-dark focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-primary/10 px-6 py-6 flex flex-col gap-6 shadow-card z-40 animate-slide-in">
          <div className="flex flex-col gap-4 text-base font-medium text-gray-600">
            <a 
              href="#home" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-primary transition-colors py-1"
            >
              Home
            </a>
            <a 
              href="#features" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-primary transition-colors py-1"
            >
              Features
            </a>
            <a 
              href="#about" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-primary transition-colors py-1"
            >
              About
            </a>
            <a 
              href="#contact" 
              onClick={() => setIsOpen(false)} 
              className="hover:text-primary transition-colors py-1"
            >
              Contact
            </a>
          </div>
          
          <div className="h-px bg-primary/5 my-1"></div>
          
          <div className="flex flex-col gap-4">
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="text-center font-medium text-primary hover:text-primary/80 transition-colors py-2"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              onClick={() => setIsOpen(false)} 
              className="bg-primary hover:bg-primary/90 text-white text-center font-medium px-5 py-3 rounded-2xl transition-all shadow-sm inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
