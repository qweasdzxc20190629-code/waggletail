import Link from 'next/link';
import { getDisplayPrice } from '../../products';
import { getProductsAction } from '../../products-actions';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const allProducts = await getProductsAction();
  const filteredProducts = allProducts.filter((product) => product.category === categoryName);

  const categoryBanners: Record<string, { mobile: string; pc: string }> = {
    '리드줄': { mobile: 'https://i.imgur.com/E6N8Th2.jpeg', pc: 'https://i.imgur.com/E6N8Th2.jpeg' },
  };
  const bannerImage = categoryBanners[categoryName];

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111' }}>
      {bannerImage && (
        <picture style={{ display: 'block', lineHeight: 0 }}>
          <source media="(min-width: 769px)" srcSet={bannerImage.pc} />
          <img src={bannerImage.mobile} alt="" style={{ width: '100%', display: 'block', height: 'auto' }} />
        </picture>
      )}
      <section style={{ padding: '48px 0 64px', background: '#fff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '10px', color: '#0041BD', fontFamily: "'Pretendard', sans-serif" }}>CATEGORY</p>
            <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0, fontFamily: "'Pretendard', sans-serif", color: '#3a3a3a' }}>{categoryName}</h1>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>총 {filteredProducts.length}개 상품</p>
          </div>

          {filteredProducts.length === 0 ? (
            <p style={{ fontSize: '16px', color: '#555', lineHeight: 1.7 }}>해당 카테고리에 제품이 없습니다.</p>
          ) : (
            <div className="cat-grid">
              {filteredProducts.map((product) => {
                const { basePrice, finalPrice, discountPercent } = getDisplayPrice(product);
                return (
                  <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="cat-card">
                      <div style={{ aspectRatio: '1', background: '#f4f6fb', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: '36px', opacity: 0.25 }}>📦</span>
                        )}
                      </div>
                      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em', margin: 0 }}>{product.category}</p>
                        <h3 className="cat-name" style={{ fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.3', margin: 0 }}>{product.name}</h3>
                        <p className="cat-desc" style={{ fontSize: '12px', color: '#666', margin: 0 }}>{product.desc}</p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                          {discountPercent > 0 && (
                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#ff4d6d' }}>{discountPercent}%</span>
                          )}
                          <span className="cat-price" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
                            {finalPrice.toLocaleString()}<span style={{ fontSize: '13px' }}>원</span>
                          </span>
                          {discountPercent > 0 && (
                            <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>{basePrice.toLocaleString()}원</span>
                          )}
                        </div>
                        <button style={{
                          background: '#F5C400',
                          border: '2px solid #111',
                          borderRadius: '8px',
                          padding: '7px 12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginTop: '8px',
                          width: '100%',
                        }}>
                          담기
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer style={{ background: '#111', color: '#fff', padding: '48px 0 32px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 12px', display: 'inline-block', marginBottom: '14px' }}>
              <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: '30px', width: 'auto' }} />
            </div>
            <p style={{ fontSize: '13px', color: '#b9bdc7', lineHeight: '1.6' }}>꼬리가 흔들리는 진짜 좋은 것들.</p>
          </div>
          <p style={{ fontSize: '12px', color: '#8b909c', lineHeight: '1.8' }}>
            © 2026 WAGGLE TAIL. All rights reserved.
          </p>
        </div>
      </footer>

      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .cat-card {
          border: 2px solid rgba(17,17,17,.14);
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
          height: 100%;
        }
        .cat-card:hover {
          border-color: #111;
          transform: translateY(-4px);
          box-shadow: 0 10px 0 rgba(17,17,17,.1);
        }
        .cat-name { font-size: 15px; }
        .cat-price { font-size: 18px; }
        .cat-desc { display: block; }

        @media (max-width: 1024px) {
          .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (max-width: 640px) {
          .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .cat-name { font-size: 13px; }
          .cat-price { font-size: 15px; }
          .cat-desc { display: none; }
        }
      `}</style>
    </div>
  );
}
