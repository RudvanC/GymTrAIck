/**
 * `SelectionCard` Component
 *
 * A stylized, clickable card used for selecting options in a form (e.g., goals, experience, etc.).
 * Changes appearance when selected and triggers an action on click.
 *
 * @param icon - A ReactNode element displayed on the left (typically an icon).
 * @param title - The main title of the card (bold).
 * @param description - A short text explaining the option.
 * @param isSelected - Boolean flag to highlight the card if it is selected.
 * @param onClick - Function to be called when the card is clicked.
 *
 * @returns A visual selection card styled according to the `isSelected` state.
 */

const SelectionCard = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    // Dynamic styling based on selection state
    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-cyan-500 bg-cyan-900/50 shadow-lg shadow-cyan-500/10 scale-105"
        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="text-cyan-400">{icon}</div>
      <div>
        <h4 className="font-semibold text-white">{title}</h4>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  </div>
);

export default SelectionCard;
