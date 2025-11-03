import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { RowDataPacket } from "mysql2"

export async function GET() {
  try {
    const results = await query<RowDataPacket[]>(
      "SELECT * FROM blog_categories ORDER BY name ASC"
    )
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json(
      { error: "Không thể lấy danh sách danh mục" },
      { status: 500 }
    )
  }
}
