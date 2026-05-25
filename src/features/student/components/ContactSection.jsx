/**
 * ContactSection.jsx
 * Contact section component with contact information, contact form, and social media links.
 * Features scroll-triggered animations and form submission handling.
 * 
 * @module features/student/components/ContactSection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiCheckCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from 'react-icons/hi';
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaGithub,
} from 'react-icons/fa';

// ============================================================================
// Constants
// ============================================================================

/** Contact information items */
const CONTACT_ITEMS = [
  {
    icon: HiOutlineMail,
    label: 'Email',
    value: 'support@looplearn.com',
    href: 'mailto:support@looplearn.com',
    color: '#534AB7',
  },
  {
    icon: HiOutlinePhone,
    label: 'Phone',
    value: '+20 100 000 0000',
    href: 'tel:+201000000000',
    color: '#1D9E75',
  },
  {
    icon: HiOutlineLocationMarker,
    label: 'Location',
    value: 'Cairo, Egypt',
    href: 'https://maps.google.com/?q=Cairo,Egypt',
    color: '#B45309',
  },
];

/** Social media links configuration */
const SOCIAL_LINKS = [
  {
    icon: FaFacebook,
    label: 'Facebook',
    href: 'https://facebook.com/looplearn',
    color: '#1877F2',
    bgColor: '#1877F210',
  },
  {
    icon: FaTwitter,
    label: 'Twitter',
    href: 'https://twitter.com/looplearn',
    color: '#1DA1F2',
    bgColor: '#1DA1F210',
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/looplearn',
    color: '#0077B5',
    bgColor: '#0077B510',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://instagram.com/looplearn',
    color: '#E4405F',
    bgColor: '#E4405F10',
  },
  {
    icon: FaYoutube,
    label: 'YouTube',
    href: 'https://youtube.com/@looplearn',
    color: '#FF0000',
    bgColor: '#FF000010',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/looplearn',
    color: '#333333',
    bgColor: '#33333310',
  },
];

/** Form field configurations */
const FORM_FIELDS = [
  {
    name: 'name',
    label: 'Your Name',
    type: 'text',
    placeholder: 'Ahmed Hassan',
    required: true,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'ahmed@example.com',
    required: true,
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'How can we help you?',
    rows: 4,
    required: true,
  },
];

/** Intersection Observer configuration */
const OBSERVER_CONFIG = {
  threshold: 0.1,
  rootMargin: '0px',
};

/** Animation variants */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Social media link component
 */
const SocialLink = ({ icon: Icon, label, href, color, bgColor }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className='social-link flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:-translate-y-1'
    style={{ 
      background: bgColor,
      color: color,
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    aria-label={label}
    title={label}
  >
    <Icon size={18} />
  </motion.a>
);

/**
 * Contact card component
 */
const ContactCard = ({ icon: Icon, label, value, href, color, index }) => (
  <motion.a
    href={href}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
    className='contact-card flex items-center gap-4 p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group'
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ x: 5 }}
  >
    <div 
      className='w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110'
      style={{ background: `${color}15`, color: color }}
    >
      <Icon size={20} />
    </div>
    <div className='text-left'>
      <p className='text-xs uppercase tracking-wide mb-0.5 text-gray-500'>{label}</p>
      <p className='text-sm font-medium text-gray-800'>{value}</p>
    </div>
  </motion.a>
);

/**
 * Quick response card component
 */
const QuickResponseCard = () => (
  <motion.div
    className='p-5 rounded-2xl text-left bg-gradient-to-r from-purple-50 to-white border border-purple-100'
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.3 }}
    viewport={{ once: true }}
  >
    <p className='text-sm font-semibold mb-1 text-purple-700'>✨ Quick response guaranteed</p>
    <p className='text-xs text-gray-600'>We typically respond within 24 hours on business days.</p>
  </motion.div>
);

/**
 * Social Links component
 */
const SocialLinks = () => (
  <motion.div
    className='mt-4 pt-4 border-t border-gray-100'
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.4, delay: 0.4 }}
    viewport={{ once: true }}
  >
    <p className='text-xs font-medium text-gray-500 mb-3 text-center sm:text-left'>
      Follow us on social media
    </p>
    <div className='flex justify-center sm:justify-start gap-3 flex-wrap'>
      {SOCIAL_LINKS.map((social) => (
        <SocialLink key={social.label} {...social} />
      ))}
    </div>
  </motion.div>
);

/**
 * Success message component
 */
const SuccessMessage = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className='flex flex-col items-center justify-center h-full gap-4 py-10'
  >
    <div className='w-14 h-14 rounded-full flex items-center justify-center bg-green-100'>
      <HiCheckCircle size={28} className='text-green-600' />
    </div>
    <h3 className='text-lg font-semibold text-gray-800'>Message sent! 🎉</h3>
    <p className='text-sm text-gray-500 text-center max-w-xs'>
      Thanks for reaching out. We'll get back to you within 24 hours.
    </p>
  </motion.div>
);

/**
 * Form input component
 */
const FormInput = ({ field, value, onChange, loading }) => {
  const baseClassName = 'contact-input w-full rounded-xl text-sm outline-none transition-all duration-200 border border-gray-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100'
  const style = { padding: '12px 16px' };

  if (field.type === 'textarea') {
    return (
      <textarea
        name={field.name}
        value={value}
        onChange={onChange}
        placeholder={field.placeholder}
        rows={field.rows}
        className={baseClassName}
        style={{ ...style, resize: 'none' }}
        disabled={loading}
        required={field.required}
      />
    );
  }

  return (
    <input
      type={field.type}
      name={field.name}
      value={value}
      onChange={onChange}
      placeholder={field.placeholder}
      className={baseClassName}
      style={style}
      disabled={loading}
      required={field.required}
    />
  );
};

/**
 * Contact form component
 */
const ContactForm = ({ form, onChange, onSubmit, loading, submitted }) => {
  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-5'>
      {FORM_FIELDS.map((field) => (
        <div key={field.name}>
          <label className='block text-xs font-semibold uppercase tracking-wide mb-2 text-gray-600'>
            {field.label} {field.required && '*'}
          </label>
          <FormInput
            field={field}
            value={form[field.name]}
            onChange={onChange}
            loading={loading}
          />
        </div>
      ))}
      
      <motion.button
        type='submit'
        disabled={loading}
        className='w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-lg disabled:opacity-50'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {loading ? (
          <span className='flex items-center justify-center gap-2'>
            <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message →'
        )}
      </motion.button>
    </form>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * ContactSection - Contact section with form and contact info
 * @returns {React.ReactElement} Contact section
 */
const ContactSection = () => {
  const sectionRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      OBSERVER_CONFIG
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  /**
   * Handles form input changes
   */
  const handleChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) return;
    
    setLoading(true);
    
    // Simulate API call - Replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  }, [form]);

  return (
    <section
      id='contact'
      ref={sectionRef}
      className='fade-up w-full px-6 md:px-16 lg:px-32 py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50'
    >
      {/* CSS Animations */}
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), 
                      transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .contact-card {
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        
        .contact-input {
          transition: all 0.2s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .contact-input:focus {
          border-color: #534AB7;
          box-shadow: 0 0 0 3px rgba(83, 74, 183, 0.1);
        }
        .contact-input::placeholder {
          color: #B4B2A9;
        }
        
        .social-link {
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
      `}</style>

      {/* Section Header */}
      <div className='text-center mb-12 md:mb-16'>
        <span className='inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 bg-purple-100 text-purple-700'>
          Get In Touch
        </span>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>
          We'd Love to Hear From You
        </h2>
        <p className='text-gray-500 max-w-xl mx-auto text-base leading-relaxed'>
          Have a question or feedback? Drop us a message and we'll get back to you within 24 hours.
        </p>
      </div>

      {/* Contact Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
        {/* Left Column - Contact Info */}
        <div className='flex flex-col gap-4'>
          {CONTACT_ITEMS.map((item, index) => (
            <ContactCard key={item.label} {...item} index={index} />
          ))}
          
          <QuickResponseCard />
          <SocialLinks />
        </div>

        {/* Right Column - Contact Form */}
        <motion.div
          className='rounded-2xl bg-white shadow-lg p-6 md:p-8'
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <ContactForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            loading={loading}
            submitted={submitted}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;