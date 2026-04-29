import { useEffect, useRef, useState } from "react";

const contactItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "support@looplearn.com",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 5.5 5.5l.91-.91a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7a2 2 0 0 1 1.76 2.17z" />
      </svg>
    ),
    label: "Phone",
    value: "+20 100 000 0000",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Location",
    value: "Cairo, Egypt",
  },
];

const ContactSection = () => {
  const itemsRef = useRef([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1 }
    );
    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate API call — wire to real endpoint when ready
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="w-full px-8 md:px-16 lg:px-40 py-20"
      style={{ background: "#FAFAFA" }}
    >
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-up.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .stagger-1 { transition-delay: 0.05s; }
        .stagger-2 { transition-delay: 0.1s; }
        .stagger-3 { transition-delay: 0.15s; }
        .stagger-4 { transition-delay: 0.2s; }
        .contact-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: border 0.15s;
          border: 0.5px solid rgba(0,0,0,0.12);
          background: white;
          color: #2C2C2A;
        }
        .contact-input:focus {
          border: 1px solid #534AB7;
          box-shadow: 0 0 0 3px #EEEDFE;
        }
        .contact-input::placeholder { color: #B4B2A9; }
      `}</style>

      {/* Header */}
      <div
        className="fade-up text-center mb-14"
        ref={(el) => (itemsRef.current[0] = el)}
      >
        <span
          className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4 uppercase tracking-widest"
          style={{ background: "#EEEDFE", color: "#534AB7" }}
        >
          Contact Us
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          We'd Love to Hear From You
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-base">
          Have a question or feedback? Drop us a message and we'll get back to you shortly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">

        {/* Left — contact info */}
        <div className="flex flex-col gap-5">
          {contactItems.map((item, i) => (
            <div
              key={item.label}
              className={`fade-up stagger-${i + 1} flex items-center gap-4 p-4 rounded-2xl`}
              ref={(el) => (itemsRef.current[i + 1] = el)}
              style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#EEEDFE", color: "#534AB7" }}
              >
                {item.icon}
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: "#888780" }}>
                  {item.label}
                </p>
                <p className="text-sm font-medium" style={{ color: "#2C2C2A" }}>
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          {/* Response time note */}
          <div
            className={`fade-up stagger-4 p-4 rounded-2xl text-left`}
            ref={(el) => (itemsRef.current[4] = el)}
            style={{ background: "#EEEDFE", border: "0.5px solid #AFA9EC" }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: "#534AB7" }}>
              Quick response guaranteed
            </p>
            <p className="text-xs" style={{ color: "#5F5E5A" }}>
              We typically respond within 24 hours on business days.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div
          className="fade-up stagger-2 rounded-2xl p-6"
          ref={(el) => (itemsRef.current[5] = el)}
          style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "#EAF3DE" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="#3B6D11" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Message sent!</h3>
              <p className="text-sm text-gray-500 text-center">
                Thanks for reaching out. We'll get back to you soon.
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
                className="text-sm mt-2 px-4 py-2 rounded-full transition"
                style={{ border: "0.5px solid #534AB7", color: "#534AB7" }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: "#888780" }}>
                  Your Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ahmed Hassan"
                  className="contact-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: "#888780" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ahmed@example.com"
                  className="contact-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wide mb-1.5"
                  style={{ color: "#888780" }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={4}
                  className="contact-input"
                  style={{ resize: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                style={{ background: "#534AB7" }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
