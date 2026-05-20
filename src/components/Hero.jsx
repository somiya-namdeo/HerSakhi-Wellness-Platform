import { MessageCircle, Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-background px-6 pt-12 lg:px-12 lg:pt-20 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
        
        {/* Left Content */}
        <div className="flex-1 w-full max-w-2xl flex flex-col items-start z-10">
          <div className="bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            AI-Powered Wellness Platform
          </div>
          
          <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-dark mb-6">
            For every phase <br className="hidden md:block" />
            of <span className="text-primary">womanhood.</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            AI-powered wellness support designed to help women track cycles, understand their bodies, and improve wellbeing.
          </p>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Link to="/register" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3.5 rounded-2xl shadow-soft transition-all transform hover:-translate-y-0.5 inline-flex justify-center items-center">
              Start Tracking
            </Link>
            <Link to="/register" className="border-2 border-primary/20 text-primary hover:bg-primary/5 font-medium px-8 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2">
              <MessageCircle size={20} />
              Talk to AI
            </Link>
          </div>
        </div>

        {/* Right Content - Dashboard Preview */}
        <div className="flex-1 w-full relative z-10 flex justify-center lg:justify-end mt-8 lg:mt-0">
          {/* Decorative Background Blob */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/20 to-transparent rounded-[3rem] transform -rotate-3 scale-105 -z-10 blur-sm"></div>
          
          {/* Dashboard Card */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-card w-full max-w-md border border-white/40">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/20 p-2.5 rounded-full text-primary">
                <Heart size={24} fill="currentColor" strokeWidth={0} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium mb-0.5">Your Wellness Dashboard</p>
                <h3 className="font-semibold text-dark text-lg">Today's Overview</h3>
              </div>
            </div>

            {/* Data Rows */}
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="flex items-center justify-between bg-primary/5 p-4 rounded-2xl">
                <span className="text-sm font-medium text-gray-600">Next Period</span>
                <span className="text-sm font-semibold text-primary">in 5 days</span>
              </div>
              
              {/* Row 2 */}
              <div className="flex items-center justify-between bg-secondary/5 p-4 rounded-2xl">
                <span className="text-sm font-medium text-gray-600">Fertility Window</span>
                <span className="text-sm font-semibold text-secondary">Low</span>
              </div>
              
              {/* Row 3 */}
              <div className="flex items-center justify-between bg-accent/5 p-4 rounded-2xl">
                <span className="text-sm font-medium text-gray-600">Wellness Score</span>
                <span className="text-sm font-semibold text-accent">8.5/10</span>
              </div>
            </div>

            {/* Floating Sparkle Icon */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-soft">
              <Sparkles className="text-primary w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
