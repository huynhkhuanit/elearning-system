import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="min-h-screen bg-white">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sẵn sàng thiết kế từng phần!
          </h1>
          <p className="text-gray-600">
            Header đã được cập nhật với thiết kế mới và các button bo tròn.
          </p>
        </div>
      </main>
    </div>
  );
}
