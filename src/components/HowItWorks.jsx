const steps = [
  {
    number: '01',
    title: 'Track your cycle',
    description: 'Log your dates to get accurate predictions and understand your unique rhythm.',
  },
  {
    number: '02',
    title: 'Log mood & symptoms',
    description: 'Keep track of how you feel every day to identify personal patterns.',
  },
  {
    number: '03',
    title: 'Get AI-powered insights',
    description: 'Receive tailored advice and emotional support from your AI wellness companion.',
  }
];

const HowItWorks = () => {
  return (
    <section id="about" className="py-20 px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            How <span className="text-primary">HerSakhi Works</span>
          </h2>
          <p className="text-lg text-gray-600">Simple steps to understand your body better</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-background p-8 rounded-3xl text-center group hover:-translate-y-1 transition-transform duration-300 shadow-soft border border-primary/5">
              <div className="text-5xl font-bold text-primary/20 mb-6 group-hover:text-primary transition-colors duration-300">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-dark mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
