import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Chrome } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isValid = email.trim() !== '' && password.trim() !== ''

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="font-poppins text-3xl font-bold text-dark mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm">Continue your wellness journey</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Forgot password?
          </Link>
        </div>

        <button 
          type="submit" 
          disabled={!isValid}
          className={`w-full font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 ${
            isValid 
              ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-soft transform hover:-translate-y-0.5' 
              : 'bg-primary/50 text-white cursor-not-allowed'
          }`}
        >
          Sign In
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        <button type="button" className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2">
          <Chrome size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
