import { NextRequest, NextResponse } from 'next/server';
import { saveSectionData } from '@/lib/loadPageSections';

export async function PUT(
  request: NextRequest,
  { params }: { params: { page: string; section: string } }
) {
  try {
    const { page, section } = params;
    const data = await request.json();

    await saveSectionData(page, section, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}