import { AlertCircle } from 'lucide-react'

const EmergencyHero = () => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 shadow-sm">
        <AlertCircle size={28} />
      </div>
      <div>
        <h2 className="text-2xl font-poppins font-bold text-dark">Emergency & Safety</h2>
        <p className="text-gray-500">Quick access to help when you need it</p>
      </div>
    </div>
  )
}

export default EmergencyHero
