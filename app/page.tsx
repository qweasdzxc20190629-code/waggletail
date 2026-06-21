import Link from 'next/link';
import CategoryCarousel from './components/CategoryCarousel';
import ProductCarousel from './components/ProductCarousel';
import { getDisplayPrice } from './products';
import { getProductsAction } from './products-actions';
import { getCategoriesAction } from './categories-actions';
import { getReviewsAction } from './reviews-actions';
import PhotoReviewSection from './components/PhotoReviewSection';

export const dynamic = 'force-dynamic';

const FALLBACK_REVIEWS = [
  { id: '1', imageUrl: undefined as string | undefined, name: '콩이맘', avatar: '🐕', breed: '포메라니안', age: '3살', star: 5, text: '도넛 베드 안에서 안 나와요. 커버 분리돼서 세탁도 편하고, 솜이 빵빵해서 한 달 써도 안 꺼졌어요. 다음에 또 살 것 같아요!', product: '포근 도넛 베드', verified: true, likes: 42, date: '2026.05.12' },
  { id: '2', imageUrl: undefined as string | undefined, name: '두부아빠', avatar: '🐶', breed: '웰시코기', age: '5살', star: 5, text: '정기배송으로 패드 받으니까 떨어질 일이 없네요. 할인까지 되니까 이게 진짜 이득이에요. 배송도 빠르고 완전 만족합니다!', product: '배변 패드 정기배송', verified: true, likes: 38, date: '2026.05.20' },
  { id: '3', imageUrl: undefined as string | undefined, name: '몽실이네', avatar: '🐩', breed: '말티즈', age: '2살', star: 5, text: 'XS 사이즈가 딱 맞아요. 내구성도 좋아서 3개월째 잘 쓰고 있어요. 색상도 예쁘고 산책할 때마다 칭찬받아요 ㅎㅎ', product: '따뜻한 겨울 후드', verified: true, likes: 61, date: '2026.04.30' },
  { id: '4', imageUrl: undefined as string | undefined, name: '하루맘', avatar: '🦴', breed: '비숑프리제', age: '1살', star: 5, text: '재질도 고급스럽고 디자인이 너무 예뻐요. 강아지가 처음엔 낯설어했는데 지금은 혼자 들고 다녀요. 완전 추천합니다!', product: '리드줄', verified: false, likes: 29, date: '2026.06.01' },
];

export default async function Home() {
  const [products, initialCats, dbReviews] = await Promise.all([getProductsAction(), getCategoriesAction(), getReviewsAction().catch(() => [])]);
  const reviews = dbReviews.length > 0 ? dbReviews : FALLBACK_REVIEWS;
  return (
    <div style={{ fontFamily: "'Pretendard', sans-serif", color: '#222' }}>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0) 380px), #0041BD', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div className="wt-container wt-hero-grid" style={{ position: 'relative', zIndex: 2, maxWidth: '1240px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: '40px', alignItems: 'center', paddingTop: '64px', paddingBottom: '100px', minHeight: '480px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.14em', marginBottom: '18px', color: '#F5C400', fontFamily: "'Pretendard', sans-serif" }}>FOR A HAPPIER WALK</p>
            <h1 className="wt-h1-hero" style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', lineHeight: '1.1', letterSpacing: '-0.03em', fontFamily: "'Pretendard', sans-serif" }}>
              우리 강아지의 하루를<br />
              <span style={{ color: '#F5C400' }}>더 신나게.</span>
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.92, marginBottom: '32px', lineHeight: '1.6', maxWidth: '430px', fontFamily: "'Pretendard', sans-serif" }}>
              매일 쓰는 것부터 가끔 필요한 것까지. 꼬리가 흔들리는 진짜 좋은 것들만 골라 담았어요.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button style={{
                background: '#F5C400',
                color: '#111',
                fontWeight: 800,
                fontSize: '16px',
                padding: '15px 26px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
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
                border: 'none',
                cursor: 'pointer',
              }}>
                정기배송 알아보기
              </button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'stretch' }}>
            {products.slice(0, 2).map((p, i) => {
              const { finalPrice } = getDisplayPrice(p);
              return (
                <div key={p.id} style={{ background: '#fff', border: '3px solid #111', borderRadius: '20px', padding: '16px', color: '#111', position: 'relative', boxShadow: '8px 8px 0 #F5C400', display: 'flex', flexDirection: 'column' }}>
                  {i === 0 && <span style={{ position: 'absolute', top: '-13px', left: '16px', background: '#111', color: '#fff', fontWeight: 800, fontSize: '10px', letterSpacing: '0.1em', padding: '5px 11px', borderRadius: '999px' }}>🏆 BEST</span>}
                  {i === 1 && <span style={{ position: 'absolute', top: '-13px', left: '16px', background: '#F5C400', color: '#111', fontWeight: 800, fontSize: '10px', letterSpacing: '0.1em', padding: '5px 11px', borderRadius: '999px' }}>✨ NEW</span>}
                  <div style={{ aspectRatio: '1', borderRadius: '10px', background: '#f4f6fb', marginBottom: '12px', overflow: 'hidden' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <span style={{ fontSize: '40px', opacity: 0.2, display: 'grid', placeItems: 'center', height: '100%' }}>📦</span>
                    }
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '4px', lineHeight: 1.3 }}>{p.name}</h3>
                  <p style={{ fontSize: '12px', color: '#777', margin: '0 0 12px', lineHeight: 1.4 }}>{p.desc}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '-0.02em', background: '#F5C400', padding: '4px 8px', borderRadius: '6px' }}>
                      {finalPrice.toLocaleString()}<span style={{ fontSize: '11px', fontWeight: 700 }}>원</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID — pulled up over the hero with rounded top corners only */}
      <section className="wt-white-overlap" style={{
        position: 'relative',
        marginTop: '-40px',
        background: '#fff',
        borderRadius: '32px 32px 0 0',
        zIndex: 2,
        overflow: 'hidden',
        width: '100%',
        padding: '48px 0 36px',
      }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ display: 'inline-block', background: '#0041BD', color: '#fff', fontWeight: 700, fontSize: '15px', padding: '8px 18px', borderRadius: '8px', letterSpacing: '0.02em', fontFamily: "'Pretendard', sans-serif" }}>All Products</span>
          </div>

          <CategoryCarousel initialCats={initialCats} />
        </div>
      </section>

      {/* PHOTO REVIEW */}
      <PhotoReviewSection initialReviews={reviews} />

      {/* PRODUCTS GRID */}
      <section style={{ padding: '36px 0 64px', background: '#fff' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '12px', color: '#0041BD' }}>JUST DROPPED</p>
              <h2 className="wt-h2" style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.05' }}>이번 주 신상품</h2>
            </div>
            <Link href="/category/베드" style={{ fontWeight: 800, fontSize: '14px', color: '#111', textDecoration: 'none', border: '2px solid #111', borderRadius: '999px', padding: '10px 20px', background: '#fff', whiteSpace: 'nowrap' }}>
              전체 상품 보기 →
            </Link>
          </div>
          <ProductCarousel
            products={products.slice(0, 8).map((p) => {
              const { basePrice, finalPrice, discountPercent } = getDisplayPrice(p);
              return { id: p.id, name: p.name, desc: p.desc, category: p.category, image: p.image, basePrice, finalPrice, discountPercent };
            })}
          />
        </div>
      </section>

      {/* BRAND STORY */}
      <section style={{ background: '#F5C400', color: '#111', position: 'relative', overflow: 'hidden' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '96px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.14em', marginBottom: '18px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>OUR PROMISE</p>
          <h2 className="wt-h2-promise" style={{ fontSize: '52px', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.1', maxWidth: '760px', margin: '0 auto 22px' }}>
            강아지 입장에서 한 번 더 생각합니다.<br />
            <span style={{ color: '#fff' }}>꼬리가 답이니까요.</span>
          </h2>
          <p style={{ fontSize: '17px', opacity: 0.9, maxWidth: '540px', margin: '0 auto 34px' }}>WAGGLE TAIL은 보호자가 아니라 강아지의 하루를 기준으로 제품을 고릅니다. 좋은 성분, 편한 사용, 솔직한 가격. 셋 다 만족하지 못하면 판매하지 않아요.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <span style={{ border: '2px solid rgba(17,17,17,.3)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>🦴 까다로운 성분 기준</span>
            <span style={{ border: '2px solid rgba(17,17,17,.3)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>📦 투명한 정가</span>
            <span style={{ border: '2px solid rgba(17,17,17,.3)', borderRadius: '999px', padding: '10px 20px', fontWeight: 700, fontSize: '15px' }}>🔁 부담 없는 교환·환불</span>
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
            <a href="#" style={{ fontWeight: 800, fontSize: '14px', color: '#111', textDecoration: 'none', border: '2px solid #111', borderRadius: '999px', padding: '10px 20px', background: '#fff', whiteSpace: 'nowrap' }}>리뷰 더보기 →</a>
          </div>
          
          <div className="wt-grid-reviews" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ border: '2.5px solid #111', borderRadius: '18px', padding: '24px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F5C400', border: '2px solid #111', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px' }}>콩</div>
                <div style={{ flex: 1 }}>
                  <b style={{ display: 'block', fontSize: '15px', fontWeight: 800 }}>콩이맘</b>
                  <span style={{ fontSize: '13px', color: '#777' }}>포메라니안 · 3살</span>
                </div>
                <div style={{ color: '#0041BD', fontWeight: 900, fontSize: '15px' }}>★ 5</div>
              </div>
              <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>도넛 베드 안에서 안 나와요. 커버 분리돼서 세탁도 편하고, 솜이 빵빵해서 한 달 써도 안 꺼졌어요.</p>
              <span style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(0,65,189,.08)', color: '#0041BD', padding: '6px 12px', borderRadius: '999px', display: 'inline-block' }}>포근 도넛 베드</span>
            </div>
            <div style={{ border: '2.5px solid #111', borderRadius: '18px', padding: '24px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F5C400', border: '2px solid #111', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px' }}>두</div>
                <div style={{ flex: 1 }}>
                  <b style={{ display: 'block', fontSize: '15px', fontWeight: 800 }}>두부아빠</b>
                  <span style={{ fontSize: '13px', color: '#777' }}>웰시코기 · 5살</span>
                </div>
                <div style={{ color: '#0041BD', fontWeight: 900, fontSize: '15px' }}>★ 4.8</div>
              </div>
              <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>정기배송으로 패드 받으니까 떨어질 일이 없네요. 깜빡하던 사람인데 이건 진짜 편합니다. 할인까지 되니 만족.</p>
              <span style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(0,65,189,.08)', color: '#0041BD', padding: '6px 12px', borderRadius: '999px', display: 'inline-block' }}>정기배송 · 배변패드</span>
            </div>
            <div style={{ border: '2.5px solid #111', borderRadius: '18px', padding: '24px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#F5C400', border: '2px solid #111', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '16px' }}>몽</div>
                <div style={{ flex: 1 }}>
                  <b style={{ display: 'block', fontSize: '15px', fontWeight: 800 }}>몽실이네</b>
                  <span style={{ fontSize: '13px', color: '#777' }}>말티즈 · 2살</span>
                </div>
                <div style={{ color: '#0041BD', fontWeight: 900, fontSize: '15px' }}>★ 5</div>
              </div>
              <p style={{ fontSize: '15px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>작은 강아지라 사이즈가 중요했는데, XS가 정확히 딱 맞네요. 내구성도 좋아서 3개월째 잘 쓰고 있습니다.</p>
              <span style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(0,65,189,.08)', color: '#0041BD', padding: '6px 12px', borderRadius: '999px', display: 'inline-block' }}>따뜻한 겨울 후드</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#111', color: '#fff', padding: '64px 0 40px' }}>
        <div className="wt-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
          <div className="wt-grid-footer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', paddingBottom: '44px', borderBottom: '1px solid rgba(255,255,255,.15)' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '12px 14px', display: 'inline-block', marginBottom: '16px' }}>
                <img src="https://i.imgur.com/nVCqGWi.png" alt="WAGGLE TAIL" style={{ height: '34px', width: 'auto' }} />
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

      {/* Plain global <style> (not styled-jsx) so this page can stay a Server Component. */}
      <style>{`
        /* PC: 4열 그리드 */
        .wt-grid-cat-pc {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .wt-grid-cat-pc .wt-cat-card {
          width: 100%;
          flex: unset;
        }
        .wt-grid-cat-mobile {
          display: none;
        }
        .wt-cat-dots {
          display: none;
        }
        /* 모바일: 캐러셀 */
        @media (max-width: 768px) {
          .wt-grid-cat-pc { display: none; }
          .wt-grid-cat-mobile {
            display: flex;
            scrollbar-width: none;
            margin-left: -24px;
            margin-right: -24px;
            padding-left: 24px;
            padding-right: 24px;
          }
          .wt-grid-cat-mobile::-webkit-scrollbar { display: none; }
          .wt-cat-dots { display: flex; }
        }
        .wt-prod-carousel {
          margin-left: -24px;
          margin-right: -24px;
          padding-left: 24px;
          padding-right: 24px;
        }
        .wt-prod-carousel::-webkit-scrollbar {
          display: none;
        }
        /* 카드 기본 크기 — CSS로 관리해야 모바일 override 가능 */
        .wt-cat-card {
          flex: 0 0 220px;
          width: 220px;
        }
        .wt-cat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 0 #111;
        }
        .wt-prod-card:hover {
          border-color: #111;
          transform: translateY(-4px);
          box-shadow: 0 10px 0 rgba(17,17,17,.12);
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .wt-grid-reviews {
            grid-template-columns: 1fr !important;
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
            padding-bottom: 80px !important;
          }
          .wt-white-overlap {
            margin-top: -44px !important;
            border-radius: 28px 28px 0 0 !important;
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
          .wt-grid-cat-mobile {
            gap: 8px !important;
            margin-left: -16px !important;
            margin-right: -16px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .wt-cat-card {
            flex: 0 0 calc((100vw - 56px) / 2.3) !important;
            width: calc((100vw - 56px) / 2.3) !important;
            padding: 14px !important;
            gap: 6px !important;
            border-radius: 16px !important;
            min-height: 0 !important;
          }
          .wt-cat-emoji {
            font-size: 38px !important;
          }
          .wt-cat-en {
            font-size: 9px !important;
          }
          .wt-cat-name {
            font-size: 15px !important;
          }
          .wt-prod-carousel {
            margin-left: -16px !important;
            margin-right: -16px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .wt-grid-products {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .wt-prod-card {
            border-radius: 10px !important;
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
          .wt-grid-reviews {
            grid-template-columns: 1fr !important;
          }
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
