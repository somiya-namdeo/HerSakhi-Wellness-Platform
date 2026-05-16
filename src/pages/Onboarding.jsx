import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, ChevronRight, ChevronLeft, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react'
import { saveOnboardingData } from '../api/userApi'
import { getUser } from '../api/api'

const SYMPTOMS_LIST = [
  'Cramps', 'Headaches', 'Mood Swings', 'Bloating',
  'Fatigue', 'Back Pain', 'Acne', 'Tender Breasts'
]

const Onboarding = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    lastPeriod: '',
    cycleLength: '',
    symptoms: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleSymptom = (symptom) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(symptom)
      if (exists) {
        return { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) }
      } else {
        return { ...prev, symptoms: [...prev.symptoms, symptom] }
      }
    })
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    setLoading(true)
    setError('')

    try {
      // Retrieve the authenticated user stored after registration
      const user = getUser()

      if (!user?.id) {
        throw new Error('User session not found. Please register or log in again.')
      }

      // Build the payload matching the backend OnboardingRequest schema
      await saveOnboardingData({
        user_id:              user.id,
        age:                  formData.age    ? Number(formData.age)         : null,
        last_period_date:     formData.lastPeriod  || null,
        average_cycle_length: formData.cycleLength ? Number(formData.cycleLength) : null,
        common_symptoms:      formData.symptoms,
      })

      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to save your data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = (step / 5) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6 relative">
      {/* Back to Home */}
      <Link to="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors z-50">
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <Link to="/" className="flex items-center gap-2 mb-12 hover:opacity-90 transition-opacity">
        <div className="bg-gradient-to-br from-primary to-softPink p-2 rounded-xl text-white shadow-soft">
          <Heart size={28} fill="currentColor" strokeWidth={0} />
        </div>
        <span className="font-poppins font-bold text-3xl text-dark tracking-tight">
          HerSakhi
        </span>
      </Link>

      {/* Main Container */}
      <div className="w-full max-w-2xl transition-all duration-500 ease-in-out">
        {/* Progress Bar */}
        <div className="mb-8 px-2">
          <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
            <span>Step {step} of 5</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-sm">
            <div 
              className="h-full bg-gradient-to-r from-primary to-softPink rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-card border border-primary/5 min-h-[420px] flex flex-col relative">
          
          {/* Step 1 */}
          {step === 1 && (
            <div className="flex flex-col h-full animate-slide-in">
              <div className="mb-10">
                <h2 className="text-3xl font-poppins font-bold text-dark mb-3">What's your name?</h2>
                <p className="text-gray-500">Let's personalize your experience</p>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700"
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/register')}
                  className="w-full border border-primary/30 text-primary hover:bg-primary/5 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.name.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="flex flex-col h-full animate-slide-in">
              <div className="mb-10">
                <h2 className="text-3xl font-poppins font-bold text-dark mb-3">How old are you?</h2>
                <p className="text-gray-500">This helps us provide better insights</p>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => updateForm('age', e.target.value)}
                  placeholder="Enter your age" 
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700"
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleBack}
                  className="w-full border border-primary/30 text-primary hover:bg-primary/5 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.age}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="flex flex-col h-full animate-slide-in">
              <div className="mb-10">
                <h2 className="text-3xl font-poppins font-bold text-dark mb-3">Period tracking</h2>
                <p className="text-gray-500">Help us understand your cycle</p>
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When was your last period?</label>
                  <input 
                    type="date" 
                    value={formData.lastPeriod}
                    onChange={(e) => updateForm('lastPeriod', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Average cycle length (days)</label>
                  <input 
                    type="number" 
                    value={formData.cycleLength}
                    onChange={(e) => updateForm('cycleLength', e.target.value)}
                    placeholder="28" 
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700"
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleBack}
                  className="w-full border border-primary/30 text-primary hover:bg-primary/5 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!formData.lastPeriod || !formData.cycleLength}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="flex flex-col h-full animate-slide-in">
              <div className="mb-8">
                <h2 className="text-3xl font-poppins font-bold text-dark mb-3">Common symptoms?</h2>
                <p className="text-gray-500">Select all that apply</p>
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  {SYMPTOMS_LIST.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`p-4 rounded-xl border text-sm font-medium transition-all duration-200 text-center ${
                        formData.symptoms.includes(symptom) 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-gray-200 hover:border-primary/40 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleBack}
                  className="w-full border border-primary/30 text-primary hover:bg-primary/5 font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button 
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3.5 rounded-xl shadow-soft transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 5 - Completion */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center h-full animate-zoom-in text-center py-10">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary to-softPink rounded-full flex items-center justify-center text-white mb-8 shadow-card transform hover:scale-105 transition-transform duration-500">
                <CheckCircle2 size={48} />
              </div>
              
              <h2 className="text-4xl font-poppins font-bold text-dark mb-4">You're all set!</h2>
              <p className="text-lg text-gray-500 mb-10 max-w-md">
                Your personalized wellness dashboard is ready based on your profile.
              </p>

              {/* Error message */}
              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-6 max-w-sm">
                  {error}
                </p>
              )}

              <button 
                onClick={handleComplete}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 disabled:opacity-70 text-white font-medium px-10 py-4 rounded-2xl shadow-soft transition-all transform hover:-translate-y-1 w-full sm:w-auto text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving your profile…
                  </>
                ) : (
                  'Go to Dashboard'
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Onboarding
