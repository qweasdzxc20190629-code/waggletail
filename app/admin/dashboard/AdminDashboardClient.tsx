'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../products';
import { addProductAction, deleteProductAction, updateProductAction } from '../../products-actions';
import { UserRole, DASHBOARD_ROLES } from '../../users';
import { addUserAction, deleteUserAction, getUsersAction, updateUserRoleAction, DbUser } from '../../users-actions';
import { EventItem, addEvent, deleteEvent, eventItems, updateEvent } from '../../events';
import ProductFormModal from './ProductFormModal';
import EventFormModal from './EventFormModal';
import { cardStyle, dangerButtonStyle, ghostButtonStyle, inputStyle, primaryButtonStyle } from './styles';

type Tab = 'dashboard' | 'products' | 'users' | 'events';

const detailStats = [
  { label: '신규 주문', value: '0' },
  { label: '재주문', value: '0' },
  { label: '반품', value: '0' },
  { label: '환불', value: '0' },
  { label: '방문자', value: '0' },
  { label: '검색수', value: '0' },
];

export default function AdminDashboardClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [myRole, setMyRole] = useState<UserRole | null>(null);

  // ----- auth guard -----
  useEffect(() => {
    if (typeof window === 'undefined' || window.localStorage.getItem('isAdmin') !== 'true') {
      router.replace('/login');
      return;
    }
    setMyRole((window.localStorage.getItem('wt_role') as UserRole) ?? null);
  }, [router]);

  // ----- product management -----
  // Mutations run through Server Actions (products-actions.ts) so they land on the
  // server's own `products` array — the one /category and /products/[id] read from.
  // Each action returns the fresh full list, which we use directly as the new state.
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (savedProduct: Product) => {
    const updatedList = editingProduct
      ? await updateProductAction(savedProduct)
      : await addProductAction(savedProduct);
    setProductList(updatedList);
    closeProductModal();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
    const updatedList = await deleteProductAction(id);
    setProductList(updatedList);
    if (editingProduct?.id === id) {
      closeProductModal();
    }
  };

  // ----- user management -----
  const [userList, setUserList] = useState<DbUser[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');
  const [userError, setUserError] = useState('');

  useEffect(() => {
    getUsersAction().then(setUserList);
  }, []);

  const resetUserForm = () => {
    setUserId('');
    setUserPassword('');
    setUserConfirmPassword('');
    setUserError('');
    setShowUserForm(false);
  };

  const handleUserSubmit = async (event: { preventDefault(): void }) => {
    event.preventDefault();
    if (!userId || !userPassword || !userConfirmPassword) {
      setUserError('모든 필드를 입력해주세요.');
      return;
    }
    if (userPassword !== userConfirmPassword) {
      setUserError('비밀번호가 일치하지 않습니다.');
      return;
    }
    const result = await addUserAction(userId, userPassword, '관리자');
    if (result.error) { setUserError(result.error); return; }
    setUserList(await getUsersAction());
    resetUserForm();
  };

  const handleDeleteUser = async (id: string) => {
    if (userList.length <= 1) {
      window.alert('마지막 계정은 삭제할 수 없습니다.');
      return;
    }
    if (!window.confirm('이 계정을 삭제하시겠습니까?')) return;
    await deleteUserAction(id);
    setUserList(await getUsersAction());
  };

  const handleRoleChange = async (id: string, role: UserRole) => {
    await updateUserRoleAction(id, role);
    setUserList(await getUsersAction());
  };

  // ----- event management -----
  const [eventList, setEventList] = useState<EventItem[]>(eventItems.slice());
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const openAddEvent = () => { setEditingEvent(null); setShowEventModal(true); };
  const openEditEvent = (ev: EventItem) => { setEditingEvent(ev); setShowEventModal(true); };
  const closeEventModal = () => { setShowEventModal(false); setEditingEvent(null); };

  const handleSaveEvent = (payload: Omit<EventItem, 'id'>) => {
    const updated = editingEvent
      ? updateEvent({ ...payload, id: editingEvent.id })
      : addEvent(payload);
    setEventList(updated);
    closeEventModal();
  };

  const handleDeleteEvent = (id: number) => {
    if (!window.confirm('이 이벤트를 삭제하시겠습니까?')) return;
    setEventList(deleteEvent(id));
  };

  // ----- dashboard stats -----
  const stats = useMemo(
    () => [
      { label: '오늘 판매량', value: '0', bg: '#0041BD' },
      { label: '오늘 매출', value: '0원', bg: '#FFDC20', color: '#111' },
      { label: '전체 상품 수', value: String(productList.length), bg: '#0041BD' },
      { label: '전체 주문 수', value: '0', bg: '#FFDC20', color: '#111' },
    ],
    [productList.length]
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: '대시보드' },
    { key: 'products', label: '상품 관리' },
    { key: 'users', label: '유저 관리' },
    { key: 'events', label: '이벤트 관리' },
  ];

  return (
    <div className="adm-wrap" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh', background: '#F5F8FF', color: '#111' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, letterSpacing: '0.16em', color: '#0041BD' }}>WAGGLE TAIL DASHBOARD</p>
          <h1 className="adm-title" style={{ margin: '8px 0 0', fontSize: '38px', fontWeight: 900 }}>관리자 대시보드</h1>
        </div>

        {/* Tab bar — horizontally scrollable on mobile */}
        <div className="adm-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                border: tab === item.key ? 'none' : '2px solid #111',
                background: tab === item.key ? '#0041BD' : '#fff',
                color: tab === item.key ? '#fff' : '#111',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && (
          <>
            <div className="adm-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {stats.map((item) => (
                <div key={item.label} style={{ padding: '22px 20px', borderRadius: '20px', background: item.bg, color: item.color || '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.08)' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.9 }}>{item.label}</p>
                  <p className="adm-stat-val" style={{ margin: '14px 0 0', fontSize: '36px', fontWeight: 900, lineHeight: 1 }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div className="adm-dashboard-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div className="adm-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                {detailStats.map((item) => (
                  <div key={item.label} style={{ padding: '20px', borderRadius: '18px', background: '#fff', boxShadow: '0 20px 44px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#0041BD' }}>{item.label}</p>
                    <p className="adm-detail-val" style={{ margin: '14px 0 0', fontSize: '30px', fontWeight: 900, color: '#111' }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(180deg, #0041BD 0%, #00265a 100%)', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', boxShadow: '0 24px 50px rgba(0,0,0,0.15)' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, opacity: 0.85 }}>WAGGLE TAIL BANNER</p>
                  <h2 className="adm-banner-title" style={{ margin: '14px 0 0', fontSize: '26px', fontWeight: 900, lineHeight: 1.1 }}>오늘도 꼬리가<br />흔들리는 하루</h2>
                  <p style={{ margin: '14px 0 0', fontSize: '14px', lineHeight: 1.7, opacity: 0.88 }}>주문 현황을 빠르게 확인하고, 판매 흐름을 한눈에 파악하세요.</p>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#FFDC20', color: '#111', padding: '8px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '12px' }}>실시간 업데이트</span>
                  <span style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', padding: '8px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>관리자 전용</span>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'products' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <h2 className="adm-section-title" style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>상품 관리</h2>
                <p style={{ color: '#555', margin: '6px 0 0', fontSize: '14px' }}>상품을 추가, 수정, 삭제할 수 있습니다.</p>
              </div>
              <button type="button" onClick={openAddProduct} style={primaryButtonStyle}>새 상품 추가</button>
            </div>

            {showProductModal && (
              <ProductFormModal product={editingProduct} onClose={closeProductModal} onSave={handleSaveProduct} />
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
              {productList.length === 0 ? (
                <p style={{ color: '#666' }}>등록된 상품이 없습니다.</p>
              ) : (
                productList.map((product) => (
                  <div key={product.id} className="adm-list-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', border: '1px solid rgba(0,0,0,.08)', borderRadius: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                        <p style={{ fontSize: '12px', color: '#666', margin: '3px 0 0' }}>
                          {product.category} · {product.price.toLocaleString()}원
                          {product.optionCombinations && product.optionCombinations.length > 0 ? ` · 옵션 ${product.optionCombinations.length}종` : ''}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button type="button" onClick={() => openEditProduct(product)} style={ghostButtonStyle}>수정</button>
                      <button type="button" onClick={() => handleDeleteProduct(product.id)} style={dangerButtonStyle}>삭제</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'events' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <h2 className="adm-section-title" style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>이벤트 관리</h2>
                <p style={{ color: '#555', margin: '6px 0 0', fontSize: '14px' }}>이벤트를 추가, 수정, 삭제할 수 있습니다.</p>
              </div>
              <button type="button" onClick={openAddEvent} style={primaryButtonStyle}>새 이벤트 추가</button>
            </div>

            {showEventModal && (
              <EventFormModal event={editingEvent} onClose={closeEventModal} onSave={handleSaveEvent} />
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
              {eventList.length === 0 ? (
                <p style={{ color: '#666' }}>등록된 이벤트가 없습니다.</p>
              ) : (
                eventList.map((ev) => (
                  <div key={ev.id} className="adm-list-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', border: '1px solid rgba(0,0,0,.08)', borderRadius: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: ev.bg, flexShrink: 0, overflow: 'hidden' }}>
                        {ev.image
                          ? <img src={ev.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', background: ev.accentColor }} />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px', flexWrap: 'wrap' }}>
                          <p style={{ fontSize: '15px', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{ev.title}</p>
                          <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '999px', background: ev.status === 'ongoing' ? 'rgba(0,65,189,.1)' : 'rgba(17,17,17,.08)', color: ev.status === 'ongoing' ? '#0041BD' : '#888', flexShrink: 0 }}>
                            {ev.status === 'ongoing' ? '진행중' : '종료'}
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{ev.startDate}{ev.endDate ? ` – ${ev.endDate}` : ' ~'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button type="button" onClick={() => openEditEvent(ev)} style={ghostButtonStyle}>수정</button>
                      <button type="button" onClick={() => handleDeleteEvent(ev.id)} style={dangerButtonStyle}>삭제</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <h2 className="adm-section-title" style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>유저 관리</h2>
                <p style={{ color: '#555', margin: '6px 0 0', fontSize: '14px' }}>관리자 계정을 확인하고 추가하거나 삭제할 수 있습니다.</p>
              </div>
              <button
                type="button"
                onClick={() => { if (showUserForm) { resetUserForm(); } else { setShowUserForm(true); } }}
                style={primaryButtonStyle}
              >
                {showUserForm ? '닫기' : '새 아이디 추가'}
              </button>
            </div>

            {showUserForm && (
              <form onSubmit={handleUserSubmit} style={{ display: 'grid', gap: '14px', marginBottom: '24px', padding: '20px', border: '2px solid #111', borderRadius: '16px' }}>
                <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                  아이디
                  <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="새 관리자 아이디" style={inputStyle} />
                </label>
                <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                  비밀번호
                  <input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="비밀번호" style={inputStyle} />
                </label>
                <label style={{ display: 'grid', gap: '6px', fontWeight: 700, fontSize: '13px' }}>
                  비밀번호 확인
                  <input type="password" value={userConfirmPassword} onChange={(e) => setUserConfirmPassword(e.target.value)} placeholder="비밀번호 확인" style={inputStyle} />
                </label>
                {userError && <p style={{ color: '#d52b1e', margin: 0 }}>{userError}</p>}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={primaryButtonStyle}>추가</button>
                  <button type="button" onClick={resetUserForm} style={ghostButtonStyle}>취소</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gap: '12px' }}>
              {userList.length === 0 ? (
                <p style={{ color: '#666' }}>등록된 관리자 계정이 없습니다.</p>
              ) : (
                userList.map((user) => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', border: '1px solid rgba(0,0,0,.08)', borderRadius: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{user.id}</p>
                        <span style={{
                          fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px',
                          background: DASHBOARD_ROLES.includes(user.role) ? '#0041BD' : 'rgba(17,17,17,.08)',
                          color: DASHBOARD_ROLES.includes(user.role) ? '#fff' : '#666',
                        }}>
                          {user.role}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>비밀번호: {user.password.replace(/./g, '•')}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        disabled={myRole !== '관리자'}
                        title={myRole !== '관리자' ? '등급 변경은 관리자만 가능합니다' : undefined}
                        style={{ padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '13px', fontWeight: 700, cursor: myRole === '관리자' ? 'pointer' : 'not-allowed', outline: 'none', opacity: myRole === '관리자' ? 1 : 0.45 }}
                      >
                        <option value="회원">회원</option>
                        <option value="직원">직원</option>
                        <option value="마스터">마스터</option>
                        <option value="관리자">관리자</option>
                      </select>
                      <button type="button" onClick={() => handleDeleteUser(user.id)} style={dangerButtonStyle}>삭제</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .adm-wrap { padding: 40px 24px; }
        .adm-tabs { scrollbar-width: none; }
        .adm-tabs::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .adm-wrap { padding: 20px 16px; }
          .adm-title { font-size: 26px !important; }
          .adm-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .adm-stat-val { font-size: 26px !important; margin-top: 10px !important; }
          .adm-dashboard-layout { grid-template-columns: 1fr !important; }
          .adm-detail-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .adm-detail-val { font-size: 22px !important; margin-top: 10px !important; }
          .adm-banner-title { font-size: 20px !important; }
          .adm-section-title { font-size: 20px !important; }
          .adm-list-row { padding: 12px !important; }
        }
      `}</style>
    </div>
  );
}
