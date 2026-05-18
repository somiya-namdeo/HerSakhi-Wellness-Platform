import { ShieldAlert, Activity, Heart, Eye, Thermometer, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const SafetyResources = () => {
  const guidelines = [
    {
      title: "Heavy Bleeding",
      warningSign: "Soaking more than 1 sanitary pad/tampon per hour for 2+ consecutive hours, or passing large blood clots.",
      action: "Lie down, elevate your feet, apply gentle lower abdomen pressure, and keep count of pads used. Seek immediate medical attention.",
      helpline: "Ambulance (108)",
      helplineNum: "108",
      icon: Activity,
      color: "border-red-100 bg-red-50 text-red-500",
      btnColor: "bg-red-500 hover:bg-red-600 text-white"
    },
    {
      title: "Severe Pain or Fainting",
      warningSign: "Sudden, debilitating abdominal/pelvic pain, severe dizziness, lightheadedness, or sudden loss of consciousness.",
      action: "Lie down on your side, ensure fresh air flow, loosen tight clothing. Do not give food/drink if semi-conscious.",
      helpline: "Emergency Services (112)",
      helplineNum: "112",
      icon: ShieldAlert,
      color: "border-amber-100 bg-amber-50 text-amber-500",
      btnColor: "bg-amber-500 hover:bg-amber-600 text-white"
    },
    {
      title: "Mental Health Crisis",
      warningSign: "Extreme panic attacks, overwhelming anxiety, severe depressive episodes, or thoughts of self-harm.",
      action: "Try slow, deep breathing (inhale 4s, hold 7s, exhale 8s). Connect immediately with a certified counselor or trusted support system.",
      helpline: "Health Helpline (104)",
      helplineNum: "104",
      icon: Heart,
      color: "border-pink-100 bg-pink-50 text-pink-500",
      btnColor: "bg-pink-500 hover:bg-pink-600 text-white"
    },
    {
      title: "Unsafe Situation",
      warningSign: "Facing physical safety threats, stalking, domestic abuse, harassment, or feeling unsafe in your surroundings.",
      action: "Go to a well-lit public area or lock yourself in a secure room. Immediately share your live location with your personal emergency contacts.",
      helpline: "Women Helpline (181 / 1091)",
      helplineNum: "181",
      icon: Eye,
      color: "border-indigo-100 bg-indigo-50 text-indigo-500",
      btnColor: "bg-indigo-500 hover:bg-indigo-600 text-white"
    },
    {
      title: "High Fever & Infection",
      warningSign: "Persistent body temperature above 39.4°C (103°F), severe body pain, foul-smelling discharge, or extreme lethargy.",
      action: "Use room-temperature wet cloth sponge baths to bring down fever, sip fluids to stay hydrated, and consult a doctor immediately.",
      helpline: "Health Helpline (104)",
      helplineNum: "104",
      icon: Thermometer,
      color: "border-sky-100 bg-sky-50 text-sky-500",
      btnColor: "bg-sky-500 hover:bg-sky-600 text-white"
    }
  ]

  const handleCall = (e, name, number) => {
    if (!window.confirm(`Are you sure you want to call the ${name} (${number})?`)) {
      e.preventDefault()
    }
  }

  return (
    <div className="mb-10">
      <h3 className="text-xl font-poppins font-semibold text-[#2d1b45] mb-6">Emergency Health & Safety Guidelines</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guidelines.map((guide, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-pink-100/30 flex flex-col justify-between"
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl ${guide.color} flex items-center justify-center mb-4`}>
                <guide.icon size={22} />
              </div>
              
              <h4 className="font-poppins font-semibold text-[#2d1b45] text-base mb-3">{guide.title}</h4>
              
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-0.5">
                    Warning Signs:
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed min-h-[40px]">
                    {guide.warningSign}
                  </p>
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-wider block mb-0.5">
                    Recommended Action:
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                    {guide.action}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-auto">
              <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                Suggested Hotline:
              </span>
              <p className="text-sm font-semibold text-[#2d1b45] mb-3">
                {guide.helpline}
              </p>
              <a 
                href={`tel:${guide.helplineNum}`}
                onClick={(e) => handleCall(e, guide.helpline, guide.helplineNum)}
                className="w-full py-2.5 rounded-2xl bg-[#fff7fb] hover:bg-[#a78bfa] text-[#a78bfa] hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#a78bfa]/20 transition-all duration-300"
              >
                <Phone size={12} />
                Call Hotline
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SafetyResources
