// Component to display a loading spinner animation with a message.
// Typically used during data fetching or other asynchronous operations.

import { Pinwheel } from "ldrs/react";
import "ldrs/react/Pinwheel.css";

function RoutinesLoadingSpinner() {
  return (
    // Outer container, styled to be a centered overlay with a blurred background.
    // Takes full screen height and ensures a minimum height of 200px.
    <div className="w-full h-full flex flex-col items-center justify-center p-6 rounded-lg">
      {/* The spinning element, styled with borders to create the spinner effect and an animation. */}
      <Pinwheel size="35" stroke="3.5" speed="0.9" color="white" />
    </div>
  );
}

export default RoutinesLoadingSpinner;
