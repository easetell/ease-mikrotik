import React from "react";

interface StatusIndicatorProps {
  expiryTime: Date; // Expiry time as a Date object
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ expiryTime }) => {
  const currentDate = new Date();

  // Determine if the expiry time is in the future or past
  const isActive = expiryTime > currentDate;

  return (
    <p
      className={`font-medium ${isActive ? "text-dark dark:text-white" : "text-red-500"}`}
    >
      {isActive ? "Active" : "Expired"}
    </p>
  );
};

export default StatusIndicator;
