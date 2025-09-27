export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center py-20" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="text-3xl font-bold text-foreground mb-4 transition-colors duration-300">
          Chào mừng đến với DHV LearnX!
        </h1>
        <p className="text-muted-foreground transition-colors duration-300 max-w-2xl mx-auto">
          Khám phá các khóa học lập trình chất lượng cao từ cơ bản đến nâng cao.
          Bắt đầu hành trình học tập của bạn ngay hôm nay với HeroSection tuyệt đẹp ở phía trên!
        </p>
      </div>
    </div>
  );
}