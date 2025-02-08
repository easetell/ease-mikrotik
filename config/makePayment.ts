import initiateSTKPush from "./stkPush";

export async function makePayment() {
  try {
    const phoneNumber = "254114241145"; // Replace with the customer's phone number
    const amount = 10; // Replace with the payment amount
    const accountNumber = "aljauzy-easetell"; // Replace with the client's account number
    const MpesaReceiptNumber = "ABC123";

    console.log("Initiating STK Push payment...");
    const response = await initiateSTKPush(phoneNumber, amount, accountNumber);
    console.log("STK Push response:", response);

    return response;
  } catch (error) {
    console.error("Failed to initiate STK Push:", error);
    throw error;
  }
}
