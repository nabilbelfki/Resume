import React, { useState } from "react";
import styles from "./Times.module.css";
import Time from "./Time";

// interface TimesProps {}

const Times: React.FC<{}> = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const times = [
    "11:00AM ET",
    "11:30AM ET",
    "12:00PM ET",
    "12:30PM ET",
    "1:00PM ET",
    "1:30PM ET",
    "2:00PM ET",
    "2:30PM ET",
    "3:00PM ET",
    "3:30PM ET",
    "4:00PM ET",
    "4:30PM ET",
    "5:00PM ET",
    "5:30PM ET",
  ];

  const handleTimeClick = (time: string, occupied: boolean) => {
    if (occupied) return; // Do nothing if the time is occupied
    setSelectedTime((prevSelectedTime) =>
      prevSelectedTime === time ? null : time
    );
  };

  return (
    <div className={styles.times}>
      {times.map((time, index) => (
        <Time
          key={index}
          time={time}
          occupied={index < 5}
          selected={time === selectedTime}
          onClick={() => handleTimeClick(time, index < 5)}
        />
      ))}
    </div>
  );
};

export default Times;
