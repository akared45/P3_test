export const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(val);
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
  const dayjs = require('dayjs');
  return dayjs(date).format(format);
};