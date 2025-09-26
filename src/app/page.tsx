import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="min-h-screen bg-background transition-colors duration-300">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-foreground mb-4 transition-colors duration-300">
            Sẵn sàng thiết kế từng phần!
          </h1>
          <p className="text-muted-foreground transition-colors duration-300">
            Header đã được cập nhật với thiết kế mới và các button bo tròn.
          </p>
        </div>
      </main>
    </div>
  );
}
