import React from "react";

interface StatusIndicatorProps {
  expiryTime: string | null | undefined; // Allow nullable values
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ expiryTime }) => {
  if (!expiryTime) {
    return <p className="text-gray-500">Invalid Date</p>; // Handle missing dates
  }

  let parsedExpiryTime: Date | null = null;

  try {
    // Detect format and parse accordingly
    if (expiryTime.includes("T")) {
      // ISO Format: YYYY-MM-DDTHH:mm:ss.sssZ
      parsedExpiryTime = new Date(expiryTime);
    } else {
      // Expected Format: MM/DD/YYYY, HH:MM:SS AM/PM
      const [datePart, timePart] = expiryTime.split(", ");
      const [month, day, year] = datePart.split("/");
      const [time, modifier] = timePart.split(" ");
      let [hours, minutes, seconds] = time.split(":");

      // Convert hours to 24-hour format
      if (modifier === "PM" && hours !== "12") {
        hours = String(Number(hours) + 12);
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00";
      }

      parsedExpiryTime = new Date(
        `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours}:${minutes}:${seconds}`,
      );
    }
  } catch (error) {
    console.error("Error parsing expiryTime:", error);
  }

  if (!parsedExpiryTime || isNaN(parsedExpiryTime.getTime())) {
    return <p className="text-gray-500">Invalid Date</p>; // Handle parsing errors
  }

  const currentDate = new Date();
  const isActive = parsedExpiryTime > currentDate;

  return (
    <p
      className={`font-medium ${isActive ? "text-green-500" : "text-red-500"}`}
    >
      {isActive ? "Active" : "Expired"}
    </p>
  );
};

export default StatusIndicator;
