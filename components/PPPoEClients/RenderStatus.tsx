import React from "react";

interface StatusIndicatorProps {
  name: string;
  status: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ name, status }) => {
  return (
    <h5
      className={`font-medium ${status === "inactive" ? "text-red-500" : "text-dark dark:text-white"}`}
    >
      {name}
    </h5>
  );
};

export default StatusIndicator;
