import { Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-background pt-20 pb-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-primary/10 pb-16">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-tr from-primary to-softPink p-2 rounded-xl text-white shadow-soft">
                <Heart size={24} fill="currentColor" strokeWidth={0} />
              </div>
              <span className="font-poppins font-bold text-2xl text-dark">HerSakhi</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-xs">
              For every phase of womanhood.<br/>
              Empowering women with AI-powered wellness support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="font-semibold text-dark mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-semibold text-dark mb-6">Contact</h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
              For collaboration, feedback, or project-related queries, feel free to reach out.
            </p>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm border border-primary/5">
                <Mail size={20} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</span>
                <a 
                  href="mailto:namdeosomiya@gmail.com" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium text-sm sm:text-base hover:underline"
                >
                  namdeosomiya@gmail.com
                </a>
              </div>
            </div>
          </div>
          
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} HerSakhi. All rights reserved. Made with love for women's wellness.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
