// utils/checkoutRequestIDGenerator.js
const generateCheckoutRequestID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let checkoutRequestID = "";
  for (let i = 0; i < 24; i++) {
    checkoutRequestID += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  return checkoutRequestID;
};

export default generateCheckoutRequestID;
