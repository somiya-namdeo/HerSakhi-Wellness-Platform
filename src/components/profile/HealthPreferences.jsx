import { getStoredUser } from '../../utils/userHelpers'

const HealthPreferences = ({ onboardingData }) => {
  const user = getStoredUser()

  const cycleLength = user?.cycle_length || onboardingData?.average_cycle_length || 28
  const periodDuration = user?.period_duration || 5
  
  const preferences = [
    { 
      label: "Average Cycle Length", 
      value: `${cycleLength} days` 
    },
    { 
      label: "Period Duration", 
      value: `${periodDuration} days` 
    }
  ]

  const goals = user?.wellness_goals && user.wellness_goals.length > 0 
    ? user.wellness_goals 
    : (onboardingData?.common_symptoms?.length > 0 
      ? ["Track Period", ...onboardingData.common_symptoms.slice(0, 3), "Improve Wellness"]
      : ["Track Period", "Manage Symptoms", "Improve Wellness", "Mental Health"])

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-card border border-primary/5 mb-8">
      <h3 className="font-poppins font-semibold text-xl text-dark mb-6">Health Preferences & Goals</h3>

      <div className="space-y-4 mb-8">
        {preferences.map((pref, index) => (
          <div key={index} className="flex justify-between items-center bg-pink-50/50 rounded-2xl p-5 border border-pink-100/50">
            <span className="font-medium text-gray-700 text-sm">{pref.label}</span>
            <span className="text-primary font-bold text-sm">{pref.value}</span>
          </div>
        ))}
      </div>

      <div>
        <h4 className="font-medium text-gray-700 text-sm mb-4">Wellness Goals</h4>
        <div className="flex flex-wrap gap-2">
          {goals.map((goal, index) => (
            <span key={index} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold capitalize">
              {goal.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HealthPreferences
