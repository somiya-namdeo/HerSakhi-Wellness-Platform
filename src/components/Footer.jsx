import { Heart, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-10 px-6 lg:px-12">
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
          <div>
            <h4 className="font-semibold text-dark mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-dark mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-dark mb-6">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="#" className="bg-white text-primary p-2.5 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all border border-primary/5">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-white text-primary p-2.5 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all border border-primary/5">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white text-primary p-2.5 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all border border-primary/5">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white text-primary p-2.5 rounded-full shadow-sm hover:bg-primary hover:text-white transition-all border border-primary/5">
                <Mail size={18} />
              </a>
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
