const Shimmer = ({ className = "", style = {} }) => (
  <div
    className={`rounded-lg overflow-hidden relative ${className}`}
    style={{ background: "#EEEDFE", ...style }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
        animation: "shimmer 1.5s infinite",
      }}
    />
  </div>
);

const CourseCardSkeleton = () => (
  <div
    className="rounded-xl overflow-hidden"
    style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
  >
    <Shimmer style={{ height: "160px", borderRadius: 0 }} />
    <div className="p-4 flex flex-col gap-3">
      <Shimmer style={{ height: "16px", width: "80%" }} />
      <Shimmer style={{ height: "13px", width: "50%" }} />
      <div className="flex items-center gap-2">
        <Shimmer style={{ height: "13px", width: "30px" }} />
        <Shimmer style={{ height: "13px", width: "80px" }} />
        <Shimmer style={{ height: "13px", width: "60px" }} />
      </div>
      <Shimmer style={{ height: "16px", width: "40%" }} />
    </div>
  </div>
);

const Loading = () => {
  return (
    <div className="min-h-screen px-8 md:px-16 lg:px-40 py-10" style={{ background: "#FAFAFA" }}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      {/* Hero skeleton */}
      <div className="flex flex-col items-center gap-5 py-16 mb-10">
        <Shimmer style={{ height: "18px", width: "140px", borderRadius: "99px" }} />
        <Shimmer style={{ height: "48px", width: "70%", maxWidth: "560px" }} />
        <Shimmer style={{ height: "28px", width: "45%", maxWidth: "360px" }} />
        <Shimmer style={{ height: "20px", width: "55%", maxWidth: "440px" }} />
        <Shimmer style={{ height: "20px", width: "40%", maxWidth: "320px" }} />
        <Shimmer style={{ height: "52px", width: "100%", maxWidth: "480px", borderRadius: "99px" }} />
        <div className="flex gap-4 mt-2">
          <Shimmer style={{ height: "44px", width: "160px", borderRadius: "99px" }} />
          <Shimmer style={{ height: "44px", width: "140px", borderRadius: "99px" }} />
        </div>
      </div>

      {/* Companies skeleton */}
      <div className="flex items-center justify-center gap-10 mb-16 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <Shimmer key={i} style={{ height: "28px", width: "90px", borderRadius: "6px" }} />
        ))}
      </div>

      {/* Courses section skeleton */}
      <div className="mb-16">
        <Shimmer style={{ height: "32px", width: "240px", marginBottom: "12px" }} />
        <Shimmer style={{ height: "18px", width: "360px", marginBottom: "24px" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Testimonials skeleton */}
      <div className="mb-16">
        <Shimmer style={{ height: "32px", width: "200px", marginBottom: "12px" }} />
        <Shimmer style={{ height: "18px", width: "420px", marginBottom: "24px" }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.07)" }}
            >
              <div className="flex items-center gap-3 p-4" style={{ background: "#F5F5F5" }}>
                <Shimmer style={{ width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0 }} />
                <div className="flex flex-col gap-2 flex-1">
                  <Shimmer style={{ height: "14px", width: "60%" }} />
                  <Shimmer style={{ height: "12px", width: "40%" }} />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <Shimmer style={{ height: "12px", width: "80px" }} />
                <Shimmer style={{ height: "13px", width: "100%" }} />
                <Shimmer style={{ height: "13px", width: "90%" }} />
                <Shimmer style={{ height: "13px", width: "75%" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About skeleton */}
      <div className="mb-16 flex flex-col items-center gap-5">
        <Shimmer style={{ height: "18px", width: "120px", borderRadius: "99px" }} />
        <Shimmer style={{ height: "36px", width: "50%", maxWidth: "400px" }} />
        <Shimmer style={{ height: "18px", width: "65%", maxWidth: "520px" }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 w-full mt-4">
          {[...Array(4)].map((_, i) => (
            <Shimmer key={i} style={{ height: "90px", borderRadius: "16px" }} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full mt-2">
          {[...Array(4)].map((_, i) => (
            <Shimmer key={i} style={{ height: "72px", borderRadius: "16px" }} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Loading;