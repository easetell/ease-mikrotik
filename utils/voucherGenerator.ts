// utils/voucherGenerator.js
const generateVoucher = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let voucherCode = "";
  for (let i = 0; i < 8; i++) {
    voucherCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return voucherCode;
};

export default generateVoucher;
