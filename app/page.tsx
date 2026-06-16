'use client';

export default function Home() {
  const products = [
    { id: 1, name: '포근 도넛 베드', price: 39900, category: '하우스·침구', badge: 'BEST' },
    { id: 2, name: '배변패드 프리미엄', price: 18900, category: '배변·위생', badge: 'BEST' },
    { id: 3, name: '황태 트릿 200g', price: 12900, category: '사료·간식', badge: 'NEW' },
    { id: 4, name: '오메가-3 필포켓', price: 24900, category: '영양제', badge: 'NEW' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      {/* HEADER */}
      <header style={{ borderBottom: '2px solid #111', position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '84px', gap: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0041BD' }}>🐾 WAGGLE TAIL</div>
          <input 
            type="text" 
            placeholder="검색..." 
            style={{ 
              flex: 1, 
              padding: '11px 20px', 
              border: '2.5px solid #111', 
              borderRadius: '999px',
              fontSize: '15px',
              maxWidth: '520px'
            }} 
          />
          <button style={{ fontSize: '20px', cursor: 'pointer' }}>❤️</button>
          <button style={{ fontSize: '20px', cursor: 'pointer' }}>🛒</button>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: '#0041BD', color: '#fff', padding: '64px 0', minHeight: '480px', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ maxWidth: '600px' }}>
            <p style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.14em', marginBottom: '18px', color: '#FFDC20' }}>FOR A HAPPIER WALK</p>
            <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1' }}>
              우리 강아지의 하루를<br />
              <span style={{ color: '#FFDC20' }}>더 신나게.</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '32px', lineHeight: '1.6' }}>
              매일 쓰는 것부터 가끔 필요한 것까지. 꼬리가 흔들리는 진짜 좋은 것들만 골라 담았어요.
            </p>
            <button style={{ 
              background: '#FFDC20', 
              color: '#111', 
              padding: '15px 26px', 
              border: '2.5px solid #111',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #111'
            }}>
              신상품 구경하기 →
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORY */}
      <section style={{ padding: '84px 0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '34px' }}>무엇이 필요하세요?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {['사료·간식', '영양제', '목욕·미용', '산책·하네스', '배변·위생', '장난감', '하우스·침구', '정기배송'].map((cat, i) => (
              <div 
                key={i}
                style={{
                  background: i % 2 === 0 ? '#0041BD' : '#FFDC20',
                  color: i % 2 === 0 ? '#fff' : '#111',
                  border: '2.5px solid #111',
                  borderRadius: '18px',
                  padding: '24px',
                  minHeight: '172px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '52px' }}>
                  {i === 0 ? '🍖' : i === 1 ? '💊' : i === 2 ? '🚿' : i === 3 ? '🐕' : i === 4 ? '📦' : i === 5 ? '🎾' : i === 6 ? '🛏️' : '🔄'}
                </div>
                <div style={{ fontSize: '19px', fontWeight: '800' }}>{cat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ padding: '84px 0', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '34px' }}>이번 주 신상품</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {products.slice(2, 4).map((p) => (
              <div 
                key={p.id}
                style={{
                  border: '2px solid #ddd',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#111';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ aspectRatio: '1/1', background: '#f0f4fb', display: 'grid', placeItems: 'center', position: 'relative' }}>
                  <span style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    background: '#0041BD', 
                    color: '#fff', 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    padding: '5px 10px', 
                    borderRadius: '7px' 
                  }}>
                    {p.badge}
                  </span>
                  <div style={{ fontSize: '80px' }}>
                    {p.id === 3 ? '🥩' : '💊'}
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '12px', color: '#0041BD', fontWeight: '700', marginBottom: '7px' }}>{p.category}</p>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>{p.name}</h3>
                  <div style={{ fontSize: '20px', fontWeight: '900' }}>
                    {p.price.toLocaleString()}
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION */}
      <section style={{ background: '#FFDC20', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '32px' }}>
            매달 쓰는 건,<br />알아서 도착하게.
          </h2>
          <p style={{ fontSize: '17px', marginBottom: '28px', maxWidth: '430px' }}>
            모래·패드·사료처럼 어차피 매달 쓰는 것들. 주기만 정해두면 잊지 않고 챙겨드려요.
          </p>
          <button style={{ 
            background: '#0041BD', 
            color: '#fff', 
            padding: '15px 26px', 
            border: '2.5px solid #111',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #111'
          }}>
            정기배송 시작하기 →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', color: '#fff', padding: '64px 24px 40px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px', paddingBottom: '44px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px' }}>WAGGLE TAIL</h4>
              <p style={{ fontSize: '14px', color: '#b9bdc7' }}>꼬리가 흔들리는 진짜 좋은 것들. 강아지의 하루를 기준으로 만드는 셀렉트숍입니다.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px' }}>쇼핑</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px' }}>신상품</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px' }}>베스트</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7' }}>정기배송</a>
            </div>
          </div>
          <div style={{ paddingTop: '28px', fontSize: '12px', color: '#8b909c' }}>
            © 2026 WAGGLE TAIL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}