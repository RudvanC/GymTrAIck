/**
 * `Accordion` is a collapsible section component for toggling visibility of nested content.
 *
 * It renders a clickable title that expands or collapses the content below it, with smooth animations.
 * Useful for organizing sections of information like FAQs, progress tracking, or grouped data.
 *
 * @remarks
 * This component uses Tailwind CSS classes for transitions and appearance.
 * The icon rotates when open, and height transitions are handled via `max-height`.
 *
 * @example
 * ```tsx
 * <Accordion title="Workout Progress">
 *   <p>Week 1: 3 sessions completed</p>
 * </Accordion>
 * ```
 *
 * @param title - The heading displayed in the clickable section. Can be a string or a custom React node.
 * @param children - The content shown when the accordion is expanded.
 *
 * @returns A collapsible UI section component.
 */

"use client";

import { useState, type ReactNode } from "react";

/**
 * Props for the `Accordion` component.
 */
interface AccordionProps {
  title: string | ReactNode;
  children: ReactNode;
}

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Toggles the accordion's open/closed state.
   */
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={toggleOpen}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </h3>
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

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[1000px] mt-2" : "max-h-0"
        }`}
      >
        <div className="py-2">{children}</div>
      </div>
    </div>
  );
}
