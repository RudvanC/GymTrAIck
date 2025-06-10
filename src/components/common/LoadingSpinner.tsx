// Component to display a loading spinner animation with a message.
// Typically used during data fetching or other asynchronous operations.
function LoadingSpinner() {
  return (
    // Outer container, styled to be a centered overlay with a blurred background.
    // Takes full screen height and ensures a minimum height of 200px.
    <div className="flex flex-col h-screen items-center justify-center min-h-[200px] p-6 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-300">
      {/* The spinning element, styled with borders to create the spinner effect and an animation. */}
      <div className="w-12 h-12 border-4 border-t-purple-400 border-white rounded-full animate-spin mb-4"></div>
      {/* Text message displayed below the spinner. */}
      <p className="text-white text-lg font-semibold tracking-wide">
        Cargando...
      </p>
    </div>
  );
}

export default LoadingSpinner;
