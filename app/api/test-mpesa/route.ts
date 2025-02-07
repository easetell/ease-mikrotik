import getMpesaToken from "@/config/mpesaAuth";
import axios from "axios";

async function simulateC2BTransaction() {
  const accessToken = await getMpesaToken();
  if (!accessToken) {
    console.error("Failed to get access token");
    return;
  }

  const requestBody = {
    ShortCode: 4112369,
    CommandID: "CustomerPayBillOnline",
    Amount: 1000,
    Msisdn: "254708374149",
    BillRefNumber: "12345678",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v2/simulate",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("C2B Simulation Response:", response.data);
  } catch (error) {
    console.error("C2B Simulation Error:", error);
  }
}

simulateC2BTransaction();
