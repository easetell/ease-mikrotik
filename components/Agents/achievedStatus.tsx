import React from 'react';

const achievedStatus = (target: number, achieved: number) => {
    const formattedAchieved = Intl.NumberFormat().format(achieved);
    if (achieved < target) {
        return <span className="text-red">Ksh. {formattedAchieved}</span>;
    } else {
        return <span className="text-green">Ksh. {formattedAchieved}</span>;
    }
};

export default achievedStatus;