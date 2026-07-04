// PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <Link to='/' className='inline-flex items-center text-purple-400 hover:text-purple-300 transition mb-8'>
          ← Back to Home
        </Link>

        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Privacy Policy</h1>
        <p className='text-gray-400 mb-8'>Last updated: July 4, 2026</p>

        <div className='space-y-8'>
          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>1. Information We Collect</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              LoopLearn collects information to provide better services to our users. We collect:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Personal information (name, email address, phone number)</li>
              <li>Account credentials (username and password)</li>
              <li>Course enrollment and progress data</li>
              <li>Payment information (processed securely through third-party services)</li>
              <li>Usage data and analytics</li>
              <li>Device information and IP addresses</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>2. How We Use Your Information</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              We use your information to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Provide, maintain, and improve our services</li>
              <li>Process your course enrollments and payments</li>
              <li>Send you course updates and promotional materials</li>
              <li>Personalize your learning experience</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage trends</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>3. Information Sharing</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              We do not sell your personal information. We may share information:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>With service providers who assist in our operations</li>
              <li>To comply with legal obligations</li>
              <li>To protect the security of our platform</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>4. Data Security</h2>
            <p className='text-gray-300 leading-relaxed'>
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>5. Your Rights</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              You have the right to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Access and view your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>6. Cookies</h2>
            <p className='text-gray-300 leading-relaxed'>
              We use cookies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>7. Contact Us</h2>
            <p className='text-gray-300 leading-relaxed'>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className='mt-3 text-gray-300'>
              <p>Email: <a href='mailto:privacy@looplearn.com' className='text-purple-400 hover:text-purple-300 transition'>privacy@looplearn.com</a></p>
              <p>Address: 123 Learning Street, Education City, ED 12345</p>
            </div>
          </section>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-700'>
          <p className='text-gray-400 text-sm text-center'>
            © 2024 LoopLearn. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;