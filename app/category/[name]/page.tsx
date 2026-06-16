import Link from 'next/link';
import { products } from '../../products';

const categories = [
  '베드',
  '간식',
  '영양제',
  '산책용품',
  '배변·위생',
  '의류',
  '장난감',
  '목욕·미용',
];

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const filteredProducts = products.filter((product) => product.category === categoryName);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      <section style={{ padding: '64px 0', background: '#fff' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '34px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '12px', color: '#0041BD' }}>CATEGORY</p>
              <h1 className="wt-h2" style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0 }}>{categoryName}</h1>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7 }}>해당 카테고리에 제품이 없습니다.</p>
          ) : (
            <div className="wt-grid-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div
                    className="wt-prod-card"
                    style={{
                      border: '2px solid rgba(17,17,17,.14)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="wt-prod-img" style={{ aspectRatio: '1', background: '#f4f6fb', display: 'grid', placeItems: 'center', position: 'relative' }}>
                      <div className="wt-prod-emoji" style={{ fontSize: '80px' }}>{product.image}</div>
                    </div>
                    <div className="wt-prod-body" style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
                      <p className="wt-prod-cat" style={{ fontSize: '12px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em' }}>{product.category}</p>
                      <h3 className="wt-prod-name" style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.34' }}>{product.name}</h3>
                      <p className="wt-prod-desc" style={{ fontSize: '13px', color: '#666' }}>{product.desc}</p>
                      <div className="wt-prod-price-row" style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="wt-prod-price" style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                          {product.price.toLocaleString()}
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
