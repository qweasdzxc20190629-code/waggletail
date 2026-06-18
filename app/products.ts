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
