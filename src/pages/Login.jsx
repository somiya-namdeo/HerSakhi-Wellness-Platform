import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Chrome, Loader2, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { loginUser } from '../api/authApi'
import { saveToken, saveUser } from '../api/api'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isValid = email.trim() !== '' && password.trim() !== ''

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError('');

    try {
      const data = await loginUser({ email: email.trim(), password });

      // Persist auth state
      saveToken(data.access_token);
      saveUser(data.user);

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h2 className="font-poppins text-3xl font-bold text-dark mb-2">Welcome back</h2>
        <p className="text-gray-500 text-sm">Continue your wellness journey</p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
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
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#8b5cf6] transition-colors focus:outline-none"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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

        {/* Error message — only rendered when there is an error */}
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button 
          type="submit" 
          disabled={!isValid || loading}
          className={`w-full font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 ${
            isValid && !loading
              ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-soft transform hover:-translate-y-0.5' 
              : 'bg-primary/50 text-white cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
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
