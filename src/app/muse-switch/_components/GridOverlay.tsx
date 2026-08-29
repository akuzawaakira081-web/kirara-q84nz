'use client';

export default function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {[1, 2].map((i) => (
        <div
          key={`v-${i}`}
          className="absolute top-0 bottom-0"
          style={{ left: `${(i * 100) / 3}%`, width: 1, background: 'rgba(255,255,255,0.6)', boxShadow: '0 0 1px rgba(0,0,0,0.5)' }}
        />
      ))}
      {[1, 2].map((i) => (
        <div
          key={`h-${i}`}
          className="absolute left-0 right-0"
          style={{ top: `${(i * 100) / 3}%`, height: 1, background: 'rgba(255,255,255,0.6)', boxShadow: '0 0 1px rgba(0,0,0,0.5)' }}
        />
      ))}
    </div>
  );
}
