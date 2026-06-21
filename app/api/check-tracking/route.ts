import { NextRequest, NextResponse } from 'next/server';
import { syncAllActiveOrdersAction } from '../../tracking-actions';

// Vercel Cron 또는 수동 호출로 배송 상태 일괄 업데이트
// 호출: POST /api/check-tracking
// Header: Authorization: Bearer {CRON_SECRET}
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const result = await syncAllActiveOrdersAction();
  return NextResponse.json({ ok: true, ...result });
}

// Vercel Cron GET 방식도 지원
export async function GET(req: NextRequest) {
  return POST(req);
}
