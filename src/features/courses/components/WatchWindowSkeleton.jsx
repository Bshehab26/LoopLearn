// src/features/courses/components/WatchWindowSkeleton.jsx

import React from 'react';

const Shimmer = ({ style = {} }) => (
  <div style={{ background: '#EEEDFE', borderRadius: 8, overflow: 'hidden', position: 'relative', ...style }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  </div>
);

const WatchWindowSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    <div className="sticky top-16 z-40 bg-white border-b border-gray-100 px-6 md:px-10 py-3">
      <div className="flex items-center justify-between">
        <Shimmer style={{ height: 20, width: 200 }} />
        <Shimmer style={{ height: 16, width: 100 }} />
      </div>
    </div>
    <div className="grid lg:grid-cols-[1fr_380px]">
      <div className="p-6 md:p-10">
        <Shimmer style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16 }} />
        <div className="mt-6">
          <Shimmer style={{ height: 24, width: '70%', marginBottom: 12 }} />
          <Shimmer style={{ height: 16, width: '40%', marginBottom: 20 }} />
          <Shimmer style={{ height: 80, width: '100%' }} />
        </div>
      </div>
      <div className="bg-white border-l border-gray-100 p-6">
        <Shimmer style={{ height: 24, width: 150, marginBottom: 20 }} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <Shimmer style={{ height: 48, width: '100%', borderRadius: 12, marginBottom: 8 }} />
            <div className="pl-6 space-y-2">
              <Shimmer style={{ height: 40, width: '90%', borderRadius: 8 }} />
              <Shimmer style={{ height: 40, width: '90%', borderRadius: 8 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WatchWindowSkeleton;