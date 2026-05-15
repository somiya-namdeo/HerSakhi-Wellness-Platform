import { Calendar, Bot, Activity, TrendingUp, Bell, Shield } from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Smart Period Tracking',
    description: 'Accurately track your menstrual cycle, predict periods, and understand your fertility window.',
  },
  {
    icon: Bot,
    title: 'AI Wellness Chatbot',
    description: 'Get instant answers to your health questions from our compassionate AI assistant.',
  },
  {
    icon: Activity,
    title: 'Mood & Symptom Insights',
    description: 'Track mood patterns and symptoms to understand your body better.',
  },
  {
    icon: TrendingUp,
    title: 'Personalized Health Guidance',
    description: 'Receive tailored wellness recommendations based on your unique cycle.',
  },
  {
    icon: Bell,
    title: 'Wellness Reminders',
    description: 'Never miss important moments with smart notifications and reminders.',
  },
  {
    icon: Shield,
    title: 'Privacy & Safety',
    description: 'Your data is encrypted and secure. Complete privacy guaranteed.',
  },
];

const Features = () => {
  return (
    <section className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Everything you need for <span className="text-primary">wellness</span>
          </h2>
          <p className="text-lg text-gray-600">Comprehensive tools designed for modern women</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-card border border-primary/5 hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
