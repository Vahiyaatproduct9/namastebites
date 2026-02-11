import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'public', 'data', 'menu.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const menu = JSON.parse(fileContents);
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Failed to read menu.json:', error);
    return NextResponse.json({ error: 'Failed to load menu data' }, { status: 500 });
  }
}
