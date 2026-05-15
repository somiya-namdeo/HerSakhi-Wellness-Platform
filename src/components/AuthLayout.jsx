import { Heart, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex relative">
      <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors z-50">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Left Branding - Hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center max-w-2xl mx-auto">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <div className="bg-primary/20 p-2 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary/50 text-white">
            <Heart size={24} fill="currentColor" strokeWidth={0} />
          </div>
          <span className="font-poppins font-semibold text-2xl text-dark tracking-tight">
            HerSakhi
          </span>
        </Link>
        
        <h1 className="font-poppins text-5xl md:text-6xl font-bold leading-[1.15] text-dark mb-6">
          Your wellness journey <br/>
          <span className="text-primary">starts here</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">
          Join thousands of women taking control of their health with AI-powered insights and compassionate support.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2.5 rounded-full text-primary">
              <Heart size={18} />
            </div>
            <span className="text-gray-700 font-medium">Track your cycle with precision</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-softPink/10 p-2.5 rounded-full text-softPink">
              <Heart size={18} />
            </div>
            <span className="text-gray-700 font-medium">Get personalized AI guidance</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-peach/10 p-2.5 rounded-full text-peach">
              <Heart size={18} />
            </div>
            <span className="text-gray-700 font-medium">Understand your body better</span>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-card border border-primary/5">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
