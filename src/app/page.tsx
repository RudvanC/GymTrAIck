// Imports the Main component, which contains the content for the landing page.
import Main from "@/components/layout/Main";

/**
 * HomePage is the component rendered for the root path ("/") of the application.
 * It primarily serves as an entry point to display the main landing page content.
 */
export default function HomePage() {
  return (
    // Renders the Main component which includes the Navbar, Hero, Features, CTA, and Footer sections.
    // The React Fragment (<>...</>) is optional here as Main is a single child.
    <>
      <Main />
    </>
  );
}
