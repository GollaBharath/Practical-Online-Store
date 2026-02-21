import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/health
 * Test endpoint to verify database connection
 *
 * Usage:
 * - Visit http://localhost:3000/api/health in your browser
 * - Should return success: true if database is connected
 */
export async function GET() {
  try {
    // Test database connection by querying products count
    const productCount = await prisma.product.count()

    return NextResponse.json(
      {
        success: true,
        message: 'Database connection successful',
        checks: {
          database: true,
          productsCount: productCount,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        message,
        hint: 'Check that DATABASE_URL is set correctly in .env.local',
      },
      { status: 500 }
    )
  }
}
