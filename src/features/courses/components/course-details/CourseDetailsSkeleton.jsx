// src/features/courses/components/course-details/CourseDetailsSkeleton.jsx
//
// Matches the exact 2-column grid layout of CourseDetails.jsx:
//   col-1 row-1 → Hero + stats strip
//   col-2 row-1+2 → Purchase card (sticky sidebar)
//   col-1 row-2 → Tabs + content area

const Shimmer = ({ className = '' }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    aria-hidden="true"
  />
);

// ── Hero block ───────────────────────────────────────────────────────────────
const HeroSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-4">
      <Shimmer className="h-3 w-10" />
      <Shimmer className="h-3 w-3 rounded-none" />
      <Shimmer className="h-3 w-14" />
      <Shimmer className="h-3 w-3 rounded-none" />
      <Shimmer className="h-3 w-32" />
    </div>

    {/* Badges */}
    <div className="flex gap-2 mb-3">
      <Shimmer className="h-6 w-24 rounded-full" />
      <Shimmer className="h-6 w-20 rounded-full" />
    </div>

    {/* Title */}
    <Shimmer className="h-8 w-full mb-2" />
    <Shimmer className="h-8 w-4/5 mb-4" />

    {/* Subtitle */}
    <Shimmer className="h-4 w-full mb-1.5" />
    <Shimmer className="h-4 w-3/4 mb-4" />

    {/* Rating row */}
    <div className="flex items-center gap-3 mb-4">
      <Shimmer className="h-6 w-8" />
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Shimmer key={i} className="h-4 w-4" />
        ))}
      </div>
      <Shimmer className="h-4 w-20" />
      <Shimmer className="h-4 w-24" />
    </div>

    {/* Instructor */}
    <div className="flex items-center gap-3">
      <Shimmer className="h-9 w-9 rounded-full" />
      <div>
        <Shimmer className="h-3 w-16 mb-1" />
        <Shimmer className="h-4 w-28" />
      </div>
    </div>

    {/* Stats strip */}
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col items-center gap-1.5">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  </div>
);

// ── Purchase card sidebar ────────────────────────────────────────────────────
const PurchaseCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
    {/* Thumbnail */}
    <Shimmer className="w-full aspect-video rounded-none" />

    <div className="p-4 space-y-3">
      {/* Price */}
      <Shimmer className="h-8 w-24" />
      <Shimmer className="h-3 w-36" />

      {/* Enroll button */}
      <Shimmer className="h-10 w-full rounded-lg" />

      {/* Save / Share */}
      <div className="flex gap-2">
        <Shimmer className="h-8 flex-1 rounded-lg" />
        <Shimmer className="h-8 w-20 rounded-lg" />
      </div>

      {/* Course includes */}
      <div className="border-t border-gray-100 pt-3 space-y-2">
        <Shimmer className="h-3 w-28 mb-2" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Shimmer className="h-3.5 w-3.5 rounded-full" />
            <Shimmer className="h-3 w-36" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Tabs + content area ──────────────────────────────────────────────────────
const TabsContentSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
    {/* Tab bar */}
    <div className="flex gap-0 border-b border-gray-200 mb-6">
      {[80, 90, 70, 90].map((w, i) => (
        <div key={i} className="px-4 py-2.5">
          <Shimmer className={`h-4 w-${w === 80 ? '16' : w === 90 ? '20' : '14'}`} style={{ width: w }} />
        </div>
      ))}
    </div>

    {/* Overview content placeholder */}
    {/* "What you'll learn" */}
    <Shimmer className="h-5 w-36 mb-3" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-start gap-1.5">
          <Shimmer className="h-3.5 w-3.5 rounded-full mt-0.5 flex-shrink-0" />
          <Shimmer className={`h-3.5 ${i % 3 === 0 ? 'w-full' : i % 3 === 1 ? 'w-4/5' : 'w-3/5'}`} />
        </div>
      ))}
    </div>

    {/* Description */}
    <Shimmer className="h-5 w-28 mb-3" />
    <div className="space-y-2">
      {[100, 95, 88, 70].map((w, i) => (
        <Shimmer key={i} className="h-3.5" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

// ── Main export ──────────────────────────────────────────────────────────────
const CourseDetailsSkeleton = () => (
  <div className="bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-6 lg:gap-8">

        {/* col-1 row-1: Hero + stats */}
        <div className="order-1 lg:col-start-1 lg:row-start-1">
          <HeroSkeleton />
        </div>

        {/* col-2 row-1+2: Purchase card sidebar */}
        <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="lg:sticky lg:top-24">
            <PurchaseCardSkeleton />
          </div>
        </div>

        {/* col-1 row-2: Tabs + content */}
        <div className="order-3 lg:col-start-1 lg:row-start-2">
          <TabsContentSkeleton />
        </div>

      </div>
    </div>
  </div>
);

export default CourseDetailsSkeleton;