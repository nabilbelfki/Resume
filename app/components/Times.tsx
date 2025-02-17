import React from "react";
import styles from "./Times.module.css";
import Time from "./Time";

interface Bookings {
  dateTime: string; 
}

interface TimesProps {
  booked: Bookings[];
  selectedTime: string | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | null>>;
}

// Helper function to convert UTC to ET
const convertUtcToEt = (utcDateStr: string): string => {
  const utcDate = new Date(utcDateStr);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  }).format(utcDate).replace(' ', '');
};

const Times: React.FC<TimesProps> = ({ booked, selectedTime, setSelectedTime }) => {
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

  console.log(booked);
  // Extract booked times and convert them to ET
  const bookedTimes = booked.reduce((acc, booking) => {
    const etTime = convertUtcToEt(booking.dateTime);
    acc[etTime] = true;
    return acc;
  }, {} as { [key: string]: boolean });

  const handleTimeClick = (time: string, occupied: boolean) => {
    if (occupied) return; // Do nothing if the time is occupied
    setSelectedTime((prevSelectedTime) =>
      prevSelectedTime === time ? null : time
    );
  };

  return (
    <div className={styles.times}>
      {times.map((time) => (
        <Time
          key={time}
          time={time}
          occupied={bookedTimes[time.replace(" ET","")] || false}
          selected={time === selectedTime}
          onClick={() => handleTimeClick(time, bookedTimes[time] || false)}
        />
      ))}
    </div>
  );
};

export default Times;
