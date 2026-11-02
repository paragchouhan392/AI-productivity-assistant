import { MotionConfig } from "motion/react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Showcases from "@/components/landing/Showcases";
import HowItWorks from "@/components/landing/HowItWorks";
import Faq from "@/components/landing/Faq";
import CallToAction from "@/components/landing/CallToAction";
import Footer from "@/components/landing/Footer";

export default function Landing() {
  return (
    <MotionConfig reducedMotion="user">
      <div id="top" className="overflow-x-clip">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Showcases />
          <HowItWorks />
          <Faq />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
