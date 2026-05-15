import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6 leading-tight">
          Ready to start your <span className="text-primary">wellness<br className="hidden sm:block"/> journey?</span>
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
          Join HerSakhi today and take control of your health
        </p>
        <Link to="/register" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3.5 rounded-2xl shadow-soft transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 text-lg">
          Get Started Free
          <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  );
};

export default CTA;
