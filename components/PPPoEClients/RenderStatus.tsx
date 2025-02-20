import React from "react";

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <span
      className={`badge rounded px-2 py-1 text-white ${
        status === "inactive" ? "text-red-500" : "text-dark dark:text-white"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusIndicator;
