'use client';

import { products } from './products';

export default function Home() {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      {/* TOP UTILITY BAR */}
      <div style={{ background: '#111', color: '#fff', fontSize: '13px' }}>
        <div className="wt-container wt-topbar" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '18px', height: '38px' }}>
          <span style={{ marginRight: 'auto', opacity: 0.82, fontWeight: '600', letterSpacing: '0.02em' }}>고객센터 1588-0000 · 평일 10:00–18:00</span>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>로그인</a>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>회원가입</a>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>주문조회</a>
          <a href="#" className="wt-topbar-link" style={{ opacity: 0.82, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}>고객센터</a>
        </div>
      </div>

      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '2px solid #111' }}>
        <div className="wt-container wt-header-row" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: '28px', height: '84px' }}>
          <a href="#" className="wt-logo-link" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" className="wt-logo-img" style={{ height: '68px', width: 'auto' }} />
          </a>
          <div className="wt-search" style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2.5px solid #111', borderRadius: '999px', padding: '11px 8px 11px 20px', maxWidth: '520px', minWidth: 0 }}>
            <input
              type="text"
              placeholder="사료, 간식, 장난감, 산책용품 검색"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: '15px', background: 'transparent' }}
            />
            <button style={{ background: '#0041BD', width: '38px', height: '38px', borderRadius: '50%', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: '18px' }}>🔍</span>
            </button>
          </div>
          <div className="wt-header-icons" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
            <button style={{ position: 'relative', display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '25px' }}>❤️</button>
            <button style={{ position: 'relative', display: 'grid', placeItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: '25px' }}>
              🛒
              <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#0041BD', color: '#fff', fontSize: '11px', fontWeight: '800', minWidth: '18px', height: '18px', borderRadius: '9px', display: 'grid', placeItems: 'center', padding: '0 4px' }}>2</span>
            </button>
          </div>
        </div>
        {/* CATEGORY NAV */}
        <nav style={{ borderTop: '1px solid rgba(17,17,17,.14)' }}>
          <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '6px', height: '52px', alignItems: 'center', overflowX: 'auto' }}>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#0041BD', textDecoration: 'none' }}>신상품</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>베스트</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>사료·간식</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>영양제</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>목욕·미용</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>산책·하네스</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>배변·위생</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: 'inherit', textDecoration: 'none' }}>장난감</a>
            <a href="#" style={{ fontWeight: 700, fontSize: '15px', padding: '8px 14px', borderRadius: '999px', whiteSpace: 'nowrap', color: '#0041BD', textDecoration: 'none' }}>정기배송</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section style={{ background: '#0041BD', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="wt-container wt-hero-grid" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: '40px', alignItems: 'center', paddingTop: '64px', paddingBottom: '64px', minHeight: '480px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.14em', marginBottom: '18px', color: '#FFDC20' }}>FOR A HAPPIER WALK</p>
            <h1 className="wt-h1-hero" style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-0.03em' }}>
              우리 강아지의 하루를<br />
              <span style={{ color: '#FFDC20' }}>더 신나게.</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.92, marginBottom: '32px', lineHeight: '1.6', maxWidth: '430px' }}>
              매일 쓰는 것부터 가끔 필요한 것까지. 꼬리가 흔들리는 진짜 좋은 것들만 골라 담았어요.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button style={{
                background: '#FFDC20',
                color: '#111',
                fontWeight: 800,
                fontSize: '16px',
                padding: '15px 26px',
                borderRadius: '999px',
                border: '2.5px solid #111',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #111'
              }}>
                신상품 구경하기 →
              </button>
              <button style={{
                background: '#fff',
                color: '#111',
                fontWeight: 800,
                fontSize: '16px',
                padding: '15px 26px',
                borderRadius: '999px',
                border: '2.5px solid #111',
                cursor: 'pointer'
              }}>
                정기배송 알아보기
              </button>
            </div>
          </div>
          
          <div style={{ background: '#fff', border: '3px solid #111', borderRadius: '24px', padding: '26px', color: '#111', position: 'relative', boxShadow: '14px 14px 0 #FFDC20', aspectRatio: '1', display: 'flex', flexDirection: 'column' }}>
            <span style={{ position: 'absolute', top: '-16px', left: '24px', background: '#111', color: '#fff', fontWeight: 800, fontSize: '12px', letterSpacing: '0.1em', padding: '7px 14px', borderRadius: '999px' }}>이번 주 BEST</span>
            <div style={{ flex: 1, minHeight: 0, borderRadius: '14px', background: '#f4f6fb', display: 'grid', placeItems: 'center', marginBottom: '18px', overflow: 'hidden' }}>
              <div style={{ fontSize: '60px' }}>🛏️</div>
            </div>
            <h3 style={{ fontSize: '21px', fontWeight: 800, letterSpacing: '-0.02em' }}>포근 도넛 베드</h3>
            <p style={{ fontSize: '14px', color: '#555', margin: '5px 0 16px' }}>사계절 쓰는 분리형 커버 · S/M/L</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', background: '#FFDC20', color: '#111', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.02em', padding: '8px 14px 8px 26px', borderRadius: '6px', border: '2px solid #111' }}>
                39,900<span style={{ fontSize: '13px', fontWeight: 800, marginLeft: '2px' }}>원</span>
              </span>
              <button style={{
                background: '#0041BD',
                color: '#fff',
                fontWeight: 800,
                fontSize: '16px',
                padding: '11px 18px',
                borderRadius: '999px',
                border: '2.5px solid #111',
                cursor: 'pointer',
                boxShadow: '0 4px 0 #111'
              }}>
                담기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section style={{ padding: '64px 0', background: '#fff' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '10px', color: '#0041BD' }}>SHOP BY CATEGORY</p>
              <h2 className="wt-h2" style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05' }}>무엇이 필요하세요?</h2>
            </div>
            <a href="#" style={{ fontWeight: 800, fontSize: '15px', color: '#0041BD', textDecoration: 'underline' }}>전체 카테고리 →</a>
          </div>
          
          <div className="wt-grid-cat" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { name: '사료·간식', en: 'Food & Treats', emoji: '🥩', bg: '#0041BD', textColor: '#fff' },
              { name: '영양제', en: 'Supplements', emoji: '💊', bg: '#FFDC20', textColor: '#111' },
              { name: '목욕·미용', en: 'Bath & Care', emoji: '🛁', bg: '#fff', textColor: '#111', border: true },
              { name: '산책·하네스', en: 'Walk & Harness', emoji: '🐕', bg: '#fff', textColor: '#111', border: true },
              { name: '배변·위생', en: 'Hygiene', emoji: '📦', bg: '#fff', textColor: '#111', border: true },
              { name: '장난감', en: 'Toys', emoji: '🎾', bg: '#fff', textColor: '#111', border: true },
              { name: '하우스·침구', en: 'Bed & House', emoji: '🏠', bg: '#fff', textColor: '#111', border: true },
              { name: '정기배송', en: 'Subscribe', emoji: '⏰', bg: '#0041BD', textColor: '#fff' },
            ].map((cat, idx) => (
              <a key={idx} href="#" className="wt-cat-card" style={{
                border: cat.border ? '2.5px solid #111' : 'none',
                borderRadius: '18px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                minHeight: '130px',
                justifyContent: 'space-between',
                background: cat.bg,
                color: cat.textColor,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 0 #111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div className="wt-cat-emoji" style={{ fontSize: '52px' }}>{cat.emoji}</div>
                <div>
                  <div className="wt-cat-en" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6 }}>{cat.en}</div>
                  <div className="wt-cat-name" style={{ fontSize: '19px', fontWeight: 800, letterSpacing: '-0.02em' }}>{cat.name}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section style={{ padding: '64px 0', background: '#fff' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '12px', color: '#0041BD' }}>JUST DROPPED</p>
              <h2 className="wt-h2" style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05' }}>이번 주 신상품</h2>
            </div>
            <a href="#" style={{ fontWeight: 800, fontSize: '15px', color: '#0041BD', textDecoration: 'underline' }}>신상품 전체보기 →</a>
          </div>
          
          <div className="wt-grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {products.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="wt-prod-card"
                style={{
                  border: '2px solid rgba(17,17,17,.14)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#111';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 0 rgba(17,17,17,.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(17,17,17,.14)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="wt-prod-img" style={{ aspectRatio: '1', background: '#f4f6fb', display: 'grid', placeItems: 'center', position: 'relative' }}>
                  <div className="wt-prod-emoji" style={{ fontSize: '80px' }}>{p.image}</div>
                </div>
                <div className="wt-prod-body" style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
                  <p className="wt-prod-cat" style={{ fontSize: '12px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em' }}>{p.category}</p>
                  <h3 className="wt-prod-name" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.34' }}>{p.name}</h3>
                  <p className="wt-prod-desc" style={{ fontSize: '13px', color: '#666' }}>{p.desc}</p>
                  <div className="wt-prod-price-row" style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="wt-prod-price" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                      {p.price.toLocaleString()}
                      <span className="wt-prod-won" style={{ fontSize: '14px', fontWeight: 800 }}>원</span>
                    </span>
                  </div>
                  <button className="wt-prod-btn" style={{
                    background: '#FFDC20',
                    border: '2px solid #111',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '13px',
                    marginTop: '8px'
                  }}>
                    담기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION BAND */}
      <section style={{ background: '#FFDC20' }}>
        <div className="wt-container wt-grid-sub" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '40px', alignItems: 'center', paddingTop: '72px', paddingBottom: '72px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '14px', color: '#0041BD' }}>AUTO DELIVERY</p>
            <h2 className="wt-h2-sub" style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.04', marginBottom: '18px' }}>매달 쓰는 건,<br />알아서 도착하게.</h2>
            <p style={{ fontSize: '17px', maxWidth: '430px', marginBottom: '28px', fontWeight: 500 }}>모래·패드·사료처럼 어차피 매달 쓰는 것들. 주기만 정해두면 잊지 않고 챙겨드려요. 정기배송은 언제든 건너뛰기·해지가 가능합니다.</p>
            <button style={{
              background: '#0041BD',
              color: '#fff',
              fontWeight: 800,
              fontSize: '16px',
              padding: '15px 26px',
              borderRadius: '999px',
              border: '2.5px solid #111',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #111'
            }}>
              정기배송 시작하기 →
            </button>
          </div>
          <div style={{ display: 'grid', gap: '14px' }}>
            {[
              { num: '1', title: '상품과 주기 선택', desc: '2·4·6주 중 우리 집 속도에 맞게' },
              { num: '2', title: '매번 최대 15% 할인', desc: '정기배송 전용가 + 무료배송' },
              { num: '3', title: '부담 없이 관리', desc: '건너뛰기·날짜 변경·해지 자유롭게' },
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', border: '2.5px solid #111', borderRadius: '16px', padding: '18px 22px' }}>
                <div style={{ width: '42px', height: '42px', flex: 'none', background: '#0041BD', color: '#fff', borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '18px' }}>{step.num}</div>
                <div>
                  <b style={{ display: 'block', fontSize: '16px', fontWeight: 800 }}>{step.title}</b>
                  <span style={{ fontSize: '14px', color: '#444' }}>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section style={{ background: '#0041BD', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '96px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '18px', color: '#FFDC20', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>OUR PROMISE</p>
          <h2 className="wt-h2-promise" style={{ fontSize: '52px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.1', maxWidth: '760px', margin: '0 auto 22px' }}>
            강아지 입장에서 한 번 더 생각합니다.<br />
            <span style={{ color: '#FFDC20' }}>꼬리가 답이니까요.</span>
          </h2>
          <p style={{ fontSize: '17px', opacity: 0.9, maxWidth: '540px', margin: '0 auto 34px' }}>WAGGLE TAIL은 보호자가 아니라 강아지의 하루를 기준으로 제품을 고릅니다. 좋은 성분, 편한 사용, 솔직한 가격. 셋 다 만족하지 못하면 판매하지 않아요.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ border: '2px solid rgba(255,255,255,.5)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>🦴 까다로운 성분 기준</span>
            <span style={{ border: '2px solid rgba(255,255,255,.5)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>📦 투명한 정가</span>
            <span style={{ border: '2px solid rgba(255,255,255,.5)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>🔁 부담 없는 교환·환불</span>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '84px 0', background: '#fff' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '34px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '12px', color: '#0041BD' }}>REAL REVIEWS</p>
              <h2 className="wt-h2" style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05' }}>보호자들의 진짜 후기</h2>
            </div>
            <a href="#" style={{ fontWeight: 800, fontSize: '15px', color: '#0041BD', textDecoration: 'underline' }}>리뷰 더보기 →</a>
          </div>
          
          <div className="wt-grid-reviews" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { ava: '콩', name: '콩이맘', dog: '포메라니안 · 3살', rate: 5.0, text: '도넛 베드 안에서 안 나와요. 커버 분리돼서 세탁도 편하고, 솜이 빵빵해서 한 달 써도 안 꺼졌어요.', tag: '포근 도넛 베드' },
              { ava: '두', name: '두부아빠', dog: '웰시코기 · 5살', rate: 4.8, text: '정기배송으로 패드 받으니까 떨어질 일이 없네요. 깜빡하던 사람인데 이건 진짜 편합니다. 할인까지 되니 만족.', tag: '정기배송 · 배변패드' },
              { ava: '몽', name: '몽실이네', dog: '말티즈 · 2살', rate: 5.0, text: '작은 강아지라 사이즈가 중요했는데, XS가 정확히 딱 맞네요. 내구성도 좋아서 3개월째 잘 쓰고 있습니다.', tag: '따뜻한 겨울 후드' },
            ].map((review, idx) => (
              <div key={idx} style={{ border: '2.5px solid #111', borderRadius: '18px', padding: '24px', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFDC20', border: '2px solid #111', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px' }}>{review.ava}</div>
                  <div style={{ flex: 1 }}>
                    <b style={{ display: 'block', fontSize: '15px', fontWeight: 800 }}>{review.name}</b>
                    <span style={{ fontSize: '13px', color: '#777' }}>{review.dog}</span>
                  </div>
                  <div style={{ color: '#0041BD', fontWeight: 900, fontSize: '15px' }}>★ {review.rate}</div>
                </div>
                <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>{review.text}</p>
                <span style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(0,65,189,.08)', color: '#0041BD', padding: '6px 12px', borderRadius: '999px', display: 'inline-block' }}>{review.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', color: '#fff', padding: '64px 0 40px' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="wt-grid-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', paddingBottom: '44px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '12px 14px', display: 'inline-block', marginBottom: '16px' }}>
                <img src="https://i.imgur.com/ETPci5p.png" alt="WAGGLE TAIL" style={{ height: '34px', width: 'auto' }} />
              </div>
              <p style={{ fontSize: '14px', color: '#b9bdc7', maxWidth: '300px', lineHeight: '1.6' }}>꼬리가 흔들리는 진짜 좋은 것들. 강아지의 하루를 기준으로 만드는 셀렉트숍입니다.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.02em' }}>쇼핑</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>전체 상품</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>신상품</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', textDecoration: 'none' }}>베스트</a>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.02em' }}>정보</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>회사소개</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>이용약관</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', textDecoration: 'none' }}>개인정보</a>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px', letterSpacing: '0.02em' }}>고객지원</h4>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>FAQ</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', marginBottom: '11px', textDecoration: 'none' }}>배송안내</a>
              <a href="#" style={{ display: 'block', fontSize: '14px', color: '#b9bdc7', textDecoration: 'none' }}>반품·교환</a>
            </div>
          </div>
          <div style={{ paddingTop: '28px', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '12.5px', color: '#8b909c', lineHeight: '1.8', maxWidth: '680px' }}>
              © 2026 WAGGLE TAIL. All rights reserved.<br />
              WAGGLE TAIL은 보호자가 아니라 강아지의 하루를 기준으로 제품을 고릅니다.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', display: 'grid', placeItems: 'center', fontSize: '20px' }}>📘</a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', display: 'grid', placeItems: 'center', fontSize: '20px' }}>📷</a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,.25)', display: 'grid', placeItems: 'center', fontSize: '20px' }}>🐦</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* Tablet */
        @media (max-width: 1024px) {
          .wt-grid-reviews {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .wt-grid-footer {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        /* Small tablet / large phone */
        @media (max-width: 768px) {
          .wt-hero-grid {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .wt-grid-sub {
            grid-template-columns: 1fr !important;
          }
          .wt-h1-hero {
            font-size: 34px !important;
          }
          .wt-h2-sub {
            font-size: 32px !important;
          }
          .wt-h2-promise {
            font-size: 34px !important;
          }
          .wt-h2 {
            font-size: 28px !important;
          }
        }

        /* Phone */
        @media (max-width: 640px) {
          .wt-container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .wt-grid-cat {
            gap: 8px !important;
          }
          .wt-cat-card {
            padding: 10px 8px !important;
            min-height: 96px !important;
            gap: 6px !important;
            border-radius: 12px !important;
          }
          .wt-cat-emoji {
            font-size: 28px !important;
          }
          .wt-cat-en {
            font-size: 8px !important;
          }
          .wt-cat-name {
            font-size: 12px !important;
          }
          .wt-grid-products {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .wt-prod-card {
            border-radius: 10px !important;
          }
          .wt-prod-emoji {
            font-size: 28px !important;
          }
          .wt-prod-body {
            padding: 8px 6px 10px !important;
            gap: 4px !important;
          }
          .wt-prod-cat {
            font-size: 8px !important;
          }
          .wt-prod-name {
            font-size: 11px !important;
            line-height: 1.25 !important;
          }
          .wt-prod-desc {
            display: none !important;
          }
          .wt-prod-price {
            font-size: 13px !important;
          }
          .wt-prod-won {
            font-size: 10px !important;
          }
          .wt-prod-btn {
            font-size: 10px !important;
            padding: 5px 6px !important;
          }
          .wt-grid-reviews,
          .wt-grid-footer {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
          .wt-grid-footer > div:first-child {
            grid-column: 1 / -1 !important;
          }
          .wt-grid-footer > div:nth-child(2),
          .wt-grid-footer > div:nth-child(3),
          .wt-grid-footer > div:nth-child(4) {
            grid-column: span 1 !important;
          }
          .wt-topbar-link {
            display: none !important;
          }
          .wt-topbar {
            justify-content: flex-start !important;
          }
          .wt-header-row {
            flex-wrap: wrap !important;
            gap: 10px !important;
            height: auto !important;
            padding-top: 14px !important;
            padding-bottom: 14px !important;
            justify-content: space-between !important;
          }
          header {
            position: sticky !important;
            top: 0 !important;
            z-index: 50 !important;
          }
          .wt-logo-link {
            order: 1 !important;
            flex: none !important;
            justify-content: flex-start !important;
          }
          .wt-logo-img {
            height: 42px !important;
          }
          .wt-header-icons {
            order: 2 !important;
            margin-left: 0 !important;
            gap: 12px !important;
          }
          .wt-search {
            order: 3 !important;
            flex: 1 1 100% !important;
            max-width: none !important;
            min-width: 0 !important;
            width: 100% !important;
          }
          .wt-search input {
            font-size: 15px !important;
          }
        }

      `}</style>
    </div>
  );
}
