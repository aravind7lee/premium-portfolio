// src/components/StickyHeader.jsx
import React from 'react';

export default function StickyHeader({ title, icon: Icon, className = '' }) {
  return (
    <div className={`relative z-10 ${className}`}>
      <div className="rounded-2xl px-6 py-4 border border-white/10" style={{ background: 'rgba(var(--color-text-rgb), 0.03)' }}>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Icon style={{ width: 18, height: 18, color: '#a78bfa' }} />
            </div>
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold"
              style={{ background: 'linear-gradient(90deg,#a78bfa,#2dd4bf)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {title}
            </h2>
            <div className="h-0.5 w-16 rounded-full mt-1" style={{ background: 'linear-gradient(90deg,#7c3aed,#06b6d4)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
