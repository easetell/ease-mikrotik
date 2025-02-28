import React from "react";

interface StatusIndicatorProps {
  expiryTime: string; // Expiry time as a string in "MM/DD/YYYY, HH:MM:SS AM/PM" format
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ expiryTime }) => {
  // Parse the expiry time string into a Date object
  const parseExpiryTime = (expiryTime: string): Date => {
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

    // Create a new Date object
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  };

  const parsedExpiryTime = parseExpiryTime(expiryTime);
  const currentDate = new Date();

  // Determine if the expiry time is in the future or past
  const isActive = parsedExpiryTime > currentDate;

  return (
    <p
      className={`font-medium ${isActive ? "text-dark dark:text-white" : "text-red-500"}`}
    >
      {isActive ? "Active" : "Expired"}
    </p>
  );
};

export default StatusIndicator;
