import { DemoShowcase, FeaturesGrid, Footer, HeroSection, NavBar } from "@/components";

/**
 * Landing page for ChaosFix.
 * Assembles all section components in proper order.
 * This is a React Server Component (RSC).
 */
export default function HomePage(): React.JSX.Element {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <DemoShowcase />
      </main>
      <Footer />
    </>
  );
}
