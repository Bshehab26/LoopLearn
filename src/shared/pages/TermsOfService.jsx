// TermsOfService.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white py-12 px-4'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <Link to='/' className='inline-flex items-center text-purple-400 hover:text-purple-300 transition mb-8'>
          ← Back to Home
        </Link>

        <h1 className='text-4xl md:text-5xl font-bold mb-4'>Terms of Service</h1>
        <p className='text-gray-400 mb-8'>Last updated: July 4, 2026</p>

        <div className='space-y-8'>
          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>1. Acceptance of Terms</h2>
            <p className='text-gray-300 leading-relaxed'>
              By using LoopLearn's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>2. Account Registration</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Provide accurate and complete information</li>
              <li>Keep your login credentials confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
              <li>Be at least 16 years old or have parental consent</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>3. Course Content and Access</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              LoopLearn provides educational content subject to the following conditions:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Course access is granted for personal, non-commercial use</li>
              <li>Course materials may not be redistributed or sold</li>
              <li>Lifetime access is subject to platform availability</li>
              <li>Certificates are awarded upon successful completion</li>
              <li>Course content may be updated or modified</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>4. Payment and Refunds</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              Payment and refund policies:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>All payments are processed securely</li>
              <li>Refunds are available within 30 days of purchase</li>
              <li>Refund requests must be submitted via support</li>
              <li>Partial refunds may be issued for unused portions</li>
              <li>Promotional discounts are subject to specific terms</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>5. User Conduct</h2>
            <p className='text-gray-300 leading-relaxed mb-3'>
              You agree to use our platform responsibly and not to:
            </p>
            <ul className='list-disc list-inside text-gray-300 space-y-2 ml-4'>
              <li>Harass, threaten, or harm other users</li>
              <li>Post inappropriate or offensive content</li>
              <li>Attempt to hack or disrupt the platform</li>
              <li>Share login credentials with others</li>
              <li>Use the platform for illegal activities</li>
              <li>Infringe on intellectual property rights</li>
            </ul>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>6. Intellectual Property</h2>
            <p className='text-gray-300 leading-relaxed'>
              All content on LoopLearn, including courses, videos, text, and graphics, is protected by copyright and intellectual property laws. You may not copy, modify, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>7. Termination</h2>
            <p className='text-gray-300 leading-relaxed'>
              We reserve the right to suspend or terminate accounts that violate these terms, with or without notice. You may also terminate your account at any time by contacting support.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>8. Disclaimer of Warranties</h2>
            <p className='text-gray-300 leading-relaxed'>
              LoopLearn provides services "as is" without warranties of any kind. We do not guarantee that the platform will be error-free or uninterrupted. Learning outcomes may vary based on individual effort and circumstances.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>9. Limitation of Liability</h2>
            <p className='text-gray-300 leading-relaxed'>
              LoopLearn shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our liability is limited to the amount paid for specific courses, if applicable.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>10. Changes to Terms</h2>
            <p className='text-gray-300 leading-relaxed'>
              We may update these terms from time to time. Continued use of our platform after changes constitutes acceptance of the new terms. Significant changes will be communicated via email or platform notification.
            </p>
          </section>

          <section className='bg-gray-800/50 rounded-xl p-6 border border-gray-700'>
            <h2 className='text-2xl font-semibold mb-4 text-purple-400'>11. Contact Information</h2>
            <p className='text-gray-300 leading-relaxed'>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className='mt-3 text-gray-300'>
              <p>Email: <a href='mailto:legal@looplearn.com' className='text-purple-400 hover:text-purple-300 transition'>legal@looplearn.com</a></p>
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

export default TermsOfService;