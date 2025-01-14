import { startDropWorker, stopDropWorker } from "@/lib/drop-worker";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { action } = await request.json();
  
  if (action === 'start') {
    await startDropWorker();
    return NextResponse.json({ status: 'Worker started' });
  } else if (action === 'stop') {
    stopDropWorker();
    return NextResponse.json({ status: 'Worker stopped' });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
} 