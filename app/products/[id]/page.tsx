import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '../../products';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((item) => String(item.id) === id);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>
      <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '34px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '12px', color: '#0041BD' }}>PRODUCT DETAIL</p>
            <h1 className="wt-h2" style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0 }}>{product.name}</h1>
          </div>
          <Link href="/" style={{ fontWeight: 800, fontSize: '15px', color: '#0041BD', textDecoration: 'underline' }}>홈으로</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          <div style={{ background: '#f4f6fb', borderRadius: '24px', display: 'grid', placeItems: 'center', minHeight: '420px' }}>
            <div style={{ fontSize: '140px' }}>{product.image}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em' }}>{product.category}</span>
            <div>
              <p style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 18px', lineHeight: 1.05 }}>{product.name}</p>
              <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.8, margin: 0 }}>{product.desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '32px', fontWeight: 900 }}>{product.price.toLocaleString()}</span>
              <span style={{ fontSize: '18px', fontWeight: 800 }}>원</span>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button style={{ background: '#FFDC20', border: '2px solid #111', borderRadius: '12px', padding: '16px 24px', fontWeight: 800, cursor: 'pointer', fontSize: '16px' }}>구매하기</button>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #111', borderRadius: '12px', padding: '16px 24px', fontWeight: 800, textDecoration: 'none', color: '#111' }}>뒤로가기</Link>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
