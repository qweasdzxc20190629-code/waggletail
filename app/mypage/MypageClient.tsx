'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrders, updateOrder, savePendingOrder, Order } from '../lib/orders';
import { getWishlistAction, removeFromWishlistAction, WishItem } from '../wishlist-actions';
import { getCartAction, updateCartQtyAction, removeFromCartAction, CartItem } from '../cart-actions';

type ModalKey = '주문내역' | '찜 목록' | '장바구니' | '정기배송' | '1:1 문의' | '리뷰 관리' | null;

const menuItems: { icon: string; label: ModalKey & string; desc: string }[] = [
  { icon: '📦', label: '주문내역', desc: '주문·배송 현황' },
  { icon: '❤️', label: '찜 목록', desc: '저장한 상품 보기' },
  { icon: '🛒', label: '장바구니', desc: '담아둔 상품 보기' },
  { icon: '🔁', label: '정기배송', desc: '구독 현황 관리' },
  { icon: '💬', label: '1:1 문의', desc: '문의 내역 확인' },
  { icon: '⭐', label: '리뷰 관리', desc: '작성한 리뷰 보기' },
];

const statusColor: Record<string, { bg: string; color: string }> = {
  '배송완료': { bg: 'rgba(17,17,17,.08)', color: '#555' },
  '배송중':   { bg: 'rgba(0,65,189,.1)',  color: '#0041BD' },
  '주문완료': { bg: 'rgba(255,220,32,.3)', color: '#7a6000' },
  '주문취소': { bg: 'rgba(255,77,109,.1)', color: '#ff4d6d' },
};

export default function MypageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openModal, setOpenModal] = useState<ModalKey>(null);
  const [editAddrId, setEditAddrId] = useState<string | null>(null);
  const [newAddr, setNewAddr] = useState('');

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem('wt_role');
    if (!role) { router.push('/login'); return; }
    const uid = localStorage.getItem('wt_user_id') ?? '';
    setIsAdmin(role === '관리자' || role === '마스터');
    setRoleLabel(role);
    setUserId(uid);
    setOrders(getOrders(uid));
    getWishlistAction(uid).then(setWishlist);
    getCartAction(uid).then(setCart);
    if (searchParams.get('tab') === 'orders') {
      setTimeout(() => document.getElementById('orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    }
    const modal = searchParams.get('modal') as ModalKey;
    if (modal) setOpenModal(modal);
  }, [router, searchParams]);

  if (!mounted) return null;

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#f6f7fb', minHeight: '100vh' }}>

      {/* Profile hero */}
      <section style={{ background: '#0041BD', color: '#fff', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#F5C400', marginBottom: '24px' }}>MY PAGE</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#F5C400', border: '3px solid #fff', display: 'grid', placeItems: 'center', fontSize: '32px', flexShrink: 0 }}>
              🐾
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>{userId}님</h1>
                {isAdmin && (
                  <span style={{ background: '#0041BD', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '999px' }}>
                    {roleLabel}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '14px', opacity: 0.75, margin: 0 }}>{userId}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mp-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '32px' }}>
            {[
              { label: '주문내역', value: `${orders.filter((o) => o.status !== '주문취소').length}건` },
              { label: '찜 목록', value: `${wishlist.length}개` },
              { label: '쿠폰', value: '0장' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.12)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 900 }}>{s.value}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '960px', margin: '-32px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 1 }}>

        {/* Quick menu */}
        <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '18px' }}>바로가기</h2>
          <div className="mp-menu-grid">
            {menuItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setOpenModal(item.label)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center' }}
              >
                <div className="mp-menu-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', borderRadius: '14px', transition: 'background .15s' }}>
                  <div style={{ width: '48px', height: '48px', background: '#f4f6fb', borderRadius: '14px', display: 'grid', placeItems: 'center', fontSize: '22px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div id="orders" style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 900, margin: 0 }}>최근 주문내역</h2>
          </div>
          {orders.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#aaa', textAlign: 'center', padding: '32px 0' }}>주문내역이 없습니다.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order) => {
                const sc = statusColor[order.status] ?? { bg: '#eee', color: '#555' };
                const dateStr = new Date(order.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', border: '1.5px solid rgba(17,17,17,.1)', borderRadius: '14px', opacity: order.status === '주문취소' ? 0.5 : 1 }}>
                    <div style={{ width: '52px', height: '52px', background: '#f4f6fb', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                      {order.productImage
                        ? <img src={order.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '22px' }}>📦</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {order.productName}{order.optionLabel ? ` (${order.optionLabel})` : ''}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>{dateStr} · {order.id} · {order.qty}개</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '4px' }}>{order.totalPrice.toLocaleString()}원</div>
                      <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: sc.bg, color: sc.color }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account settings */}
        <div style={{ background: '#fff', border: '2px solid #111', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '14px' }}>계정 설정</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { label: '개인정보 수정', icon: '✏️' },
              { label: '비밀번호 변경', icon: '🔒' },
              { label: '알림 설정', icon: '🔔' },
              { label: '회원 탈퇴', icon: '⚠️', red: true },
            ].map((item, i, arr) => (
              <a
                key={item.label}
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '15px 4px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(17,17,17,.08)' : 'none',
                  textDecoration: 'none',
                  color: item.red ? '#ff4d6d' : '#111',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{item.icon}</span> {item.label}
                </span>
                <span style={{ opacity: 0.3, fontSize: '16px' }}>›</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 */}
      {openModal && (
        <div
          onClick={() => setOpenModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 900, margin: 0 }}>{openModal}</h2>
              <button type="button" onClick={() => setOpenModal(null)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '20px 24px 32px' }}>
              {openModal === '주문내역' && (
                orders.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: '14px' }}>주문내역이 없습니다.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {orders.map((order) => {
                      const sc = statusColor[order.status] ?? { bg: '#eee', color: '#555' };
                      const dateStr = new Date(order.date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
                      const canAction = order.status === '주문완료';
                      return (
                        <div key={order.id} style={{ border: '1.5px solid rgba(17,17,17,.1)', borderRadius: '14px', overflow: 'hidden', opacity: order.status === '주문취소' ? 0.5 : 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px' }}>
                            <div style={{ width: '52px', height: '52px', background: '#f4f6fb', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                              {order.productImage
                                ? <img src={order.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '22px' }}>📦</div>
                              }
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {order.productName}{order.optionLabel ? ` (${order.optionLabel})` : ''}
                              </div>
                              <div style={{ fontSize: '12px', color: '#888' }}>{dateStr} · {order.id} · {order.qty}개</div>
                              {order.address && <div style={{ fontSize: '12px', color: '#0041BD', marginTop: '2px' }}>📍 {order.address}</div>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: '14px', fontWeight: 900, marginBottom: '4px' }}>{order.totalPrice.toLocaleString()}원</div>
                              <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: sc.bg, color: sc.color }}>{order.status}</span>
                            </div>
                          </div>
                          {canAction && (
                            <div style={{ borderTop: '1px solid #f0f0f0', display: 'flex' }}>
                              <button type="button" onClick={() => { setEditAddrId(editAddrId === order.id ? null : order.id); setNewAddr(order.address ?? ''); }}
                                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', borderRight: '1px solid #f0f0f0', cursor: 'pointer', color: '#0041BD' }}>
                                배송지 변경
                              </button>
                              <button type="button" onClick={() => { if (!confirm('주문을 취소하시겠습니까?')) return; const updated = updateOrder(userId, order.id, { status: '주문취소' }); setOrders(updated); }}
                                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d6d' }}>
                                주문취소
                              </button>
                            </div>
                          )}
                          {editAddrId === order.id && (
                            <div style={{ borderTop: '1px solid #f0f0f0', padding: '12px 14px', background: '#f9f9f9', display: 'flex', gap: '8px' }}>
                              <input type="text" value={newAddr} onChange={(e) => setNewAddr(e.target.value)} placeholder="새 배송지 주소 입력"
                                style={{ flex: 1, padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' }} />
                              <button type="button" onClick={() => { if (!newAddr.trim()) return; const updated = updateOrder(userId, order.id, { address: newAddr.trim() }); setOrders(updated); setEditAddrId(null); }}
                                style={{ padding: '9px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                                저장
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {openModal === '찜 목록' && (
                wishlist.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: '14px' }}>
                    찜한 상품이 없습니다.<br />
                    <Link href="/products" onClick={() => setOpenModal(null)} style={{ color: '#0041BD', fontWeight: 700 }}>상품 둘러보기 →</Link>
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {wishlist.map((item) => (
                      <div key={item.productId} style={{ border: '1.5px solid rgba(17,17,17,.1)', borderRadius: '14px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '14px', padding: '14px', alignItems: 'center' }}>
                          <div style={{ width: '64px', height: '64px', background: '#f4f6fb', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                            {item.productImage
                              ? <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '24px' }}>📦</div>
                            }
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>{item.category}</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>{item.productName}</div>
                            <div style={{ fontSize: '16px', fontWeight: 900 }}>{item.price.toLocaleString()}<span style={{ fontSize: '12px', fontWeight: 700 }}>원</span></div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                          <button type="button" onClick={async () => { const updated = await removeFromWishlistAction(userId, item.productId); setWishlist(updated); window.dispatchEvent(new Event('wtWishChanged')); }}
                            style={{ padding: '11px 0', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', borderRight: '1px solid #f0f0f0', cursor: 'pointer', color: '#ff4d6d' }}>
                            ♡ 찜 취소
                          </button>
                          <Link href={`/products/${item.productId}`} onClick={() => setOpenModal(null)}
                            style={{ padding: '11px 0', fontSize: '13px', fontWeight: 700, background: 'none', borderRight: '1px solid #f0f0f0', cursor: 'pointer', color: '#0041BD', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            상품 보기
                          </Link>
                          <button type="button" onClick={() => { savePendingOrder({ productId: item.productId, productName: item.productName, productImage: item.productImage, category: item.category, optionLabel: '', qty: 1, unitPrice: item.price, totalPrice: item.price }); setOpenModal(null); router.push('/checkout'); }}
                            style={{ padding: '11px 0', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>
                            구매하기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {openModal === '장바구니' && (
                cart.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#aaa', padding: '40px 0', fontSize: '14px' }}>
                    장바구니가 비어있습니다.<br />
                    <Link href="/products" onClick={() => setOpenModal(null)} style={{ color: '#0041BD', fontWeight: 700 }}>쇼핑하러 가기 →</Link>
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cart.map((item) => {
                      const key = `${item.productId}__${item.optionLabel}`;
                      return (
                        <div key={key} style={{ border: '1.5px solid rgba(17,17,17,.1)', borderRadius: '14px', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', gap: '14px', padding: '14px', alignItems: 'center' }}>
                            <Link href={`/products/${item.productId}`} onClick={() => setOpenModal(null)} style={{ flexShrink: 0 }}>
                              <div style={{ width: '60px', height: '60px', background: '#f4f6fb', borderRadius: '8px', overflow: 'hidden' }}>
                                {item.productImage
                                  ? <img src={item.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '22px' }}>📦</div>
                                }
                              </div>
                            </Link>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '12px', color: '#888', marginBottom: '2px' }}>{item.category}</p>
                              <p style={{ fontSize: '14px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.productName}{item.optionLabel ? ` — ${item.optionLabel}` : ''}
                              </p>
                              <p style={{ fontSize: '15px', fontWeight: 900, marginTop: '4px' }}>{(item.unitPrice * item.qty).toLocaleString()}원</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                              <button type="button" onClick={async () => { const updated = await updateCartQtyAction(userId, item.productId, item.optionLabel, item.qty - 1); setCart(updated); window.dispatchEvent(new Event('wtCartChanged')); }}
                                style={{ width: '30px', height: '30px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px' }}>−</button>
                              <span style={{ width: '32px', textAlign: 'center', fontSize: '13px', fontWeight: 700, borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', height: '30px', lineHeight: '30px' }}>{item.qty}</span>
                              <button type="button" onClick={async () => { const updated = await updateCartQtyAction(userId, item.productId, item.optionLabel, item.qty + 1); setCart(updated); window.dispatchEvent(new Event('wtCartChanged')); }}
                                style={{ width: '30px', height: '30px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px' }}>+</button>
                            </div>
                          </div>
                          <div style={{ borderTop: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                            <button type="button" onClick={async () => { const updated = await removeFromCartAction(userId, item.productId, item.optionLabel); setCart(updated); window.dispatchEvent(new Event('wtCartChanged')); }}
                              style={{ padding: '10px 0', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', borderRight: '1px solid #f0f0f0', cursor: 'pointer', color: '#888' }}>삭제</button>
                            <Link href={`/products/${item.productId}`} onClick={() => setOpenModal(null)}
                              style={{ padding: '10px 0', fontSize: '13px', fontWeight: 700, color: '#0041BD', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #f0f0f0' }}>
                              상품 보기
                            </Link>
                            <button type="button" onClick={() => { savePendingOrder({ productId: item.productId, productName: item.productName, productImage: item.productImage, category: item.category, optionLabel: item.optionLabel, qty: item.qty, unitPrice: item.unitPrice, totalPrice: item.unitPrice * item.qty }); setOpenModal(null); router.push('/checkout'); }}
                              style={{ padding: '10px 0', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>주문하기</button>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ background: '#f8f8f8', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700 }}>총 {cart.reduce((s, c) => s + c.qty, 0)}개 상품</span>
                      <span style={{ fontSize: '20px', fontWeight: 900 }}>{cart.reduce((s, c) => s + c.unitPrice * c.qty, 0).toLocaleString()}원</span>
                    </div>
                  </div>
                )
              )}

              {(openModal === '정기배송' || openModal === '1:1 문의' || openModal === '리뷰 관리') && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚧</div>
                  <p style={{ color: '#aaa', fontSize: '14px' }}>준비 중인 기능입니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mp-menu-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 4px;
        }
        .mp-menu-item:hover {
          background: rgba(17,17,17,.05);
        }
        @media (max-width: 640px) {
          .mp-stats {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 8px !important;
          }
          .mp-menu-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
