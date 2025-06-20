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
    // Cambia el estilo dinámicamente si está seleccionado o no
    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
      isSelected
        ? "border-cyan-500 bg-cyan-900/50 shadow-lg shadow-cyan-500/10 scale-105" // Estilo cuando está seleccionado
        : "border-slate-700 bg-slate-800/50 hover:border-slate-600" // Estilo por defecto
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
