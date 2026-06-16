export type ProductOptionGroup = {
  id: string;
  name: string; // 옵션명, e.g. "색상"
  values: string[]; // 옵션값, e.g. ["빨강", "파랑", "검정"]
};

export type ProductOptionCombination = {
  key: string; // values joined with "|", used to match a combination across edits
  values: string[]; // one value per option group, same order as optionGroups
  originalPrice: number; // 정상가
  salePrice: number; // 판매가
  discountPrice?: number; // 할인가
  stock: number; // 재고수량
};

export type Product = {
  id: string;

  // 기본 정보
  name: string; // 노출상품명 (필수)
  sellerName?: string; // 등록상품명 (판매자관리용)
  category: string; // 필수

  // 옵션
  optionGroups?: ProductOptionGroup[];
  optionCombinations?: ProductOptionCombination[];

  // 이미지
  image: string; // 대표이미지
  additionalImages?: string[]; // 추가이미지

  // 설명
  desc: string; // 목록 카드에 노출되는 짧은 설명
  detailDescription?: string; // 상세설명 텍스트
  detailImages?: string[]; // 상세설명 이미지

  // 가격 정보
  originalPrice?: number; // 정상가(원가)
  price: number; // 판매가 (필수)
  discountPrice?: number; // 할인가

  // 배송 정보
  shippingOrigin?: string; // 출고지
  freeShipping?: boolean; // 무료배송 여부
  shippingFee?: number; // 배송비 (무료배송이 아닐 때)
  leadTime?: number; // 출고 소요일

  // 반품/교환
  returnAddress?: string; // 반품지
  returnShippingFee?: number; // 반품배송비
};

export const categories = [
  '베드',
  '간식',
  '영양제',
  '산책용품',
  '배변·위생',
  '의류',
  '장난감',
  '목욕·미용',
];

// Seed data predates image uploads, so there are no real product photos yet.
// This renders the old emoji into a simple inline SVG data URL, so `image`
// is a real displayable image (consistent with uploaded products) instead
// of a bare emoji character that pages would render as text.
function placeholderImage(emoji: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="${background}"/><text x="50%" y="54%" font-size="200" text-anchor="middle" dominant-baseline="middle">${emoji}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: '포근 도넛 베드',
    desc: '사계절 쓰는 분리형 커버 · S/M/L',
    category: '베드',
    price: 39900,
    image: placeholderImage('🛏️', '#DCE7FF'),
  },
  {
    id: 'p2',
    name: '영양 가득 닭가슴살 간식',
    desc: '저알러지 레시피 · 한 입 간식',
    category: '간식',
    price: 12900,
    image: placeholderImage('🍗', '#FFF3D6'),
  },
  {
    id: 'p3',
    name: '하루 한 줌 영양제',
    desc: '비타민·오메가3 · 피부/모질 케어',
    category: '영양제',
    price: 18900,
    image: placeholderImage('💊', '#E6F4EA'),
  },
  {
    id: 'p4',
    name: '초경량 산책 하네스',
    desc: '반려동물 체형 맞춤 · 통기성 우수',
    category: '산책용품',
    price: 25900,
    image: placeholderImage('🐕', '#FDE2E4'),
  },
  {
    id: 'p5',
    name: '흡수력 좋은 배변패드',
    desc: '대형 사이즈 · 냄새 차단',
    category: '배변·위생',
    price: 15900,
    image: placeholderImage('🧻', '#EAEAEA'),
  },
  {
    id: 'p6',
    name: '부드러운 웜 후드',
    desc: '겨울 방한 · 세탁 가능',
    category: '의류',
    price: 22900,
    image: placeholderImage('🧥', '#E0F7FA'),
  },
  {
    id: 'p7',
    name: '튼튼한 장난감 세트',
    desc: ' chew toy + 공 · 스트레스 해소',
    category: '장난감',
    price: 19900,
    image: placeholderImage('🎾', '#F1F8E9'),
  },
  {
    id: 'p8',
    name: '프리미엄 샴푸',
    desc: '저자극 거품 · 은은한 향',
    category: '목욕·미용',
    price: 14900,
    image: placeholderImage('🛁', '#EDE7F6'),
  },
];

export function deleteProduct(id: string) {
  const index = products.findIndex((product) => product.id === id);
  if (index !== -1) {
    products.splice(index, 1);
  }
}

export function addProduct(product: Product) {
  if (!products.some((item) => item.id === product.id)) {
    products.push(product);
  }
}

export function updateProduct(updated: Product) {
  const index = products.findIndex((product) => product.id === updated.id);
  if (index !== -1) {
    products[index] = updated;
  }
}

// Shared price display logic so storefront pages (home, category, detail) and
// any future surface all compute "정가/판매가/할인가 → 최종가 + 할인율" the same way.
// basePrice is what gets shown struck-through; finalPrice is the big number;
// discountPercent is 0 when there's nothing to discount from.
export function computeDisplayPrice(pricing: { originalPrice?: number; price: number; discountPrice?: number }) {
  const basePrice = pricing.originalPrice ?? pricing.price;
  const finalPrice = pricing.discountPrice ?? pricing.price;
  const discountPercent = basePrice > finalPrice ? Math.round((1 - finalPrice / basePrice) * 100) : 0;
  return { basePrice, finalPrice, discountPercent };
}

export function getDisplayPrice(product: Product) {
  return computeDisplayPrice(product);
}
