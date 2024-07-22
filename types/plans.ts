export type Plans = {
  mikrotikId: string;
  "local-address": string;
  name: string;
  "rate-limit": string;
  "remote-address": string;
  price: number;
  duration: number; // duration in days or months, depending on your use case
  moduleType: string;
};
