'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../products';
import { addProductAction, deleteProductAction, getProductsAction, updateProductAction } from '../../products-actions';
import { UserRole, DASHBOARD_ROLES } from '../../users';
import { addUserAction, deleteUserAction, getUsersAction, updateUserRoleAction, DbUser } from '../../users-actions';
import { EventItem, addEvent, deleteEvent, eventItems, updateEvent } from '../../events';
import { addCategoryAction, deleteCategoryAction, getCategoriesAction, updateCategoryAction, CategoryData } from '../../categories-actions';
import ProductFormModal from './ProductFormModal';
import EventFormModal from './EventFormModal';
import CategoryFormModal from './CategoryFormModal';
import { cardStyle, dangerButtonStyle, ghostButtonStyle, inputStyle, primaryButtonStyle } from './styles';
import { getAllOrdersAction, getAllOrdersUpdateAction, Order } from '../../orders-actions';

type Tab = 'dashboard' | 'products' | 'users' | 'events' | 'categories' | 'orders';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');

  const switchTab = (t: Tab) => {
    localStorage.setItem('wt_admin_tab', t);
    setTab(t);
  };
  const [myRole, setMyRole] = useState<UserRole | null>(null);

  // ----- auth guard -----
  useEffect(() => {
    if (typeof window === 'undefined' || window.localStorage.getItem('isAdmin') !== 'true') {
      router.replace('/login');
      return;
    }
    setMyRole((window.localStorage.getItem('wt_role') as UserRole) ?? null);
    const saved = localStorage.getItem('wt_admin_tab') as Tab;
    if (saved) setTab(saved);
  }, [router]);

  // ----- product management -----
  // Mutations run through Server Actions (products-actions.ts) so they land on the
  // server's own `products` array — the one /category and /products/[id] read from.
  // Each action returns the fresh full list, which we use directly as the new state.
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    getProductsAction().then(setProductList);
  }, []);
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

  // ----- order management -----
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});
  const [courierInputs, setCourierInputs] = useState<Record<string, string>>({});
  const [orderFilter, setOrderFilter] = useState<string>('전체');
  useEffect(() => { getAllOrdersAction().then(setOrderList); }, []);

  const orderFilterMap: Record<string, Order['status'][]> = {
    '결제완료':   ['주문완료'],
    '상품준비중': ['발주확인', '배송준비중'],
    '배송지시':   [],
    '배송중':     ['배송중'],
    '배송완료':   ['배송완료'],
    '주문취소':   ['주문취소'],
  };
  const filteredOrders = orderFilter === '전체'
    ? orderList
    : (orderFilterMap[orderFilter] ?? []).length > 0
      ? orderList.filter((o) => (orderFilterMap[orderFilter] ?? []).includes(o.status))
      : [];
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    const updated = await getAllOrdersUpdateAction(orderId, { status });
    setOrderList(updated);
  };
  const handleTrackingSave = async (orderId: string) => {
    const num = (trackingInputs[orderId] ?? '').trim();
    const courier = courierInputs[orderId] ?? '';
    if (!num) { alert('송장번호를 입력해주세요.'); return; }
    if (!courier) { alert('택배사를 선택해주세요.'); return; }
    const updated = await getAllOrdersUpdateAction(orderId, { trackingNumber: num, courier, status: '배송중' });
    setOrderList(updated);
    setTrackingInputs((prev) => ({ ...prev, [orderId]: '' }));
  };

  // ----- category management -----
  const [categoryList, setCategoryList] = useState<CategoryData[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  useEffect(() => {
    getCategoriesAction().then(setCategoryList);
  }, []);

  const notifyCategories = () => window.dispatchEvent(new Event('wtCategoriesChanged'));

  const openAddCategory = () => { setEditingCategory(null); setShowCategoryModal(true); };
  const openEditCategory = (cat: CategoryData) => { setEditingCategory(cat); setShowCategoryModal(true); };
  const closeCategoryModal = () => { setShowCategoryModal(false); setEditingCategory(null); };

  const handleSaveCategory = async (cat: CategoryData) => {
    const result = editingCategory
      ? await updateCategoryAction(editingCategory.name, cat)
      : await addCategoryAction(cat);
    if (result.error) { alert(result.error); return; }
    setCategoryList(result.categories);
    closeCategoryModal();
    notifyCategories();
  };

  const handleDeleteCategory = async (name: string) => {
    if (!window.confirm(`"${name}" 카테고리를 삭제하시겠습니까?`)) return;
    const updated = await deleteCategoryAction(name);
    setCategoryList(updated);
    notifyCategories();
  };

  // ----- dashboard stats -----
  const today = new Date().toISOString().slice(0, 10);
  const stats = useMemo(
    () => {
      const todayOrders = orderList.filter((o) => o.date.slice(0, 10) === today && o.status !== '주문취소');
      const todayRevenue = todayOrders.reduce((s, o) => s + o.totalPrice, 0);
      return [
        { label: '오늘 판매량', value: `${todayOrders.length}건`, bg: '#0041BD' },
        { label: '오늘 매출', value: `${todayRevenue.toLocaleString()}원`, bg: '#F5C400', color: '#111' },
        { label: '전체 상품 수', value: String(productList.length), bg: '#0041BD' },
        { label: '전체 주문 수', value: `${orderList.filter((o) => o.status !== '주문취소').length}건`, bg: '#F5C400', color: '#111' },
      ];
    },
    [productList.length, orderList, today]
  );
  const detailStats = useMemo(() => [
    { label: '신규 주문', value: `${orderList.filter((o) => o.status === '주문완료').length}건` },
    { label: '배송중', value: `${orderList.filter((o) => o.status === '배송중').length}건` },
    { label: '배송완료', value: `${orderList.filter((o) => o.status === '배송완료').length}건` },
    { label: '주문취소', value: `${orderList.filter((o) => o.status === '주문취소').length}건` },
    { label: '전체 회원', value: `${userList.length}명` },
    { label: '전체 카테고리', value: `${categoryList.length}개` },
  ], [orderList, userList.length, categoryList.length]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'dashboard', label: '대시보드' },
    { key: 'orders', label: '주문 관리' },
    { key: 'products', label: '상품 관리' },
    { key: 'categories', label: '카테고리 관리' },
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
              onClick={() => switchTab(item.key)}
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
                  <span style={{ background: '#F5C400', color: '#111', padding: '8px 14px', borderRadius: '12px', fontWeight: 800, fontSize: '12px' }}>실시간 업데이트</span>
                  <span style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', padding: '8px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>관리자 전용</span>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div style={cardStyle}>
            <div style={{ marginBottom: '20px' }}>
              <h2 className="adm-section-title" style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>주문 관리</h2>
              <p style={{ color: '#555', margin: '6px 0 0', fontSize: '14px' }}>전체 주문 내역을 확인하고 발송 처리할 수 있습니다.</p>
            </div>

            {/* 상태 필터 바 */}
            {orderList.filter((o) => o.status !== '주문취소').length > 0 && (
              <div style={{ background: '#FFF9E6', border: '1.5px solid #F5C400', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#7a6000', margin: '0 0 14px' }}>📦 배송 처리를 진행해주세요</p>
                <div className="ord-filter-bar" style={{ display: 'flex', gap: '0', overflowX: 'auto' }}>
                  {[
                    { label: '전체', statuses: null },
                    { label: '결제완료',   statuses: ['주문완료'] },
                    { label: '상품준비중', statuses: ['발주확인', '배송준비중'] },
                    { label: '배송지시',   statuses: [] },
                    { label: '배송중',     statuses: ['배송중'] },
                    { label: '배송완료',   statuses: ['배송완료'] },
                  ].map((f, i, arr) => {
                    const count = f.statuses === null
                      ? orderList.filter((o) => o.status !== '주문취소').length
                      : f.statuses.length === 0 ? 0
                        : orderList.filter((o) => (f.statuses as string[]).includes(o.status)).length;
                    const isActive = orderFilter === f.label;
                    const isLast = i === arr.length - 1;
                    return (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => setOrderFilter(f.label)}
                        style={{
                          flex: 1,
                          minWidth: '80px',
                          padding: '10px 8px',
                          background: isActive ? '#111' : '#fff',
                          color: isActive ? '#F5C400' : '#555',
                          border: '1px solid #e5e7eb',
                          borderRight: isLast ? '1px solid #e5e7eb' : 'none',
                          borderRadius: i === 0 ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : '0',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          lineHeight: 1.3,
                          transition: 'background .15s, color .15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {f.label}<br />
                        <span style={{ fontSize: '18px', fontWeight: 900, color: isActive ? '#F5C400' : '#111' }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', padding: '40px 0', fontSize: '14px' }}>
                {orderList.length === 0 ? '주문 내역이 없습니다.' : `'${orderFilter}' 상태의 주문이 없습니다.`}
              </p>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {filteredOrders.map((order) => {
                  const statusMeta: Record<string, { bg: string; color: string }> = {
                    '주문완료':   { bg: '#FFF9E6', color: '#7a6000' },
                    '발주확인':   { bg: '#E8F0FF', color: '#0041BD' },
                    '배송준비중': { bg: '#EEF2FF', color: '#3730A3' },
                    '배송중':     { bg: '#ECFDF5', color: '#065F46' },
                    '배송완료':   { bg: '#F3F4F6', color: '#374151' },
                    '주문취소':   { bg: '#FFF1F2', color: '#BE123C' },
                  };
                  const sm = statusMeta[order.status] ?? { bg: '#eee', color: '#555' };
                  const dateStr = new Date(order.date).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                  const isCancelled = order.status === '주문취소';
                  const isDone = order.status === '배송완료';
                  return (
                    <div key={order.id} style={{ border: '1.5px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>

                      {/* ── 상단 헤더 바 ── */}
                      <div style={{ background: '#f8f9fc', borderBottom: '1px solid #e5e7eb', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#111', fontFamily: 'monospace' }}>{order.id}</span>
                          <span style={{ fontSize: '11px', color: '#888' }}>{dateStr}</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', background: sm.bg, color: sm.color }}>{order.status}</span>
                      </div>

                      {/* ── 본문 ── */}
                      <div style={{ padding: '16px' }}>

                        {/* 상품 정보 */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                          <div style={{ width: '64px', height: '64px', background: '#f4f6fb', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                            {order.productImage
                              ? <img src={order.productImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: '24px' }}>📦</div>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.4 }}>{order.productName}</p>
                            {order.optionLabel && <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px' }}>옵션: {order.optionLabel}</p>}
                            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>수량 {order.qty}개 · <strong style={{ color: '#111', fontSize: '14px' }}>{order.totalPrice.toLocaleString()}원</strong></p>
                          </div>
                        </div>

                        {/* 주문자 / 배송지 */}
                        <div className="ord-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', margin: '0 0 6px', letterSpacing: '0.06em' }}>주문자</p>
                            <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>{order.buyerName ?? '-'}</p>
                            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{order.buyerPhone ?? '-'}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', margin: '0 0 6px', letterSpacing: '0.06em' }}>수령인</p>
                            <p style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>{order.recipientName ?? '-'}</p>
                            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{order.recipientPhone ?? '-'}</p>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', margin: '0 0 4px', letterSpacing: '0.06em' }}>배송지</p>
                            <p style={{ fontSize: '13px', color: '#111', margin: 0 }}>{order.address ?? '-'}</p>
                          </div>
                          {order.request && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <p style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', margin: '0 0 4px', letterSpacing: '0.06em' }}>배송 요청사항</p>
                              <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{order.request}</p>
                            </div>
                          )}
                          {order.trackingNumber && (
                            <div style={{ gridColumn: '1 / -1', background: '#EEF2FF', borderRadius: '8px', padding: '10px 12px' }}>
                              <p style={{ fontSize: '11px', fontWeight: 700, color: '#3730A3', margin: '0 0 2px', letterSpacing: '0.06em' }}>
                                {order.courier ? `[${order.courier}] ` : ''}송장번호
                              </p>
                              <p style={{ fontSize: '15px', fontWeight: 900, color: '#0041BD', margin: 0, fontFamily: 'monospace' }}>{order.trackingNumber}</p>
                            </div>
                          )}
                        </div>

                        {/* 발송 처리 영역 */}
                        {!isCancelled && !isDone && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* 택배사 + 송장번호 — 주문완료(결제완료) 단계에서는 불필요 */}
                            {order.status !== '주문완료' && <div className="ord-ship-row" style={{ display: 'flex', gap: '8px' }}>
                              <select
                                value={courierInputs[order.id] ?? ''}
                                onChange={(e) => setCourierInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                style={{ padding: '9px 10px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '13px', fontWeight: 600, outline: 'none', background: '#fff', flexShrink: 0 }}
                              >
                                <option value="">택배사 선택</option>
                                <option>CJ대한통운</option>
                                <option>한진택배</option>
                                <option>롯데택배</option>
                                <option>우체국택배</option>
                                <option>로젠택배</option>
                                <option>경동택배</option>
                                <option>대신택배</option>
                                <option>일양로지스</option>
                                <option>직접발송</option>
                              </select>
                              <input
                                type="text"
                                placeholder="송장번호 입력"
                                value={trackingInputs[order.id] ?? ''}
                                onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order.id]: e.target.value }))}
                                style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: '8px', fontSize: '13px', outline: 'none', minWidth: 0 }}
                              />
                              <button type="button" onClick={() => handleTrackingSave(order.id)}
                                style={{ padding: '9px 16px', background: '#0041BD', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                발송 처리
                              </button>
                            </div>}

                            {/* 상태 전환 버튼 */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {order.status === '주문완료' && (
                                <button type="button" onClick={() => handleOrderStatusChange(order.id, '발주확인')}
                                  style={{ padding: '8px 14px', background: '#0041BD', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                  발주확인 처리
                                </button>
                              )}
                              {order.status === '발주확인' && (
                                <button type="button" onClick={() => handleOrderStatusChange(order.id, '배송준비중')}
                                  style={{ padding: '8px 14px', background: '#3730A3', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                  배송준비 처리
                                </button>
                              )}
                              {order.status === '배송중' && (
                                <button type="button" onClick={() => handleOrderStatusChange(order.id, '배송완료')}
                                  style={{ padding: '8px 14px', background: '#065F46', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                  배송완료 처리
                                </button>
                              )}
                              {(() => {
                                const prevMap: Partial<Record<Order['status'], Order['status']>> = {
                                  '발주확인':   '주문완료',
                                  '배송준비중': '발주확인',
                                  '배송중':     '배송준비중',
                                  '배송완료':   '배송중',
                                };
                                const prev = prevMap[order.status];
                                return prev ? (
                                  <button type="button" onClick={() => { if (!confirm(`'${prev}'(으)로 되돌리겠습니까?`)) return; handleOrderStatusChange(order.id, prev); }}
                                    style={{ padding: '8px 14px', background: '#fff', color: '#555', border: '1.5px solid #ccc', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                    ← 이전 단계
                                  </button>
                                ) : null;
                              })()}
                              <button type="button" onClick={() => { if (!confirm('주문을 취소하시겠습니까?')) return; handleOrderStatusChange(order.id, '주문취소'); }}
                                style={{ padding: '8px 14px', background: '#fff', color: '#BE123C', border: '1.5px solid #BE123C', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                                취소 처리
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 배송완료 or 취소 상태 안내 */}
                        {(isDone || isCancelled) && (
                          <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center', padding: '8px 0 0' }}>
                            {isDone ? '✅ 배송이 완료된 주문입니다.' : '❌ 취소된 주문입니다.'}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
                      {product.image ? (
                        <img src={product.image} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f4f6fb', display: 'grid', placeItems: 'center', fontSize: '22px', flexShrink: 0 }}>📦</div>
                      )}
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

        {tab === 'categories' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <h2 className="adm-section-title" style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>카테고리 관리</h2>
                <p style={{ color: '#555', margin: '6px 0 0', fontSize: '14px' }}>쇼핑몰 카테고리를 추가, 수정, 삭제할 수 있습니다.</p>
              </div>
              <button type="button" onClick={openAddCategory} style={primaryButtonStyle}>새 카테고리 추가</button>
            </div>

            {showCategoryModal && (
              <CategoryFormModal category={editingCategory} onClose={closeCategoryModal} onSave={handleSaveCategory} />
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
              {categoryList.length === 0 ? (
                <p style={{ color: '#666' }}>등록된 카테고리가 없습니다.</p>
              ) : (
                categoryList.map((cat) => (
                  <div key={cat.name} className="adm-list-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', border: '1px solid rgba(0,0,0,.08)', borderRadius: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                      background: cat.bg, border: cat.border ? '2px solid #111' : 'none',
                      display: 'grid', placeItems: 'center', fontSize: '24px',
                    }}>
                      {cat.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{cat.name}</p>
                      <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>{cat.en}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button type="button" onClick={() => openEditCategory(cat)} style={ghostButtonStyle}>수정</button>
                      <button type="button" onClick={() => handleDeleteCategory(cat.name)} style={dangerButtonStyle}>삭제</button>
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
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
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
          .ord-info-grid { grid-template-columns: 1fr !important; }
          .ord-ship-row { flex-direction: column !important; }
          .ord-ship-row select { width: 100%; }
          .ord-filter-bar { scrollbar-width: none; }
          .ord-filter-bar::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '11px', fontWeight: 700, color: '#aaa', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: highlight ? 800 : 500, color: highlight ? '#0041BD' : '#111' }}>{value}</span>
    </div>
  );
}
