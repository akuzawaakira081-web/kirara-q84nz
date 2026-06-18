import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf8] text-[#3a3630]">
      <h1 className="text-2xl font-bold mb-4">KIRARA MUSE</h1>
      <Link
        href="/hirameki-lens"
        className="px-6 py-3 rounded-card bg-[#c9a84c] text-white font-medium hover:opacity-90 transition-opacity"
      >
        ひらめきレンズを開く
      </Link>
    </main>
  );
}
