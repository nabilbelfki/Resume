"use client";
import React from "react";
import Image from "next/image";
import styles from "./AddCalendar.module.css";

interface AddCalendarProps {
  dateTime: Date;
}

const AddCalendar: React.FC<AddCalendarProps> = ({ dateTime }) => {

  const mobileWidth = 640;
  const screenWidth = window.innerWidth;

  const handleAddToCalendar = () => {
    const icsContent = generateICSFile(dateTime, "Meeting with Nabil Belfki", "This is a free consultation with me to get to know you and your business. You can tell me anything that you like and hopefully I can help you acheive your goals and build something truly amazing", "Online");

    // Create a blob from the iCalendar file content
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.ics';
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles["add-calendar"]} onClick={handleAddToCalendar}>
      {/* {screenWidth <= mobileWidth && ( */}
        <Image src="/images/calendar-binding-horizontal.svg" className={styles[`horizontal-binding`]} alt="Calendar Binding" width="94" height="108" />
        {/* )}       */}
      {/* {screenWidth > mobileWidth && (<Image src="/images/calendar-binding.svg" className={styles[`vertical-binding`]} alt="Calendar Binding" width="94" height="108" />)}       */}
      <div className={styles.text}>Add this Event to your Calendar Application</div>
    </div>
  );
};

const generateICSFile = (dateTime: Date, summary: string = 'Event', description: string = '', location: string = '') => {
  const startDate = dateTime.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, -1); // Format: YYYYMMDDTHHMMSSZ
  const endDate = new Date(dateTime.getTime() + 30 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, -1); // 30 minutes later

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Math.random().toString(36).substr(2, 9)}@nabilbelfki.com
DTSTAMP:${startDate}Z
DTSTART:${startDate}Z
DTEND:${endDate}Z
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
  `.trim();
};

export default AddCalendar;
