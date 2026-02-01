import React from "react";
import styles from "./Times.module.css";
import Time from "@/components/Time/Time";

interface Bookings {
  dateTime: string; 
}

interface TimesProps {
  today: boolean;
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

const Times: React.FC<TimesProps> = ({ today, booked, selectedTime, setSelectedTime }) => {
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

  // Get current ET time as a Date object
  const nowET = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York"
  });
  const currentET = new Date(nowET);

  // Function to convert time string to Date object for comparison
  const timeToDate = (timeStr: string): Date => {
    const cleanTime = timeStr.replace(" ET", "");
    const [time, ampm] = cleanTime.split(/(?=[AP]M)/); // Split at AM/PM
    const [hours, minutes] = time.split(":").map(Number);
    
    // Create a date object for today with the given time
    const date = new Date(currentET);
    let hour24 = hours;
    
    if (ampm === 'PM' && hours !== 12) hour24 = hours + 12;
    if (ampm === 'AM' && hours === 12) hour24 = 0;
    
    date.setHours(hour24, minutes, 0, 0);
    return date;
  };

  // Function to check if time has passed
  const isTimePassed = (timeSlot: string): boolean => {
    const slotDate = timeToDate(timeSlot);
    return slotDate < currentET;
  };

  return (
    <div className={styles.times}>
      {times.map((time) => {
        const cleanTime = time.replace(" ET", "");
        const isBooked = bookedTimes[cleanTime] || false;
        const isPastTime = today && isTimePassed(time);
        const isOccupied = isBooked || isPastTime;
        
        return (
          <Time
            key={time}
            time={time}
            occupied={isOccupied}
            selected={time === selectedTime}
            onClick={() => handleTimeClick(time, isOccupied)}
          />
        );
      })}
    </div>
  );
};

export default Times;