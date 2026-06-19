'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { uploadProductImageAction, initStorageBucketAction } from '../../products-actions';
import {
  getCommunityBestReviewsAction,
  addCommunityBestReviewAction,
  updateCommunityBestReviewAction,
  deleteCommunityBestReviewAction,
} from '../../community-review-actions';

type ReviewPost = {
  id: number;
  category: string;
  product: string;
  productThumb: string;
  title: string;
  body: string;
  author: string;
  star: number;
  reviewCount: number;
  avgStar: number;
  hasPhoto: boolean;
  isBest?: boolean;
  date: string;
  likes: number;
  imageUrl?: string;
};

const ALL_REVIEWS: ReviewPost[] = [
  { id: 1,  category: '하우스',    product: '포근 도넛 베드 M',       productThumb: '🛏️', title: '한 달 써봤는데 솜이 아직도 빵빵해요!',        body: '처음엔 이게 그냥 쿠션이겠지 싶었는데, 한 달이 지나도 탄성이 살아있어요.',            author: '콩이맘**',    star: 5, reviewCount: 124, avgStar: 4.8, hasPhoto: true,  isBest: true,  date: '2026.06.19', likes: 67 },
  { id: 2,  category: '위생용품',  product: '배변 패드 정기배송 40매', productThumb: '📦', title: '정기배송으로 받으니 너무 편해요 진짜!',       body: '매번 마트 가서 무거운 패드 들고 오는 게 힘들었는데 집 앞에 와서 너무 좋아요.',      author: '두부아빠**',   star: 5, reviewCount: 98,  avgStar: 4.9, hasPhoto: true,  isBest: true,  date: '2026.06.18', likes: 55 },
  { id: 3,  category: '의류',      product: '따뜻한 겨울 후드 XS',    productThumb: '👕', title: 'XS 핏 완벽하고 색깔도 이뻐요 ㅎㅎ',         body: '키 작은 소형견인데 XS 사이즈가 딱 맞았어요. 색상도 사진이랑 동일하고 봉제 꼼꼼.',    author: '몽실이네**',   star: 5, reviewCount: 67,  avgStar: 4.7, hasPhoto: true,  isBest: true,  date: '2026.06.17', likes: 38 },
  { id: 4,  category: '산책용품',  product: '가죽 리드줄 M',          productThumb: '🦮', title: '재질 고급스럽고 색상도 예뻐요!',             body: '리드줄 여러 개 써봤는데 이게 제일 손에 잡히는 느낌이 좋아요.',                      author: '하루맘****',   star: 4, reviewCount: 53,  avgStar: 4.5, hasPhoto: false, isBest: true,  date: '2026.06.16', likes: 29 },
  { id: 5,  category: '하우스',    product: '포근 도넛 베드 S',       productThumb: '🛏️', title: '처음엔 낯설어했는데 이제 안 나와요 ㅋㅋ',   body: '바닥에 퍼질러있던 강아지가 이제는 무조건 베드에서 자요.',                            author: '럭키대디**',   star: 5, reviewCount: 89,  avgStar: 4.8, hasPhoto: true,  isBest: true,  date: '2026.06.15', likes: 44 },
  { id: 6,  category: '산책용품',  product: '메쉬 하네스 S',          productThumb: '🐾', title: '사이즈 딱 맞고 착용 거부 없어졌어요',        body: '예전 하네스는 입히려고 하면 도망가던 아이가 이건 순순히 입어요.',                    author: '밀키보호**',   star: 5, reviewCount: 42,  avgStar: 4.6, hasPhoto: true,  isBest: false, date: '2026.06.14', likes: 31 },
  { id: 7,  category: '간식',      product: '오리고기 져키 100g',     productThumb: '🦴', title: '냄새가 심하지 않고 강아지가 잘 먹어요',      body: '오리고기 져키 특유의 냄새가 없어서 보호자도 편해요.',                                author: '코코맘****',   star: 4, reviewCount: 31,  avgStar: 4.3, hasPhoto: false, isBest: false, date: '2026.06.13', likes: 18 },
  { id: 8,  category: '의류',      product: '쿨메쉬 티셔츠 XS',      productThumb: '👕', title: '여름 산책할 때 덥지 않아서 좋아요',          body: '작년 여름에 너무 더워보여서 구매했는데 올해 또 샀어요.',                              author: '보리아빠**',   star: 5, reviewCount: 77,  avgStar: 4.7, hasPhoto: true,  isBest: false, date: '2026.06.12', likes: 22 },
  { id: 9,  category: '위생용품',  product: '발 세정제 200ml',        productThumb: '🧴', title: '산책 후 발닦기 편하고 세정력도 좋아요',      body: '기존에 쓰던 제품보다 거품이 잘 일고 잘 헹궈져요.',                                  author: '나비보호**',   star: 4, reviewCount: 28,  avgStar: 4.4, hasPhoto: false, isBest: false, date: '2026.06.11', likes: 14 },
  { id: 10, category: '하우스',    product: '사계절 쿠션 방석 L',    productThumb: '🛏️', title: '소재 촉감이 너무 좋아요 매일 거기만 있어요', body: '두꺼운 강아지라 방석 고르기 어려웠는데 L 사이즈 딱 맞았어요.',                      author: '골든패밀**',   star: 5, reviewCount: 61,  avgStar: 4.9, hasPhoto: true,  isBest: false, date: '2026.06.10', likes: 36 },
  { id: 11, category: '사료',      product: '연어 그레인프리 사료 2kg', productThumb: '🐟', title: '피부 트러블 있던 아이가 확실히 좋아졌어요', body: '수의사 추천으로 바꿨는데 3주 만에 피부가 확 좋아졌어요. 연어 냄새도 은은해요.',      author: '살구보호**',   star: 5, reviewCount: 143, avgStar: 4.9, hasPhoto: true,  isBest: false, date: '2026.06.09', likes: 52 },
  { id: 12, category: '장난감',    product: '로프 터그 장난감',       productThumb: '🪢', title: '내구성 정말 좋아요 줄 안 끊어져요',          body: '이전에 쓰던 건 2주도 안 돼서 끊어졌는데 이건 한 달째 멀쩡해요.',                    author: '바둑이댁**',   star: 5, reviewCount: 39,  avgStar: 4.6, hasPhoto: true,  isBest: false, date: '2026.06.08', likes: 19 },
  { id: 13, category: '간식',      product: '치킨 저키 50g',          productThumb: '🍗', title: '훈련용으로 딱이에요 크기도 적당하고',         body: '교육 간식으로 쓰는데 크기가 작아서 먹는 속도 조절이 돼요. 성분도 깔끔해요.',        author: '초코보호**',   star: 5, reviewCount: 58,  avgStar: 4.7, hasPhoto: false, isBest: false, date: '2026.06.07', likes: 11 },
  { id: 14, category: '산책용품',  product: '야광 안전 하네스 M',    productThumb: '🌙', title: '밤 산책 때 안보여서 불안했는데 이게 최고',   body: '야광이라 차가 지나갈 때 반사돼서 너무 안심돼요. 착용도 쉽고 사이즈 조절도 잘 돼요.',  author: '달빛산책**',   star: 5, reviewCount: 47,  avgStar: 4.8, hasPhoto: true,  isBest: false, date: '2026.06.06', likes: 24 },
  { id: 15, category: '사료',      product: '오리 저단백 사료 1.5kg', productThumb: '🦆', title: '신장이 안 좋은 아이에게 좋아요',              body: '신부전 초기 진단받은 후 수의사 추천으로 구매했어요. 잘 먹고 몸무게도 유지 중이에요.', author: '해달보호**',   star: 4, reviewCount: 22,  avgStar: 4.5, hasPhoto: false, isBest: false, date: '2026.06.05', likes: 8  },
  { id: 16, category: '장난감',    product: '노즈워크 매트 S',        productThumb: '🎯', title: '집에 있는 시간이 늘었어요 덕분에 심심 안 해해', body: '간식 숨겨두면 30분은 혼자 놀아요. 분리불안 있는 아이에게 강추합니다.',              author: '뭉게보호**',   star: 5, reviewCount: 84,  avgStar: 4.8, hasPhoto: true,  isBest: false, date: '2026.06.04', likes: 41 },
];

const CATEGORIES = ['전체', '사료', '간식', '장난감', '산책용품', '하우스', '위생용품', '의류'];
const SORTS = [
  { value: 'latest',  label: '최신 리뷰순' },
  { value: 'popular', label: '인기 리뷰순' },
  { value: 'star',    label: '평점 높은순' },
];
const NOTICES = [
  '리뷰는 실제 구매 후 작성해주세요. 허위 리뷰는 삭제 및 적립금 회수 처리됩니다.',
  '동일 상품에 대한 중복 리뷰는 작성이 불가합니다.',
  '포토 리뷰는 상품이 포함된 사진을 업로드해주세요. 음식, 풍경 등 관계없는 사진은 포토 리뷰로 인정되지 않습니다.',
  '리뷰 적립금은 리뷰 작성 완료 후 7일 이내에 지급됩니다.',
  '욕설, 비방, 개인정보가 포함된 리뷰는 사전 고지 없이 삭제될 수 있습니다.',
  '베스트 리뷰어는 매월 말 선정되며, 선정 시 개별 연락드립니다.',
  '이벤트성 리뷰(단순 이모티콘, 의미 없는 반복 문자 등)는 적립금 지급 대상에서 제외됩니다.',
];
const PER_PAGE = 8;

type ShopProduct = { id: string; name: string; category: string; image: string; };

function ReviewCard({ r }: { r: ReviewPost }) {
  return (
    <div className="list-card" style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ aspectRatio: '1 / 1', position: 'relative', overflow: 'hidden' }}>
        {r.imageUrl
          ? <img src={r.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: r.hasPhoto ? '#edf0f7' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px' }}>
              {r.hasPhoto ? <span style={{ opacity: 0.45 }}>🐾</span> : <span style={{ opacity: 0.13, fontSize: '26px' }}>📷</span>}
            </div>
        }
        {r.isBest && <span style={{ position: 'absolute', top: '8px', left: '8px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.05em', background: '#0041BD', color: '#fff', padding: '3px 7px', borderRadius: '2px' }}>BEST</span>}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ color: '#F5C400', fontSize: '11px', letterSpacing: '-0.5px', marginBottom: '5px' }}>
          {'★'.repeat(r.star)}{'☆'.repeat(5 - r.star)}
        </div>
        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: '#111', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45 }}>
          {r.title}
        </p>
        <p style={{ margin: '0 0 10px', fontSize: '11px', color: '#bbb' }}>{r.author}</p>
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {r.productThumb && (r.productThumb.startsWith('http') || r.productThumb.startsWith('blob:'))
            ? <img src={r.productThumb} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }} />
            : <span style={{ fontSize: '18px', flexShrink: 0 }}>{r.productThumb || '📦'}</span>
          }
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product}</p>
            <p style={{ margin: 0, fontSize: '10px', color: '#bbb' }}>★ {r.avgStar} · 리뷰 {r.reviewCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ModalType = null | 'add' | 'edit' | 'delete';

export default function ReviewPage() {
  const [open, setOpen]         = useState(true);
  const [category, setCategory] = useState('전체');
  const [sort, setSort]         = useState('latest');
  const [search, setSearch]     = useState('');
  const [input, setInput]       = useState('');
  const [page, setPage]         = useState(1);
  const [isAdmin, setIsAdmin]   = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bestList, setBestList] = useState<ReviewPost[]>([]);
  const [bestLoading, setBestLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [modal, setModal]       = useState<ModalType>(null);
  const [target, setTarget]     = useState<ReviewPost | null>(null);

  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([]);
  const [shopCategories, setShopCategories] = useState<string[]>([]);

  const emptyForm = { title: '', body: '', star: 5, product: '', productThumb: '', category: '', author: '', avgStar: 0, reviewCount: 0, imageUrl: '' };
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const imageFileRef = useRef<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    initStorageBucketAction().catch(() => {});
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    getCommunityBestReviewsAction().then((list) => { setBestList(list as ReviewPost[]); setBestLoading(false); });
    supabase.from('products').select('id, name, category, image').order('order_index').then(({ data }) => {
      if (!data) return;
      setShopProducts(data as ShopProduct[]);
      const cats = Array.from(new Set(data.map((p) => p.category))).filter(Boolean);
      setShopCategories(cats);
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    imageFileRef.current = file;
    const blobUrl = URL.createObjectURL(file);
    setImagePreview(blobUrl);
    setForm((f) => ({ ...f, imageUrl: blobUrl }));
  };

  const compressImage = async (file: File): Promise<File> => {
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
    if (isGif) return file;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        preserveExif: false,
        initialQuality: 0.85,
      });
      return new File([compressed], file.name, { type: compressed.type });
    } catch {
      return file;
    }
  };

  const uploadImageIfNeeded = async (): Promise<string> => {
    const file = imageFileRef.current;
    if (!file) return form.imageUrl;
    try {
      const compressed = await compressImage(file);
      const fd = new FormData();
      fd.append('file', compressed);
      const { url, error } = await uploadProductImageAction(fd);
      if (url) return url;
      console.error('이미지 업로드 실패:', error);
    } catch (e) {
      console.error('이미지 업로드 오류:', e);
    }
    return form.imageUrl;
  };

  const openAdd = () => {
    setForm(emptyForm);
    setImagePreview('');
    imageFileRef.current = null;
    setModal('add');
  };
  const openEdit = (r: ReviewPost) => {
    setTarget(r);
    setForm({ title: r.title, body: r.body, star: r.star, product: r.product, productThumb: r.productThumb, category: r.category, author: r.author, avgStar: r.avgStar, reviewCount: r.reviewCount, imageUrl: r.imageUrl ?? '' });
    setImagePreview(r.imageUrl ?? '');
    imageFileRef.current = null;
    setModal('edit');
  };
  const openDelete = (r: ReviewPost) => { setTarget(r); setModal('delete'); };
  const closeModal = () => { setModal(null); setTarget(null); };

  const safeUrl = (url: string) => (url.startsWith('blob:') ? '' : url);

  const handleAddSave = async () => {
    if (!form.title.trim() || !form.product.trim()) return;
    setSaving(true);
    const imageUrl = safeUrl(await uploadImageIfNeeded());
    const updated = await addCommunityBestReviewAction({
      category: form.category, product: form.product, productThumb: form.productThumb,
      title: form.title, body: form.body, author: form.author, star: form.star,
      reviewCount: form.reviewCount, avgStar: form.avgStar,
      imageUrl: imageUrl || undefined, hasPhoto: !!imageUrl, isBest: true,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.').replace('.', ''),
      likes: 0,
    });
    setBestList(updated as ReviewPost[]);
    setSaving(false);
    closeModal();
  };
  const handleEditSave = async () => {
    if (!target) return;
    setSaving(true);
    const imageUrl = safeUrl(await uploadImageIfNeeded());
    const updated = await updateCommunityBestReviewAction(target.id, {
      category: form.category, product: form.product, productThumb: form.productThumb,
      title: form.title, body: form.body, author: form.author, star: form.star,
      reviewCount: form.reviewCount, avgStar: form.avgStar,
      imageUrl: imageUrl || undefined, hasPhoto: !!imageUrl,
      isBest: target.isBest ?? true, date: target.date, likes: target.likes,
    });
    setBestList(updated as ReviewPost[]);
    setSaving(false);
    closeModal();
  };
  const handleDelete = async () => {
    if (!target) return;
    const updated = await deleteCommunityBestReviewAction(target.id);
    setBestList(updated as ReviewPost[]);
    closeModal();
  };

  const listReviews = useMemo(() => {
    let list = [...ALL_REVIEWS];
    if (category !== '전체') list = list.filter((r) => r.category === category);
    if (search.trim())        list = list.filter((r) => r.title.includes(search) || r.product.includes(search));
    if (sort === 'latest')    list.sort((a, b) => b.id - a.id);
    if (sort === 'popular')   list.sort((a, b) => b.likes - a.likes);
    if (sort === 'star')      list.sort((a, b) => b.star - a.star);
    return list;
  }, [category, sort, search]);

  const totalPages = Math.max(1, Math.ceil(listReviews.length / PER_PAGE));
  const paged = listReviews.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const selectStyle: React.CSSProperties = {
    padding: '8px 32px 8px 12px', fontSize: '13px', border: '1px solid #e0e0e0',
    borderRadius: '4px', background: '#fff', color: '#333', cursor: 'pointer',
    fontFamily: "'Pretendard', sans-serif", outline: 'none', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23aaa'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: "'Pretendard', sans-serif" }}>

      {/* ── 1. BEST REVIEWER ── */}
      <section style={{ textAlign: 'center', padding: '72px 24px 56px', borderBottom: '1px solid #ebebeb' }}>
        <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em', color: '#0041BD' }}>BEST REVIEWER</p>
        <h1 style={{ margin: '0 0 18px', fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#111' }}>PRODUCT REVIEW</h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#aaa', fontWeight: 400, lineHeight: 1.8 }}>
          매월 베스트 리뷰어를 선정해 특별한 혜택을 드립니다.
        </p>
      </section>

      {/* Best reviewer grid */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 24px 64px' }}>
        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px', gap: '8px' }}>
            <button onClick={() => { setEditMode((v) => !v); }} style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1px solid', borderRadius: '4px', fontFamily: "'Pretendard', sans-serif", background: editMode ? '#111' : '#fff', color: editMode ? '#fff' : '#111', borderColor: editMode ? '#111' : '#ddd' }}>
              {editMode ? '편집 완료' : '편집 모드'}
            </button>
            {editMode && (
              <button onClick={openAdd} style={{ padding: '7px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: '1px solid #0041BD', borderRadius: '4px', background: '#0041BD', color: '#fff', fontFamily: "'Pretendard', sans-serif" }}>
                + 리뷰 추가
              </button>
            )}
          </div>
        )}
        <div
          className="best-grid"
          style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: isMobile ? '10px' : '14px' }}
        >
          {bestLoading
            ? Array.from({ length: isMobile ? 4 : 5 }).map((_, i) => (
                <div key={i} style={{ background: '#f0f0f0', borderRadius: '4px', aspectRatio: '1', animation: 'pulse 1.2s ease-in-out infinite' }} />
              ))
            : null}
          {!bestLoading && bestList.map((r) => (
            <div key={r.id} style={{ position: 'relative' }}>
              <ReviewCard r={r} />
              {editMode && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 10 }}>
                  <button onClick={() => openEdit(r)} style={{ width: '26px', height: '26px', borderRadius: '4px', background: 'rgba(0,65,189,0.85)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="수정">✎</button>
                  <button onClick={() => openDelete(r)} style={{ width: '26px', height: '26px', borderRadius: '4px', background: 'rgba(200,30,30,0.85)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="삭제">✕</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── 모달 ── */}
      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: modal === 'add' ? '640px' : '480px', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            {/* 추가 / 수정 공통 폼 모달 */}
            {(modal === 'add' || modal === 'edit') && (
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{modal === 'add' ? '베스트 리뷰 추가' : '리뷰 수정'}</h2>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#aaa', lineHeight: 1 }}>✕</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                  {/* 이미지 업로드 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>리뷰 이미지</label>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', aspectRatio: '3/1', border: '1.5px dashed #d0d0d0', borderRadius: '8px', cursor: 'pointer', background: imagePreview ? 'none' : '#fafafa', overflow: 'hidden', position: 'relative' }}>
                      {imagePreview
                        ? <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 8 12 3 7 8" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round"/></svg>
                            <span style={{ fontSize: '12px', color: '#bbb' }}>클릭하여 이미지 업로드</span>
                          </>
                      }
                      <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </label>
                    {uploadError && <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#e44' }}>{uploadError}</p>}
                    {imagePreview && (
                      <button onClick={() => { setImagePreview(''); setUploadError(''); imageFileRef.current = null; setForm((f) => ({ ...f, imageUrl: '' })); }} style={{ marginTop: '6px', fontSize: '11px', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>✕ 이미지 제거</button>
                    )}
                  </div>

                  {/* 카테고리 선택 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>카테고리 <span style={{ color: '#e44' }}>*</span></label>
                    <select
                      value={form.category}
                      onChange={(e) => {
                        const cat = e.target.value;
                        setForm((f) => ({ ...f, category: cat, product: '', productThumb: '', avgStar: 0, reviewCount: 0 }));
                      }}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: "'Pretendard', sans-serif", background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value="">카테고리 선택</option>
                      {shopCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* 상품 선택 */}
                  {form.category && (() => {
                    const filtered = shopProducts.filter((p) => p.category === form.category);
                    if (!filtered.length) return null;
                    return (
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>상품 선택 <span style={{ color: '#e44' }}>*</span></label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '6px' }}>
                          {filtered.map((p) => {
                            const selected = form.product === p.name;
                            return (
                              <button key={p.id} type="button" onClick={() => setForm((f) => ({ ...f, product: p.name, productThumb: p.image }))}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', border: '1px solid', borderColor: selected ? '#0041BD' : '#ebebeb', background: selected ? '#f0f4ff' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: "'Pretendard', sans-serif" }}>
                                {p.image
                                  ? <img src={p.image} alt="" style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                                  : <span style={{ width: '36px', height: '36px', background: '#f0f0f0', borderRadius: '4px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📦</span>
                                }
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: selected ? '#0041BD' : '#111', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                                {selected && <span style={{ fontSize: '12px', color: '#0041BD', fontWeight: 700, flexShrink: 0 }}>✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 작성자 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>작성자 닉네임</label>
                    <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="예: 콩이맘**"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: "'Pretendard', sans-serif", boxSizing: 'border-box' }} />
                  </div>

                  {/* 제목 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>리뷰 제목 <span style={{ color: '#e44' }}>*</span></label>
                    <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="한 줄로 요약해주세요"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: "'Pretendard', sans-serif", boxSizing: 'border-box' }} />
                  </div>

                  {/* 내용 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>리뷰 내용</label>
                    <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} rows={4} placeholder="상품 사용 후기를 작성해주세요."
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: "'Pretendard', sans-serif", resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7 }} />
                  </div>

                  {/* 별점 */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>별점</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} onClick={() => setForm((f) => ({ ...f, star: n }))}
                          style={{ width: '36px', height: '36px', borderRadius: '4px', border: '1px solid', borderColor: form.star >= n ? '#F5C400' : '#e0e0e0', background: form.star >= n ? '#FFF8DC' : '#fff', cursor: 'pointer', fontSize: '16px' }}>★</button>
                      ))}
                      <span style={{ fontSize: '13px', color: '#888', marginLeft: '4px' }}>{form.star}점</span>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button onClick={closeModal} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>취소</button>
                  <button onClick={modal === 'add' ? handleAddSave : handleEditSave} disabled={saving}
                    style={{ padding: '10px 24px', fontSize: '13px', fontWeight: 700, border: 'none', borderRadius: '6px', background: saving ? '#888' : '#111', color: '#fff', cursor: saving ? 'default' : 'pointer', fontFamily: "'Pretendard', sans-serif" }}>
                    {saving ? '업로드 중…' : (modal === 'add' ? '추가' : '저장')}
                  </button>
                </div>
              </div>
            )}

            {/* 삭제 확인 모달 */}
            {modal === 'delete' && target && (
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>베스트 리뷰 삭제</h2>
                  <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#aaa', lineHeight: 1 }}>✕</button>
                </div>
                <div style={{ background: '#f8f8f8', borderRadius: '8px', padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>{target.productThumb}</span>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#111' }}>{target.title}</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>{target.product} · {target.author}</p>
                  </div>
                </div>
                <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
                  해당 리뷰를 베스트 목록에서 삭제하시겠습니까?<br/>
                  <span style={{ color: '#aaa', fontSize: '12px' }}>삭제 후에도 전체 리뷰 목록에는 남아있습니다.</span>
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={closeModal} style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: '1px solid #e0e0e0', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>취소</button>
                  <button onClick={handleDelete} style={{ padding: '10px 24px', fontSize: '13px', fontWeight: 700, border: 'none', borderRadius: '6px', background: '#c81e1e', color: '#fff', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>삭제</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── 2. 리뷰 혜택 배너 ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 48px' }}>
        <div style={{ background: '#0041BD', borderRadius: '14px', display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, padding: '36px 20px', textAlign: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '12px', opacity: 0.6 }}>
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="1.8"/>
            </svg>
            <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)' }}>PHOTO REVIEW</p>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>적립금 1,000원</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '24px 0' }} />
          <div style={{ flex: 1, padding: '36px 20px', textAlign: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '12px', opacity: 0.6 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)' }}>TEXT REVIEW</p>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>적립금 300원</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)', margin: '24px 0' }} />
          <div style={{ flex: 1, padding: '36px 20px', textAlign: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '12px', opacity: 0.6 }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.5)' }}>BEST REVIEW</p>
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#fff' }}>5만원 상당 제품</p>
          </div>
        </div>
      </div>

      {/* ── 3. 유의사항 아코디언 ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}>
          <button onClick={() => setOpen((v) => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>리뷰 작성 시 유의사항</span>
            <span style={{ fontSize: '12px', color: '#aaa', display: 'inline-block', transition: 'transform .25s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
          </button>
          <div style={{ overflow: 'hidden', maxHeight: open ? '600px' : '0', transition: 'max-height .25s ease' }}>
            <ul style={{ margin: '0 0 20px', padding: '0 0 0 4px', listStyle: 'none' }}>
              {NOTICES.map((text, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#555', lineHeight: 1.9 }}>
                  <span style={{ color: '#ccc', flexShrink: 0 }}>—</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── 4. 리뷰 필터 ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 20px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap' }}>카테고리별 보기</span>
          <div style={{ position: 'relative' }}>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={selectStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={selectStyle}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSearch(input); setPage(1); }} style={{ display: 'flex', gap: '4px' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="리뷰 검색"
              style={{ padding: '8px 12px', border: '1px solid #e0e0e0', borderRadius: '4px', fontSize: '13px', width: '150px', outline: 'none', fontFamily: "'Pretendard', sans-serif", color: '#333' }} />
            <button type="submit" style={{ padding: '8px 14px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Pretendard', sans-serif" }}>검색</button>
          </form>
        </div>
      </div>

      {/* ── 5. 리뷰 리스트 ── */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px 16px' }}>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#bbb' }}>총 <strong style={{ color: '#111' }}>{listReviews.length}</strong>개의 리뷰</p>
        {paged.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', padding: '60px 0', fontSize: '14px' }}>해당하는 리뷰가 없습니다.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="list-grid">
            {paged.map((r) => <ReviewCard key={r.id} r={r} />)}
          </div>
        )}
      </div>

      {/* ── 6. 페이지네이션 ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', padding: '32px 0 72px' }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            style={{ width: '32px', height: '32px', border: '1px solid #e0e0e0', background: '#fff', cursor: page === 1 ? 'default' : 'pointer', color: page === 1 ? '#ddd' : '#888', fontSize: '13px', borderRadius: '3px' }}>‹</button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
            <button key={n} onClick={() => setPage(n)}
              style={{ width: '32px', height: '32px', border: '1px solid', borderColor: page === n ? '#111' : '#e0e0e0', background: page === n ? '#111' : '#fff', color: page === n ? '#fff' : '#555', cursor: 'pointer', fontSize: '13px', fontWeight: page === n ? 700 : 400, borderRadius: '3px' }}>{n}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ width: '32px', height: '32px', border: '1px solid #e0e0e0', background: '#fff', cursor: page === totalPages ? 'default' : 'pointer', color: page === totalPages ? '#ddd' : '#888', fontSize: '13px', borderRadius: '3px' }}>›</button>
        </div>
      )}
      {totalPages <= 1 && <div style={{ paddingBottom: '72px' }} />}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .list-card { transition: border-color .15s; }
        .list-card:hover { border-color: #aaa !important; }
        @media (max-width: 1024px) {
          .best-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .list-grid  { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .best-grid {
            display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important;
            scroll-snap-type: x mandatory !important; gap: 10px !important;
            padding-bottom: 12px !important; scrollbar-width: none !important;
          }
          .best-grid::-webkit-scrollbar { display: none; }
          .best-grid > * { flex: 0 0 calc(50% - 5px) !important; scroll-snap-align: start !important; }
          .list-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
      `}</style>
    </div>
  );
}
