'use server';

import { supabaseAdmin } from './lib/supabase-admin';
import { COURIER_CODES } from './courier-constants';

type TrackingLevel = 1 | 2 | 3 | 4 | 5; // 1:접수 2:이동중 3:지점도착 4:배달출발 5:배달완료

interface SweetTrackerResponse {
  result: string;       // 'Y' | 'N'
  level?: TrackingLevel;
  lastDetail?: { kind: string; where: string; when: string };
  trackingDetails?: Array<{ kind: string; where: string; when: string; level: number }>;
}

// 스위트트래커 API 호출 (API 키가 없으면 mock 반환)
export async function checkTrackingStatus(
  courier: string,
  trackingNumber: string,
): Promise<{ level: TrackingLevel | null; detail: string; raw?: SweetTrackerResponse }> {
  const apiKey = process.env.SWEETTRACKER_API_KEY;
  const carrierCode = COURIER_CODES[courier];

  if (!apiKey || !carrierCode) {
    return { level: null, detail: 'API 키 미설정 — 수동 확인 필요' };
  }

  try {
    const url = `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${apiKey}&t_code=${carrierCode}&t_invoice=${trackingNumber}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const data: SweetTrackerResponse = await res.json();

    if (data.result !== 'Y' || !data.level) {
      return { level: null, detail: '조회 실패 또는 아직 접수 전', raw: data };
    }

    const detail = data.lastDetail
      ? `${data.lastDetail.kind} · ${data.lastDetail.where} (${data.lastDetail.when})`
      : `레벨 ${data.level}`;

    return { level: data.level, detail, raw: data };
  } catch {
    return { level: null, detail: 'API 호출 오류' };
  }
}

// level → Order 상태 변환
function levelToStatus(level: TrackingLevel): '배송중' | '배송완료' | null {
  if (level >= 5) return '배송완료';
  if (level >= 2) return '배송중';
  return null; // level 1(접수)은 아직 배송지시 유지
}

// 특정 주문 1건 배송 상태 동기화
export async function syncOrderTrackingAction(orderId: string): Promise<{
  updated: boolean;
  newStatus?: string;
  detail: string;
}> {
  const { data: row } = await supabaseAdmin
    .from('orders')
    .select('courier, tracking_number, status')
    .eq('id', orderId)
    .single();

  if (!row?.tracking_number || !row?.courier) {
    return { updated: false, detail: '송장 정보 없음' };
  }
  if (row.status === '배송완료' || row.status === '주문취소') {
    return { updated: false, detail: '이미 최종 상태' };
  }

  const { level, detail } = await checkTrackingStatus(row.courier, row.tracking_number);
  if (!level) return { updated: false, detail };

  const newStatus = levelToStatus(level);
  if (!newStatus || newStatus === row.status) {
    return { updated: false, detail };
  }

  await supabaseAdmin.from('orders').update({ status: newStatus }).eq('id', orderId);
  return { updated: true, newStatus, detail };
}

// 배송지시·배송중 주문 전체 배송 상태 동기화 (크론용)
export async function syncAllActiveOrdersAction(): Promise<{
  checked: number;
  updated: number;
  results: Array<{ id: string; updated: boolean; newStatus?: string; detail: string }>;
}> {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, courier, tracking_number, status')
    .in('status', ['배송지시', '배송중'])
    .not('tracking_number', 'is', null);

  if (!orders?.length) return { checked: 0, updated: 0, results: [] };

  const results = await Promise.all(
    orders.map(async (o) => {
      const r = await syncOrderTrackingAction(o.id);
      return { id: o.id, ...r };
    }),
  );

  return {
    checked: results.length,
    updated: results.filter((r) => r.updated).length,
    results,
  };
}
