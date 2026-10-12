import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const historyFilePath = path.join(process.cwd(), 'data', 'history.json');

export async function GET() {
  try {
    if (!fs.existsSync(historyFilePath)) {
      return NextResponse.json([]);
    }
    const fileData = fs.readFileSync(historyFilePath, 'utf8').trim();
    if (!fileData) {
      return NextResponse.json([]);
    }
    const history = JSON.parse(fileData);
    return NextResponse.json(history);
  } catch (error: any) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { snapshot } = await request.json();

    let history: any[] = [];
    if (fs.existsSync(historyFilePath)) {
      const fileData = fs.readFileSync(historyFilePath, 'utf8').trim();
      if (fileData) {
        try {
          history = JSON.parse(fileData);
        } catch {
          history = [];
        }
      }
    }

    history.push(snapshot);
    
    const dirPath = path.dirname(historyFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));

    return NextResponse.json({ success: true, history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}