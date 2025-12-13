export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Fixed gradient orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500 rounded-full filter blur-xl opacity-20 animate-pulse-slow" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
