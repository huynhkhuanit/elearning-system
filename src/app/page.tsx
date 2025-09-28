import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#ffffff' }}>
      <HeroSection />
      <CoursesSection />
    </div>
  );
}