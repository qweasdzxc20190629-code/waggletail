import Link from 'next/link';
import { getDisplayPrice } from '../products';
import { getProductsAction } from '../products-actions';
import { getCategoryNamesAction } from '../categories-actions';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [allProducts] = await Promise.all([getProductsAction(), getCategoryNamesAction()]);
  const products = category ? allProducts.filter((p) => p.category === category) : allProducts;

  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", color: '#111' }}>
      {/* 배너 */}
      <div style={{ lineHeight: 0 }}>
        <picture>
          <source media="(min-width: 769px)" srcSet="https://i.imgur.com/WuDEeJF.png" />
          <img src="https://i.imgur.com/THlApmV.jpeg" alt="" style={{ width: '100%', display: 'block', height: 'auto' }} />
        </picture>
      </div>

      <section style={{ padding: '48px 0 64px', background: '#fff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>

          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '10px', color: '#0041BD' }}>ALL PRODUCTS</p>
            <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05', margin: 0, fontFamily: "'Pretendard', sans-serif", color: '#3a3a3a' }}>전체 상품</h1>
            <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>총 {products.length}개 상품</p>
          </div>


          {products.length === 0 ? (
            <p style={{ fontSize: '16px', color: '#555' }}>등록된 상품이 없습니다.</p>
          ) : (
            <div className="all-grid">
              {products.map((product) => {
                const { basePrice, finalPrice, discountPercent } = getDisplayPrice(product);
                return (
                  <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="all-card">
                      <div style={{ aspectRatio: '1', background: '#f4f6fb', overflow: 'hidden', display: 'grid', placeItems: 'center', position: 'relative' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: '36px', opacity: 0.25 }}>📦</span>
                        )}
                        {product.freeShipping && (
                          <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#F5C400', color: '#111', fontSize: '10px', fontWeight: 800, borderRadius: '6px', padding: '4px 8px', letterSpacing: '0.04em' }}>무료배송</span>
                        )}
                      </div>
                      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0041BD', letterSpacing: '0.02em', margin: 0 }}>{product.category}</p>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: '1.3', margin: 0 }}>{product.name}</h3>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{product.desc}</p>
                        <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                          {discountPercent > 0 && (
                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#ff4d6d' }}>{discountPercent}%</span>
                          )}
                          <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em' }}>
                            {finalPrice.toLocaleString()}<span style={{ fontSize: '13px' }}>원</span>
                          </span>
                          {discountPercent > 0 && (
                            <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>{basePrice.toLocaleString()}원</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                          <button style={{
                            flex: 1,
                            background: '#0041BD',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '7px 0',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#fff',
                          }}>
                            장바구니
                          </button>
                          <button style={{
                            flex: 1,
                            background: '#F5C400',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '7px 0',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#111',
                          }}>
                            구매하기
                          </button>
                        </div>
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
            <div style={{ display: 'inline-block', marginBottom: '14px' }}>
              <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: '30px', width: 'auto' }} />
            </div>
            <p style={{ fontSize: '13px', color: '#b9bdc7', lineHeight: '1.6' }}>꼬리가 흔들리는 진짜 좋은 것들.</p>
          </div>
          <p style={{ fontSize: '12px', color: '#8b909c', lineHeight: '1.8' }}>© 2026 WAGGLE TAIL. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
.all-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .all-card {
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
        .all-card:hover {
          border-color: #111;
          transform: translateY(-4px);
          box-shadow: 0 10px 0 rgba(17,17,17,.1);
        }
        @media (max-width: 1024px) {
          .all-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (max-width: 640px) {
          .all-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
    </div>
  );
}
