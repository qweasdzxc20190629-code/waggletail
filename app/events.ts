export type EventStatus = 'ongoing' | 'ended';

export type EventBenefit = { icon: string; label: string; desc: string };

export type EventItem = {
  id: number;
  title: string;
  subtitle: string;
  status: EventStatus;
  badge: string;
  startDate: string;
  endDate: string | null;
  bg: string;
  accentColor: string;
  image: string;       // thumbnail / banner image (base64 or URL)
  pageUrl: string;     // 연결 상품 페이지 URL

  // Detail page content
  sec1Title: string;
  sec1Body: string;
  sec2Title: string;
  sec2Body: string;
  benefits: EventBenefit[];
  notice: string;         // 줄바꿈(\n)으로 구분된 유의사항
  ctaLabel: string;
  detailImages: string[]; // 본문 상품 이미지들
};

export const eventItems: EventItem[] = [
  {
    id: 1,
    title: '신규가입 첫 주문 15% 할인',
    subtitle: '처음 만난 우리, 특별하게 시작해요',
    status: 'ongoing',
    badge: '상시 이벤트',
    startDate: '2026.01.01',
    endDate: null,
    bg: '#0041BD',
    accentColor: '#FFDC20',
    image: '',
    pageUrl: '/login',
    sec1Title: '이벤트 안내',
    sec1Body: '왜글테일에 처음 오신 분들을 위한 특별 혜택이에요. 회원가입 후 첫 주문 시 전 상품 15% 할인 쿠폰이 자동으로 적용됩니다. 좋은 것들을 더 합리적으로 시작해보세요.',
    sec2Title: '참여 방법',
    sec2Body: '① 왜글테일 회원가입\n② 마음에 드는 상품 장바구니에 담기\n③ 결제 시 할인 자동 적용\n\n별도의 쿠폰 입력 없이 첫 주문에 자동으로 15%가 차감됩니다.',
    benefits: [
      { icon: '💸', label: '15% 할인', desc: '전 상품 첫 주문 자동 적용' },
      { icon: '📦', label: '무료 배송', desc: '첫 주문 배송비 면제' },
      { icon: '🎁', label: '웰컴 키트', desc: '첫 주문 고객 증정' },
    ],
    notice: '본 혜택은 신규 회원 첫 주문에만 적용됩니다.\n다른 쿠폰과 중복 적용되지 않습니다.\n상시 이벤트로 별도 종료 공지 없이 종료될 수 있습니다.',
    ctaLabel: '지금 가입하고 15% 할인받기',
    detailImages: [],
  },
  {
    id: 2,
    title: '봄맞이 산책용품 기획전',
    subtitle: '따뜻한 봄, 산책이 더 즐거워지는 아이템',
    status: 'ongoing',
    badge: '2026.03.01 – 04.30',
    startDate: '2026.03.01',
    endDate: '2026.04.30',
    bg: '#FFDC20',
    accentColor: '#0041BD',
    image: '',
    pageUrl: '/category/%EC%82%B0%EC%B1%85%EC%9A%A9%ED%92%88',
    sec1Title: '이벤트 안내',
    sec1Body: '따뜻한 봄을 맞아 산책용품 카테고리 전 상품을 특별가로 만나보세요. 리드줄, 하네스, 포켓백, 산책 파우치까지 — 봄 산책을 더 즐겁게 해줄 아이템들이 한자리에 모였어요.',
    sec2Title: '할인 대상 상품',
    sec2Body: '산책용품 카테고리 전 상품\n· 리드줄 · 하네스 · 파우치 · 포켓백\n· 산책 의류 · 보호대 · 액세서리\n\n이벤트 기간 중 해당 카테고리 진입 시 할인가 자동 반영됩니다.',
    benefits: [
      { icon: '🌸', label: '최대 20% 할인', desc: '산책용품 카테고리 전체' },
      { icon: '🐕', label: '사은품 증정', desc: '3만원 이상 구매 시' },
      { icon: '🔁', label: '무료 교환', desc: '사이즈 교환 1회 무료' },
    ],
    notice: '이벤트 기간: 2026년 3월 1일 – 4월 30일\n일부 한정 상품은 할인 대상에서 제외될 수 있습니다.\n사은품은 소진 시 조기 종료됩니다.',
    ctaLabel: '산책용품 보러가기',
    detailImages: [],
  },
  {
    id: 3,
    title: '정기배송 첫 달 무료 이벤트',
    subtitle: '매달 오는 행복, 첫 달은 우리가 쏩니다',
    status: 'ongoing',
    badge: '2026.04.01 – 05.31',
    startDate: '2026.04.01',
    endDate: '2026.05.31',
    bg: '#111',
    accentColor: '#FFDC20',
    image: '',
    pageUrl: '/',
    sec1Title: '이벤트 안내',
    sec1Body: '정기배송을 처음 신청하시는 분께 첫 달 배송비를 무료로 드립니다. 매달 쓰는 것들을 한번 정해두면 알아서 집으로 찾아와요. 패드, 사료, 간식, 위생용품 — 어차피 필요한 것들이니까요.',
    sec2Title: '정기배송 혜택',
    sec2Body: '① 원하는 상품과 배송 주기 선택 (2주 / 4주 / 6주)\n② 첫 달 배송비 자동 면제\n③ 이후 매 배송 최대 15% 할인 + 무료배송\n\n언제든 건너뛰거나 해지할 수 있어요. 약정 없이 자유롭게 이용하세요.',
    benefits: [
      { icon: '📦', label: '첫 달 무료 배송', desc: '정기배송 신청 즉시 적용' },
      { icon: '💰', label: '매달 최대 15% 할인', desc: '정기배송 전용 할인가' },
      { icon: '⏭️', label: '건너뛰기 자유', desc: '언제든 일시중지 가능' },
    ],
    notice: '이벤트 기간: 2026년 4월 1일 – 5월 31일\n정기배송 첫 신청 시 1회에 한해 적용됩니다.\n배송 주기는 신청 후에도 자유롭게 변경 가능합니다.',
    ctaLabel: '정기배송 시작하기',
    detailImages: [],
  },
  {
    id: 4,
    title: '신상 리뷰 작성 이벤트',
    subtitle: '솔직한 후기를 남겨주시면 포인트를 드려요',
    status: 'ongoing',
    badge: '2026.05.01 – 05.31',
    startDate: '2026.05.01',
    endDate: '2026.05.31',
    bg: '#f4f6fb',
    accentColor: '#0041BD',
    image: '',
    pageUrl: '/',
    sec1Title: '이벤트 안내',
    sec1Body: '구매하신 상품의 솔직한 후기를 남겨주시면 포인트를 드립니다. 사진 리뷰는 더 많은 포인트를 받을 수 있어요. 다른 보호자들에게 진짜 도움이 되는 후기, 함께 만들어요.',
    sec2Title: '포인트 지급 기준',
    sec2Body: '· 텍스트 리뷰: 리뷰당 500P\n· 사진 포함 리뷰: 리뷰당 1,000P\n· 동영상 포함 리뷰: 리뷰당 2,000P\n\n포인트는 다음 구매 시 현금처럼 사용하실 수 있습니다.',
    benefits: [
      { icon: '⭐', label: '최대 2,000P 지급', desc: '리뷰 유형에 따라 차등 지급' },
      { icon: '🏆', label: '베스트 리뷰 선정', desc: '월 1회 추가 보상' },
      { icon: '💳', label: '포인트 현금 사용', desc: '다음 구매 시 바로 사용' },
    ],
    notice: '이벤트 기간: 2026년 5월 1일 – 5월 31일\n구매 확정 후 작성된 리뷰에 한해 포인트가 지급됩니다.\n동일 상품 리뷰는 1회만 인정됩니다.',
    ctaLabel: '상품 구경하고 리뷰 쓰기',
    detailImages: [],
  },
  {
    id: 5,
    title: '겨울 의류 특가 세일',
    subtitle: '이번 시즌 마지막 의류 특가, 놓치지 마세요',
    status: 'ended',
    badge: '2025.11.01 – 12.31',
    startDate: '2025.11.01',
    endDate: '2025.12.31',
    bg: '#e8edf5',
    accentColor: '#0041BD',
    image: '',
    pageUrl: '',
    sec1Title: '이벤트 안내',
    sec1Body: '겨울 시즌 의류 상품을 특가로 만나볼 수 있었던 기획전입니다. 이번 시즌 마지막 재고 소진을 위해 진행된 이벤트로, 현재는 종료되었습니다.',
    sec2Title: '진행 내용',
    sec2Body: '· 겨울 의류 카테고리 전 상품 최대 30% 할인\n· 두 벌 이상 구매 시 추가 10% 할인\n· 무료 배송\n\n다음 시즌 이벤트도 기대해 주세요.',
    benefits: [
      { icon: '🧥', label: '최대 30% 할인', desc: '겨울 의류 전 상품' },
      { icon: '➕', label: '추가 10% 할인', desc: '2벌 이상 구매 시' },
      { icon: '📦', label: '무료 배송', desc: '전 상품 적용' },
    ],
    notice: '이벤트 기간: 2025년 11월 1일 – 12월 31일 (종료)\n본 이벤트는 종료되었습니다.\n다음 이벤트는 공지사항에서 확인해 주세요.',
    ctaLabel: '진행중인 이벤트 보기',
    detailImages: [],
  },
  {
    id: 6,
    title: '크리스마스 기획전',
    subtitle: '반려견과 함께하는 특별한 크리스마스',
    status: 'ended',
    badge: '2025.12.01 – 12.25',
    startDate: '2025.12.01',
    endDate: '2025.12.25',
    bg: '#111',
    accentColor: '#ff4d6d',
    image: '',
    pageUrl: '',
    sec1Title: '이벤트 안내',
    sec1Body: '반려견과 함께하는 특별한 크리스마스를 위한 기획전이었습니다. 크리스마스 한정 굿즈와 특별 패키지를 선보였던 이벤트로, 현재는 종료되었습니다.',
    sec2Title: '진행 내용',
    sec2Body: '· 크리스마스 한정 선물 세트 판매\n· 구매 금액별 증정품 제공\n· 크리스마스 패키지 무료 포장\n\n즐거운 크리스마스를 함께해 주신 모든 분께 감사드립니다.',
    benefits: [
      { icon: '🎄', label: '한정 선물 세트', desc: '크리스마스 전용 패키지' },
      { icon: '🎁', label: '증정품 제공', desc: '구매 금액별 차등 증정' },
      { icon: '🎀', label: '무료 포장', desc: '크리스마스 패키지 포장' },
    ],
    notice: '이벤트 기간: 2025년 12월 1일 – 12월 25일 (종료)\n본 이벤트는 종료되었습니다.\n다음 이벤트는 공지사항에서 확인해 주세요.',
    ctaLabel: '진행중인 이벤트 보기',
    detailImages: [],
  },
];

const SESSION_KEY = 'wt_events_v1';

function persist() {
  if (typeof window !== 'undefined') {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(eventItems)); } catch { /* noop */ }
  }
}

// Client-side: restore saved edits from sessionStorage on module load
if (typeof window !== 'undefined') {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed: EventItem[] = JSON.parse(saved);
      eventItems.splice(0, eventItems.length, ...parsed);
    }
  } catch { /* noop */ }
}

let nextId = Math.max(...eventItems.map((e) => e.id)) + 1;

export function addEvent(ev: Omit<EventItem, 'id'>): EventItem[] {
  eventItems.push({ ...ev, id: nextId++ });
  persist();
  return eventItems.slice();
}

export function updateEvent(updated: EventItem): EventItem[] {
  const idx = eventItems.findIndex((e) => e.id === updated.id);
  if (idx !== -1) eventItems[idx] = updated;
  persist();
  return eventItems.slice();
}

export function deleteEvent(id: number): EventItem[] {
  const idx = eventItems.findIndex((e) => e.id === id);
  if (idx !== -1) eventItems.splice(idx, 1);
  persist();
  return eventItems.slice();
}
