import { useEffect, useRef } from "react";

const stats = [
  { value: "50K+", label: "Active Learners" },
  { value: "500+", label: "Expert Courses" },
  { value: "120+", label: "Instructors" },
  { value: "95%", label: "Satisfaction Rate" },
];

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Expert-Led Courses",
    desc: "Learn from industry professionals with real-world experience.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Learn at Your Pace",
    desc: "Flexible schedules that fit your lifestyle and commitments.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Lifetime Access",
    desc: "Purchase once and revisit course content whenever you need.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Certificates",
    desc: "Earn recognized certificates to boost your career prospects.",
  },
];

const AboutSection = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    itemsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-8 md:px-16 lg:px-40 py-20"
      style={{ background: "white" }}
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
        .stagger-5 { transition-delay: 0.25s; }
        .stagger-6 { transition-delay: 0.3s; }
        .feature-card:hover .feature-icon {
          background: #534AB7;
          color: white;
          transform: scale(1.05);
        }
        .feature-icon {
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
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
          About Us
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
          Why Choose LoopLearn?
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
          We believe learning should be accessible, engaging, and rewarding.
          Our platform is built to help you grow — at your own pace, on your own terms.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`fade-up stagger-${i + 1} text-center py-6 px-4 rounded-2xl`}
            ref={(el) => (itemsRef.current[i + 1] = el)}
            style={{ background: "#EEEDFE", border: "0.5px solid #AFA9EC" }}
          >
            <p className="text-3xl font-semibold mb-1" style={{ color: "#534AB7" }}>
              {stat.value}
            </p>
            <p className="text-sm" style={{ color: "#5F5E5A" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`feature-card fade-up stagger-${i + 1} flex items-start gap-4 p-5 rounded-2xl cursor-default`}
            ref={(el) => (itemsRef.current[i + 5] = el)}
            style={{ background: "#FAFAFA", border: "0.5px solid rgba(0,0,0,0.07)" }}
          >
            <div
              className="feature-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#EEEDFE", color: "#534AB7" }}
            >
              {f.icon}
            </div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
