import React from "react";

const renderDuration = (duration: number) => {
  if (duration === 30) {
    return <span>1 Month</span>;
  } else {
    return <span>{duration} days</span>;
  }
};

export default renderDuration;
