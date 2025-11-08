import { NextResponse } from "next/server"
import { queryBuilder } from "@/lib/db-helpers"

export async function GET() {
  try {
    const results = await queryBuilder<any>('blog_categories', {
      select: '*',
      orderBy: { column: 'name', ascending: true },
    })
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json(
      { error: "Không thể lấy danh sách danh mục" },
      { status: 500 }
    )
  }
}
