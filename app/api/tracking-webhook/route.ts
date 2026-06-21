import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../lib/supabase-admin';

// 택배사(스위트트래커) Webhook 수신
// 스위트트래커가 배송 이벤트 발생 시 이 엔드포인트로 POST 전송
// level 2+ → 배송중, level 5 → 배송완료
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 스위트트래커 webhook 페이로드 형식
    // { t_invoice: '송장번호', t_code: '택배사코드', level: 2, kind: '이동중', where: '~센터', when: '2026-...' }
    const { t_invoice, level } = body as { t_invoice?: string; level?: number };

    if (!t_invoice || !level) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }

    let newStatus: string | null = null;
    if (level >= 5) newStatus = '배송완료';
    else if (level >= 2) newStatus = '배송중';

    if (!newStatus) {
      return NextResponse.json({ ok: true, skipped: true, reason: '상태 변경 불필요' });
    }

    // 해당 송장번호를 가진 주문 찾아서 상태 업데이트
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('tracking_number', t_invoice)
      .in('status', ['배송지시', '배송중']);

    if (!orders?.length) {
      return NextResponse.json({ ok: true, skipped: true, reason: '해당 주문 없음' });
    }

    await Promise.all(
      orders.map((o) =>
        supabaseAdmin.from('orders').update({ status: newStatus }).eq('id', o.id),
      ),
    );

    return NextResponse.json({ ok: true, updated: orders.length, newStatus });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
