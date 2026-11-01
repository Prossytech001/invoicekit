import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import { Strip, HowItWorks, Templates, Features, Pricing, FinalCta, Footer } from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Strip />
        <HowItWorks />
        <Templates />
        <Features />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
