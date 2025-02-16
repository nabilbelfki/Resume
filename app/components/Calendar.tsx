"use client";
import React, { useState } from "react";
import styles from "./Calendar.module.css";
import moreStyles from "./ScheduleMeeting.module.css";
import Popup from "./Popup";
import Button from "./Button";
import Times from "./Times";

interface Bookings {
  dateTime: string; 
}

const Calendar: React.FC<unknown> = () => {
  const [meetings, setMeetings] = useState<Bookings[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showing, setShowing] = useState(false);
  const [page, setPage] = useState("times");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value);
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNotes(e.target.value);

  const bookMeeting = async () => {
    if (page === "times") {
      setPage("contact");
    } else {
      let dateTime: Date | null = null;
      let dateString = "";
      const time = selectedTime;
      const date = formatDate(selectedDate);
  
      if (selectedDate && time) {
        const timeMatch = time.match(/(\d{1,2}:\d{2})([AP]M)/);
        if (timeMatch) {
          const [hoursAndMinutes, period] = timeMatch.slice(1, 3);
          let [hourString, minuteString] = hoursAndMinutes.split(":");
          let hour = parseInt(hourString, 10);
          let minute = parseInt(minuteString, 10);
  
          // Handle AM/PM conversion
          if (period === "PM" && hour !== 12) {
            hour += 12;
          } else if (period === "AM" && hour === 12) {
            hour = 0;
          }
  
          // Combine date and time in ET
          const combinedDateTime = new Date(selectedDate);
          combinedDateTime.setHours(hour, minute, 0, 0);
  
          // Convert the combined date and time to UTC by subtracting the ET offset (5 hours during standard time, 4 hours during daylight saving time)
          const isDaylightSaving = combinedDateTime.getTimezoneOffset() === -240;
          const offset = isDaylightSaving ? 4 * 60 * 60 * 1000 : 5 * 60 * 60 * 1000; 
          dateTime = new Date(combinedDateTime.getTime() + offset);
  
          // Convert to ISO string for redirect URL
          dateString = combinedDateTime.toISOString();
        } else {
          console.error("Time format is incorrect");
        }
      }
  
      const meetingData = {
        dateTimeString: dateString,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        notes: notes,
      };
  
      try {
        const response = await fetch('/api/meetings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingData),
        });
  
        const data = await response.json();
        
        if (data.success) {
          console.log("Meeting saved successfully");
  
          const templateParams = {
            firstName,
            lastName,
            email,
            phone,
            notes,
            date,
            time,
          };
  
          fetch("/api/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(templateParams),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("Email sent successfully");
                const redirectUrl = `/email?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&date=${encodeURIComponent(dateString)}`;
                window.location.href = redirectUrl;
              } else {
                console.log("Failed to send email");
              }
            })
            .catch((error) => {
              console.error("Error sending email:", error);
            });
        } else {
          console.log("Failed to save meeting");
        }
      } catch (error) {
        console.error('Error saving meeting:', error);
      }
    }
  };  

  const backToTimes = () => {
    setPage("times");
  };

  const onClose = () => {
    setShowing(false);
  };

  const monthAndYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = async (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selectedDate);
    
    // Format the selected date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    try {
      const response = await fetch(`/api/meetings?date=${formattedDate}`);
      const data = await response.json();
      
      if (data.success) {
        setMeetings(data.meetings);
        setShowing(true);
      } else {
        console.error("Failed to fetch meetings:", data.error);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };
  

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
  
    // Add unselectable days for the previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`prev-${i}`}
          className={`${styles["day"]} ${styles["unselected"]}`}
        >
          {" "}
        </div>
      );
    }
  
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={styles["day"]}
          onClick={() => handleDayClick(i)}
        >
          {i}
        </div>
      );
    }
  
    // Add unselectable days for the next month to fill the last week
    const totalDays = days.length;
    const remainingDays = 7 - (totalDays % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(
          <div
            key={`next-${i}`}
            className={`${styles["day"]} ${styles["unselected"]}`}
          >
            {" "}
          </div>
        );
      }
    }
  
    // Ensure there are always 6 weeks (42 days)
    while (days.length < 42) {
      days.push(
        <div
          key={`extra-${days.length}`}
          className={`${styles["day"]} ${styles["unselected"]}`}
        >
          {" "}
        </div>
      );
    }
  
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(
        <div key={i} className={styles["days"]}>
          {days.slice(i, i + 7)}
        </div>
      );
    }
  
    return weeks;
  };  

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const day = date.getDate();
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return formattedDate.replace(/\d+/, `${day}${daySuffix}`);
  };

  return (
    <div className={styles["calendar"]}>
      <div className={styles["calendar-legend"]}>
        <div className={styles["previous-month"]} onClick={handlePreviousMonth}>
          <svg
            height="15"
            viewBox="0 0 17 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.858579 1.85858C0.780474 1.93668 0.780474 2.06332 0.858579 2.14142L2.13137 3.41421C2.20948 3.49232 2.33611 3.49232 2.41421 3.41421C2.49232 3.33611 2.49232 3.20947 2.41421 3.13137L1.28284 2L2.41421 0.868628C2.49232 0.790523 2.49232 0.66389 2.41421 0.585785C2.33611 0.50768 2.20948 0.50768 2.13137 0.585785L0.858579 1.85858ZM17 1.8L1 1.8L1 2.2L17 2.2L17 1.8Z"
              fill="#79D2FF"
            />
          </svg>
        </div>
        <div className={styles["current-month"]}>{monthAndYear}</div>
        <div className={styles["next-month"]} onClick={handleNextMonth}>
          <svg
            height="15"
            viewBox="0 0 17 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1414 1.85858C16.2195 1.93668 16.2195 2.06332 16.1414 2.14142L14.8686 3.41421C14.7905 3.49232 14.6639 3.49232 14.5858 3.41421C14.5077 3.33611 14.5077 3.20947 14.5858 3.13137L15.7172 2L14.5858 0.868628C14.5077 0.790523 14.5077 0.66389 14.5858 0.585785C14.6639 0.50768 14.7905 0.50768 14.8686 0.585785L16.1414 1.85858ZM-1.74846e-08 1.8L16 1.8L16 2.2L1.74846e-08 2.2L-1.74846e-08 1.8Z"
              fill="#79D2FF"
            />
          </svg>
        </div>
      </div>
      <div className={styles["calendar-body"]}>
        <div className={styles["days-of-the-week"]}>
          <div className={styles["day-of-the-week"]}>Sun</div>
          <div className={styles["day-of-the-week"]}>Mon</div>
          <div className={styles["day-of-the-week"]}>Tue</div>
          <div className={styles["day-of-the-week"]}>Wed</div>
          <div className={styles["day-of-the-week"]}>Thu</div>
          <div className={styles["day-of-the-week"]}>Fri</div>
          <div className={styles["day-of-the-week"]}>Sat</div>
        </div>
        {generateDays()}
      </div>
      <Popup
        title="Schedule a Meeting"
        body={
          <>
            {page == "times" && (
              <div className={moreStyles.date}>{formatDate(selectedDate)}</div>
            )}
            {page == "times" && <Times booked={meetings} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />}
            {page == "contact" && (
              <div className={moreStyles.book}>
                <div className={moreStyles.name}>
                  <div className={moreStyles["first-name"]}>
                    <input
                      type="text"
                      placeholder="First Name..."
                      onChange={handleFirstNameChange}
                    />
                  </div>
                  <div className={moreStyles["last-name"]}>
                    <input
                      type="text"
                      placeholder="Last Name..."
                      onChange={handleLastNameChange}
                    />
                  </div>
                </div>
                <div className={moreStyles.contact}>
                  <div className={moreStyles.email}>
                    <input
                      type="text"
                      placeholder="Email Address..."
                      onChange={handleEmailChange}
                    />
                  </div>
                  <div className={moreStyles.phone}>
                    <input
                      type="text"
                      placeholder="Phone Number..."
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>
                <div className={moreStyles.notes}>
                  <textarea
                    placeholder="Anything that you want to let me know?"
                    id="#shedule-meeting-notes"
                    onChange={handleNotesChange}
                  ></textarea>
                </div>
              </div>
            )}
          </>
        }
        actions={
          <>
            <Button text="Book" onClick={bookMeeting} />
            {page == "contact" && <Button text="Back" onClick={backToTimes} />}
            {page == "times" && <Button text="Close" onClick={onClose} />}
          </>
        }
        showing={showing}
        onClose={onClose}
      />
    </div>
  );
};

export default Calendar;
