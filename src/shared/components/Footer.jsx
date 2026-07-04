// src/shared/components/Footer.jsx (update the imports and links)

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube, 
  FaGithub,
  FaEnvelope,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';
import { ROUTES } from '../constants/routes'; // ADD THIS IMPORT

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToCourses = () => {
    navigate(ROUTES.COURSE_LIST);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // Send email using EmailJS or your preferred service
      const response = await fetch('YOUR_EMAIL_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subject: 'Newsletter Subscription',
          message: `New subscriber: ${email}`
        }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
        setTimeout(() => setIsSubscribed(false), 5000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      // Fallback: Open mail client
      window.location.href = `mailto:support@looplearn.com?subject=Newsletter Subscription&body=Please subscribe me to the newsletter. My email: ${email}`;
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com/looplearn', label: 'Facebook', color: '#1877F2' },
    { icon: FaTwitter, href: 'https://twitter.com/looplearn', label: 'Twitter', color: '#1DA1F2' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/looplearn', label: 'LinkedIn', color: '#0077B5' },
    { icon: FaInstagram, href: 'https://instagram.com/looplearn', label: 'Instagram', color: '#E4405F' },
    { icon: FaYoutube, href: 'https://youtube.com/@looplearn', label: 'YouTube', color: '#FF0000' },
    { icon: FaGithub, href: 'https://github.com/looplearn', label: 'GitHub', color: '#333333' },
  ];

  return (
    <footer className='bg-gray-900 w-full mt-auto'>
      {/* Main Footer Content */}
      <div className='max-w-7xl mx-auto px-6 md:px-10 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-8'>
          
          {/* Brand Column */}
          <div className='md:col-span-4 text-center md:text-left'>
            <Link to={ROUTES.HOME}>
              <h1 className='font-extrabold text-2xl md:text-3xl tracking-wide'>
                LOOP<span className='text-purple-500'>LEARN</span>
              </h1>
            </Link>
            <p className='mt-4 text-sm text-gray-400 leading-relaxed'>
              Empowering learners worldwide with expert-led courses and interactive content.
            </p>
            <p className='mt-4 text-sm text-gray-500'>Get in touch with us!</p>
            
            {/* Email Contact */}
            <div className='mt-4 flex items-center justify-center md:justify-start gap-2'>
              <FaEnvelope className='text-gray-500' size={14} />
              <a href='mailto:support@looplearn.com' className='text-sm text-gray-400 hover:text-purple-400 transition'>
                support@looplearn.com
              </a>
            </div>
          </div>

          {/* Company Links Column */}
          <div className='md:col-span-3 text-center md:text-left'>
            <h3 className='font-semibold text-white text-lg mb-4'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <Link to={ROUTES.HOME} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  Home
                </Link>
              </li>
              <li>
                <button onClick={() => scrollTo('about')} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('contact')} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={handleNavigateToCourses} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  All Courses
                </button>
              </li>
              <li>
                <Link to={ROUTES.PRIVACY_POLICY} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to={ROUTES.TERMS_OF_SERVICE} className='text-gray-400 hover:text-purple-400 transition text-sm'>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className='md:col-span-5'>
            <div className='text-center md:text-left'>
              <h3 className='font-semibold text-white text-lg mb-4'>Stay Updated</h3>
              <p className='text-sm text-gray-400 mb-4'>
                Subscribe to our newsletter for the latest courses and special offers.
              </p>
              <form onSubmit={handleSubscribe} className='flex flex-col sm:flex-row gap-3'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter your email address'
                  required
                  className='flex-1 px-4 py-2.5 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition'
                />
                <button 
                  type='submit'
                  disabled={isLoading || isSubscribed}
                  className='px-5 py-2.5 bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isLoading ? 'Sending...' : isSubscribed ? (
                    <>
                      Subscribed <FaCheckCircle size={14} />
                    </>
                  ) : (
                    <>
                      Subscribe
                      <FaArrowRight size={12} />
                    </>
                  )}
                </button>
              </form>
              {isSubscribed && (
                <p className='mt-2 text-sm text-green-400'>
                  ✓ Thanks for subscribing! We'll keep you updated.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className='border-t border-gray-800 mt-10 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex gap-4'>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group relative w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110'
                  aria-label={social.label}
                >
                  <social.icon 
                    size={18} 
                    className='text-gray-400 group-hover:text-white transition-colors duration-300'
                  />
                  <span className='absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className='flex gap-6 text-xs text-gray-500'>
              <span>© 2024 LoopLearn</span>
              <span>All rights reserved</span>
              <span>Made with ❤️ for learners</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;