'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders, Order } from '../../lib/orders';

export default function CheckoutCompletePage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const uid = localStorage.getItem('wt_user_id') ?? '';
    const orders = getOrders(uid);
    if (orders.length > 0) setOrder(orders[0]);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6f8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px' }}>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '16px', padding: '48px 40px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>주문이 완료되었습니다!</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>결제가 정상적으로 처리되었습니다.</p>

        {order && (
          <div style={{ background: '#f8f8f8', borderRadius: '10px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>주문번호 {order.id}</p>
            <p style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{order.productName}{order.optionLabel ? ` — ${order.optionLabel}` : ''}</p>
            <p style={{ fontSize: '13px', color: '#555' }}>수량 {order.qty}개 · {order.totalPrice.toLocaleString()}원</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/mypage?tab=orders"
            style={{ display: 'block', padding: '14px', background: '#111', color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}
          >
            주문내역 확인
          </Link>
          <Link
            href="/products"
            style={{ display: 'block', padding: '14px', background: '#fff', color: '#111', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
