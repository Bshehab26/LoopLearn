// src/features/admin/components/common/Avatar.jsx
//
// Shows the user's profile image if one exists, otherwise a colored
// initials badge. The color is derived from the name so the same person
// always gets the same color across renders.

import React from 'react';

const COLORS = ['#534AB7', '#0EA5E9', '#16A34A', '#D97706', '#DB2777', '#7C3AED', '#0891B2'];

const colorFor = (seed = '') => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
};

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';

const Avatar = ({ name, imageUrl, size = 36 }) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: colorFor(name), fontSize: size * 0.4 }}
    >
      {initials(name)}
    </div>
  );
};

export default Avatar;
