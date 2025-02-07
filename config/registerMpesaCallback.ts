import axios from "axios";
import getMpesaToken from "@/config/mpesaAuth";

const registerMpesaCallback = async () => {
  try {
    const token = await getMpesaToken();
    if (!token) throw new Error("Failed to retrieve M-Pesa token");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
      {
        ShortCode: "4112369", // Your Paybill number
        ResponseType: "Completed",
        ConfirmationURL:
          "https://833d-41-90-67-4.ngrok-free.app/api/mpesa-confirm",
        ValidationURL:
          "https://833d-41-90-67-4.ngrok-free.app//api/mpesa/validate",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    console.log("✅ C2B Registration Successful:", response.data);
  } catch (error) {
    console.error("❌ C2B Registration Failed:", error);
  }
};

export default registerMpesaCallback;
