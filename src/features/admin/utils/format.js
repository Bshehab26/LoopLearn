// src/features/admin/utils/format.js

export const formatCurrency = (currency, amount) => {
  const num = Number(amount ?? 0).toFixed(2);
  const sym = currency || '$';
  return sym.length > 1 ? `${sym} ${num}` : `${sym}${num}`;
};

export const formatNumber = (value) => Number(value ?? 0).toLocaleString();
