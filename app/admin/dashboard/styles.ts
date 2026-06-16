import type { CSSProperties } from 'react';

export const inputStyle: CSSProperties = {
  width: '100%',
  border: '2px solid #111',
  borderRadius: '14px',
  padding: '12px 14px',
  fontSize: '14px',
  outline: 'none',
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: '120px',
  resize: 'vertical',
  fontFamily: 'inherit',
};

export const primaryButtonStyle: CSSProperties = {
  background: '#0041BD',
  color: '#fff',
  border: 'none',
  borderRadius: '14px',
  padding: '12px 20px',
  fontWeight: 800,
  fontSize: '14px',
  cursor: 'pointer',
};

export const ghostButtonStyle: CSSProperties = {
  background: '#fff',
  color: '#111',
  border: '2px solid #111',
  borderRadius: '14px',
  padding: '12px 20px',
  fontWeight: 800,
  fontSize: '14px',
  cursor: 'pointer',
};

export const dangerButtonStyle: CSSProperties = {
  background: '#ff4d6d',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '10px 16px',
  fontWeight: 800,
  fontSize: '13px',
  cursor: 'pointer',
};

export const cardStyle: CSSProperties = {
  background: '#fff',
  borderRadius: '24px',
  boxShadow: '0 24px 60px rgba(0,0,0,0.08)',
  padding: '36px 32px',
};

export const modalOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(17,17,17,0.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  zIndex: 1000,
};

export const modalCardStyle: CSSProperties = {
  background: '#fff',
  borderRadius: '24px',
  padding: '32px',
  width: '100%',
  maxWidth: '560px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
};

export const sectionStyle: CSSProperties = {
  border: '2px solid rgba(17,17,17,0.1)',
  borderRadius: '18px',
  padding: '20px',
  display: 'grid',
  gap: '14px',
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: '15px',
  fontWeight: 900,
  margin: 0,
  color: '#0041BD',
};

export const fieldLabelStyle: CSSProperties = {
  display: 'grid',
  gap: '6px',
  fontWeight: 700,
  fontSize: '13px',
};
