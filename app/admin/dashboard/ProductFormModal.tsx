'use client';

import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from 'react';
import { Product, ProductOptionCombination, ProductOptionGroup, categories } from '../../products';
import {
  dangerButtonStyle,
  fieldLabelStyle,
  ghostButtonStyle,
  inputStyle,
  modalCardStyle,
  modalOverlayStyle,
  primaryButtonStyle,
  sectionStyle,
  sectionTitleStyle,
  textareaStyle,
} from './styles';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB — keeps the in-memory base64 payload reasonable

type OptionGroupForm = {
  id: string;
  name: string;
  valuesText: string; // raw comma-separated input, e.g. "빨강, 파랑, 검정"
};

type ComboForm = {
  key: string;
  values: string[];
  originalPrice: string;
  salePrice: string;
  discountPrice: string;
  stock: string;
};

type FormState = {
  name: string;
  sellerName: string;
  category: string;

  optionGroups: OptionGroupForm[];
  combos: ComboForm[];

  mainImage: string;
  additionalImages: string[];

  desc: string;
  detailDescription: string;
  detailImages: string[];

  originalPrice: string;
  price: string;
  discountPrice: string;

  shippingOrigin: string;
  freeShipping: boolean;
  shippingFee: string;
  leadTime: string;

  returnAddress: string;
  returnShippingFee: string;
};

function buildInitialState(product: Product | null): FormState {
  if (!product) {
    return {
      name: '',
      sellerName: '',
      category: '',
      optionGroups: [],
      combos: [],
      mainImage: '',
      additionalImages: [],
      desc: '',
      detailDescription: '',
      detailImages: [],
      originalPrice: '',
      price: '',
      discountPrice: '',
      shippingOrigin: '',
      freeShipping: true,
      shippingFee: '0',
      leadTime: '2',
      returnAddress: '',
      returnShippingFee: '0',
    };
  }

  return {
    name: product.name,
    sellerName: product.sellerName ?? '',
    category: product.category,
    optionGroups: (product.optionGroups ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      valuesText: group.values.join(', '),
    })),
    combos: (product.optionCombinations ?? []).map((combo) => ({
      key: combo.key,
      values: combo.values,
      originalPrice: combo.originalPrice !== undefined ? String(combo.originalPrice) : '',
      salePrice: String(combo.salePrice),
      discountPrice: combo.discountPrice !== undefined ? String(combo.discountPrice) : '',
      stock: String(combo.stock),
    })),
    mainImage: product.image,
    additionalImages: product.additionalImages ?? [],
    desc: product.desc,
    detailDescription: product.detailDescription ?? '',
    detailImages: product.detailImages ?? [],
    originalPrice: product.originalPrice !== undefined ? String(product.originalPrice) : '',
    price: String(product.price),
    discountPrice: product.discountPrice !== undefined ? String(product.discountPrice) : '',
    shippingOrigin: product.shippingOrigin ?? '',
    freeShipping: product.freeShipping ?? true,
    shippingFee: product.shippingFee !== undefined ? String(product.shippingFee) : '0',
    leadTime: product.leadTime !== undefined ? String(product.leadTime) : '2',
    returnAddress: product.returnAddress ?? '',
    returnShippingFee: product.returnShippingFee !== undefined ? String(product.returnShippingFee) : '0',
  };
}

function parseValues(valuesText: string): string[] {
  return valuesText
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce<string[][]>((acc, curr) => acc.flatMap((a) => curr.map((v) => [...a, v])), [[]]);
}

// Recomputes the option-combination table from the current option groups,
// reusing any price/stock already entered for combinations that still exist.
function regenerateCombos(
  groups: OptionGroupForm[],
  existingCombos: ComboForm[],
  defaults: { originalPrice: string; salePrice: string; discountPrice: string }
): ComboForm[] {
  const valueArrays = groups.map((group) => parseValues(group.valuesText)).filter((values) => values.length > 0);

  if (valueArrays.length === 0) return [];

  return cartesianProduct(valueArrays).map((values) => {
    const key = values.join('|');
    const existing = existingCombos.find((combo) => combo.key === key);
    return (
      existing ?? {
        key,
        values,
        originalPrice: defaults.originalPrice,
        salePrice: defaults.salePrice,
        discountPrice: defaults.discountPrice,
        stock: '0',
      }
    );
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={sectionStyle}>
      <h4 style={sectionTitleStyle}>{title}</h4>
      {children}
    </div>
  );
}

function ImageThumbGrid({
  images,
  onRemove,
}: {
  images: string[];
  onRemove: (index: number) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {images.map((src, index) => (
        <div key={index} style={{ position: 'relative', width: '72px', height: '72px' }}>
          <img src={src} alt={`이미지 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)' }} />
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label="이미지 삭제"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: 'none',
              background: '#ff4d6d',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(product));
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ----- option groups -----
  const addOptionGroup = () => {
    setForm((prev) => ({
      ...prev,
      optionGroups: [...prev.optionGroups, { id: `og${Date.now()}`, name: '', valuesText: '' }],
    }));
  };

  const updateOptionGroup = (id: string, field: 'name' | 'valuesText', value: string) => {
    setForm((prev) => {
      const optionGroups = prev.optionGroups.map((group) => (group.id === id ? { ...group, [field]: value } : group));
      const combos = regenerateCombos(optionGroups, prev.combos, {
        originalPrice: prev.originalPrice,
        salePrice: prev.price,
        discountPrice: prev.discountPrice,
      });
      return { ...prev, optionGroups, combos };
    });
  };

  const removeOptionGroup = (id: string) => {
    setForm((prev) => {
      const optionGroups = prev.optionGroups.filter((group) => group.id !== id);
      const combos = regenerateCombos(optionGroups, prev.combos, {
        originalPrice: prev.originalPrice,
        salePrice: prev.price,
        discountPrice: prev.discountPrice,
      });
      return { ...prev, optionGroups, combos };
    });
  };

  const updateCombo = (key: string, field: keyof Omit<ComboForm, 'key' | 'values'>, value: string) => {
    setForm((prev) => ({
      ...prev,
      combos: prev.combos.map((combo) => (combo.key === key ? { ...combo, [field]: value } : combo)),
    }));
  };

  // ----- images -----
  const handleMainImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('이미지 크기는 2MB 이하로 업로드해주세요.');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setForm((prev) => ({ ...prev, mainImage: dataUrl }));
    setError('');
  };

  const handleMultiImageUpload = async (event: ChangeEvent<HTMLInputElement>, field: 'additionalImages' | 'detailImages') => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError('이미지 크기는 2MB 이하로 업로드해주세요.');
        return;
      }
    }

    const dataUrls = await Promise.all(files.map(readFileAsDataUrl));
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ...dataUrls] }));
    setError('');
  };

  const removeImageAt = (field: 'additionalImages' | 'detailImages', index: number) => {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  // ----- submit -----
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.category || !form.price) {
      setError('노출상품명, 카테고리, 판매가는 필수입니다.');
      return;
    }
    if (!form.mainImage) {
      setError('대표이미지를 업로드해주세요.');
      return;
    }

    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      setError('판매가를 올바른 숫자로 입력해주세요.');
      return;
    }

    let originalPrice: number | undefined;
    if (form.originalPrice) {
      originalPrice = Number(form.originalPrice);
      if (Number.isNaN(originalPrice) || originalPrice < 0) {
        setError('정상가를 올바른 숫자로 입력해주세요.');
        return;
      }
    }

    let discountPrice: number | undefined;
    if (form.discountPrice) {
      discountPrice = Number(form.discountPrice);
      if (Number.isNaN(discountPrice) || discountPrice < 0) {
        setError('할인가를 올바른 숫자로 입력해주세요.');
        return;
      }
    }

    const validGroups = form.optionGroups
      .map((group) => ({ ...group, name: group.name.trim(), valuesText: group.valuesText.trim() }))
      .filter((group) => group.name && group.valuesText);

    const finalCombos = regenerateCombos(validGroups, form.combos, {
      originalPrice: form.originalPrice,
      salePrice: form.price,
      discountPrice: form.discountPrice,
    });

    const optionCombinations: ProductOptionCombination[] = [];
    for (const combo of finalCombos) {
      const comboSalePrice = Number(combo.salePrice || form.price);
      if (Number.isNaN(comboSalePrice) || comboSalePrice < 0) {
        setError(`옵션(${combo.values.join(' / ')}) 판매가를 올바른 숫자로 입력해주세요.`);
        return;
      }
      const comboStock = Number(combo.stock || 0);
      if (Number.isNaN(comboStock) || comboStock < 0) {
        setError(`옵션(${combo.values.join(' / ')}) 재고수량을 올바른 숫자로 입력해주세요.`);
        return;
      }
      let comboOriginalPrice: number | undefined;
      if (combo.originalPrice) {
        comboOriginalPrice = Number(combo.originalPrice);
        if (Number.isNaN(comboOriginalPrice) || comboOriginalPrice < 0) {
          setError(`옵션(${combo.values.join(' / ')}) 정상가를 올바른 숫자로 입력해주세요.`);
          return;
        }
      }
      let comboDiscountPrice: number | undefined;
      if (combo.discountPrice) {
        comboDiscountPrice = Number(combo.discountPrice);
        if (Number.isNaN(comboDiscountPrice) || comboDiscountPrice < 0) {
          setError(`옵션(${combo.values.join(' / ')}) 할인가를 올바른 숫자로 입력해주세요.`);
          return;
        }
      }

      optionCombinations.push({
        key: combo.key,
        values: combo.values,
        originalPrice: comboOriginalPrice ?? originalPrice ?? price,
        salePrice: comboSalePrice,
        discountPrice: comboDiscountPrice,
        stock: comboStock,
      });
    }

    const optionGroups: ProductOptionGroup[] = validGroups.map((group) => ({
      id: group.id,
      name: group.name,
      values: parseValues(group.valuesText),
    }));

    const shippingFee = form.freeShipping ? 0 : Number(form.shippingFee || 0);
    if (Number.isNaN(shippingFee) || shippingFee < 0) {
      setError('배송비를 올바른 숫자로 입력해주세요.');
      return;
    }

    const leadTime = form.leadTime ? Number(form.leadTime) : undefined;
    if (leadTime !== undefined && (Number.isNaN(leadTime) || leadTime < 0)) {
      setError('출고 소요일을 올바른 숫자로 입력해주세요.');
      return;
    }

    const returnShippingFee = form.returnShippingFee ? Number(form.returnShippingFee) : undefined;
    if (returnShippingFee !== undefined && (Number.isNaN(returnShippingFee) || returnShippingFee < 0)) {
      setError('반품배송비를 올바른 숫자로 입력해주세요.');
      return;
    }

    const result: Product = {
      id: product?.id ?? `p${Date.now()}`,
      name: form.name.trim(),
      sellerName: form.sellerName.trim() || undefined,
      category: form.category,

      optionGroups: optionGroups.length > 0 ? optionGroups : undefined,
      optionCombinations: optionCombinations.length > 0 ? optionCombinations : undefined,

      image: form.mainImage,
      additionalImages: form.additionalImages.length > 0 ? form.additionalImages : undefined,

      desc: form.desc.trim() || form.detailDescription.trim().slice(0, 60),
      detailDescription: form.detailDescription.trim() || undefined,
      detailImages: form.detailImages.length > 0 ? form.detailImages : undefined,

      originalPrice,
      price,
      discountPrice,

      shippingOrigin: form.shippingOrigin.trim() || undefined,
      freeShipping: form.freeShipping,
      shippingFee,
      leadTime,

      returnAddress: form.returnAddress.trim() || undefined,
      returnShippingFee,
    };

    onSave(result);
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={{ ...modalCardStyle, maxWidth: '820px' }} onClick={(event) => event.stopPropagation()}>
        <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 20px' }}>{product ? '상품 수정' : '상품 추가'}</h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <Section title="기본 정보">
            <label style={fieldLabelStyle}>
              노출상품명 *
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="고객에게 보여지는 상품명" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              등록상품명 (판매자관리용)
              <input value={form.sellerName} onChange={(e) => setForm({ ...form, sellerName: e.target.value })} placeholder="내부 관리용 상품명" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              카테고리 *
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                <option value="">카테고리 선택</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </Section>

          <Section title="옵션">
            <div style={{ display: 'grid', gap: '10px' }}>
              {form.optionGroups.map((group) => (
                <div key={group.id} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    value={group.name}
                    onChange={(e) => updateOptionGroup(group.id, 'name', e.target.value)}
                    placeholder="옵션명 (예: 색상)"
                    style={{ ...inputStyle, flex: '1 1 140px' }}
                  />
                  <input
                    value={group.valuesText}
                    onChange={(e) => updateOptionGroup(group.id, 'valuesText', e.target.value)}
                    placeholder="옵션값 (쉼표로 구분, 예: 빨강, 파랑, 검정)"
                    style={{ ...inputStyle, flex: '2 1 240px' }}
                  />
                  <button type="button" onClick={() => removeOptionGroup(group.id)} style={dangerButtonStyle}>삭제</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOptionGroup} style={{ ...ghostButtonStyle, justifySelf: 'start' }}>옵션명 추가</button>

            {form.combos.length > 0 && (
              <div style={{ display: 'grid', gap: '10px', overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#555', padding: '0 4px' }}>
                  <span>옵션</span>
                  <span>정상가</span>
                  <span>판매가</span>
                  <span>할인가</span>
                  <span>재고수량</span>
                </div>
                {form.combos.map((combo) => (
                  <div key={combo.key} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '8px', alignItems: 'center', padding: '10px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{combo.values.join(' / ')}</span>
                    <input value={combo.originalPrice} onChange={(e) => updateCombo(combo.key, 'originalPrice', e.target.value)} placeholder="정상가" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} />
                    <input value={combo.salePrice} onChange={(e) => updateCombo(combo.key, 'salePrice', e.target.value)} placeholder="판매가" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} />
                    <input value={combo.discountPrice} onChange={(e) => updateCombo(combo.key, 'discountPrice', e.target.value)} placeholder="할인가" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} />
                    <input value={combo.stock} onChange={(e) => updateCombo(combo.key, 'stock', e.target.value)} placeholder="재고수량" style={{ ...inputStyle, padding: '8px 10px', fontSize: '13px' }} />
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="이미지">
            <div style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>대표이미지 *</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '96px', height: '96px', flexShrink: 0, borderRadius: '14px', border: '2px dashed rgba(0,0,0,0.2)', background: '#f4f6fb', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                  {form.mainImage ? (
                    <img src={form.mainImage} alt="대표이미지 미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '0 6px' }}>미리보기</span>
                  )}
                </div>
                <label style={{ ...ghostButtonStyle, display: 'inline-flex', alignItems: 'center' }}>
                  대표이미지 업로드
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>추가이미지</span>
              <ImageThumbGrid images={form.additionalImages} onRemove={(index) => removeImageAt('additionalImages', index)} />
              <label style={{ ...ghostButtonStyle, display: 'inline-flex', alignItems: 'center', justifySelf: 'start' }}>
                추가이미지 업로드
                <input type="file" accept="image/*" multiple onChange={(e) => handleMultiImageUpload(e, 'additionalImages')} style={{ display: 'none' }} />
              </label>
            </div>
          </Section>

          <Section title="상세설명">
            <label style={fieldLabelStyle}>
              카드 요약 설명 (목록에 표시)
              <input value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="비워두면 상세설명 앞부분을 자동으로 사용합니다" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              상세설명 텍스트
              <textarea value={form.detailDescription} onChange={(e) => setForm({ ...form, detailDescription: e.target.value })} placeholder="상품 상세설명을 입력하세요" style={textareaStyle} />
            </label>
            <div style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>상세설명 이미지</span>
              <ImageThumbGrid images={form.detailImages} onRemove={(index) => removeImageAt('detailImages', index)} />
              <label style={{ ...ghostButtonStyle, display: 'inline-flex', alignItems: 'center', justifySelf: 'start' }}>
                상세설명 이미지 업로드
                <input type="file" accept="image/*" multiple onChange={(e) => handleMultiImageUpload(e, 'detailImages')} style={{ display: 'none' }} />
              </label>
            </div>
          </Section>

          <Section title="가격 정보">
            <label style={fieldLabelStyle}>
              정상가 (원가)
              <input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="숫자만 입력" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              판매가 *
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="숫자만 입력" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              할인가
              <input value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="숫자만 입력 (선택)" style={inputStyle} />
            </label>
          </Section>

          <Section title="배송 정보">
            <label style={fieldLabelStyle}>
              출고지
              <input value={form.shippingOrigin} onChange={(e) => setForm({ ...form, shippingOrigin: e.target.value })} placeholder="예: 경기도 이천시" style={inputStyle} />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px' }}>
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              무료배송
            </label>
            {!form.freeShipping && (
              <label style={fieldLabelStyle}>
                배송비
                <input value={form.shippingFee} onChange={(e) => setForm({ ...form, shippingFee: e.target.value })} placeholder="숫자만 입력" style={inputStyle} />
              </label>
            )}
            <label style={fieldLabelStyle}>
              출고 소요일
              <input value={form.leadTime} onChange={(e) => setForm({ ...form, leadTime: e.target.value })} placeholder="예: 2 (일)" style={inputStyle} />
            </label>
          </Section>

          <Section title="반품/교환">
            <label style={fieldLabelStyle}>
              반품지
              <input value={form.returnAddress} onChange={(e) => setForm({ ...form, returnAddress: e.target.value })} placeholder="반품 수거지 주소" style={inputStyle} />
            </label>
            <label style={fieldLabelStyle}>
              반품배송비
              <input value={form.returnShippingFee} onChange={(e) => setForm({ ...form, returnShippingFee: e.target.value })} placeholder="숫자만 입력" style={inputStyle} />
            </label>
          </Section>

          {error && <p style={{ color: '#d52b1e', margin: 0, fontWeight: 700 }}>{error}</p>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={primaryButtonStyle}>저장</button>
            <button type="button" onClick={onClose} style={ghostButtonStyle}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
}
