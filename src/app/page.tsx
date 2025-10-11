import HeroSection from "@/components/Home/HeroSection";
import CoursesSection from "@/components/Home/CoursesSection";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#ffffff' }}>
      <HeroSection />
      <CoursesSection />
    </div>
  );
}