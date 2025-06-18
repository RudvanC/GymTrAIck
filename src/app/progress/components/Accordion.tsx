// app/progress/components/Accordion.tsx

"use client";

import { useState, type ReactNode } from "react";

interface AccordionProps {
  title: string | ReactNode;
  children: ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  // Estado para saber si el acordeón está abierto o cerrado
  const [isOpen, setIsOpen] = useState(false);

  // Función para cambiar el estado al hacer clic
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      {/* El título que será el botón para desplegar */}
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
        {/* Icono de flecha que rota con la animación */}
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* El contenido desplegable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] mt-2" : "max-h-0"
        }`}
      >
        {/* Damos un poco de padding al contenido cuando está abierto */}
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}
