export function LoadingSpinner() {
  return (
    <div className="flex flex-col h-screen items-center justify-center min-h-[200px] p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300">
      <div className="w-12 h-12 border-4 border-t-purple-400 border-white rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg font-semibold tracking-wide">
        Cargando...
      </p>
    </div>
  );
}
