import HeroSection from "@/components/Home/HeroSection";
import CoursesSection from "@/components/Home/CoursesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <HeroSection />
      <CoursesSection />
    </div>
  );
}