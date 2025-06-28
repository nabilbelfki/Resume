"use client";
import React, { useState } from "react";
import styles from "./Calendar.module.css";
import moreStyles from "./ScheduleMeeting.module.css";
import { useReCaptcha } from "next-recaptcha-v3";
import Popup from "./Popup";
import Button from "./Button";
import Times from "./Times";

interface Bookings {
  dateTime: string;
}

const Calendar: React.FC<unknown> = () => {
  const today = new Date();
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
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useReCaptcha();
  // const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [disablePreviousMonth, setDisablePreviousMonth] = useState(true);

  const [firstNamePlaceHolder, setFirstNamePlaceHolder] =
    useState("First Name...");
  const [lastNamePlaceHolder, setLastNamePlaceHolder] =
    useState("Last Name...");
  const [emailPlaceHolder, setEmailPlaceHolder] = useState("Email Address...");

  const [firstNameStyles, setFirstNameStyles] = useState({ border: "none" });
  const [lastNameStyles, setLastNameStyles] = useState({ border: "none" });
  const [emailStyles, setEmailStyles] = useState({ border: "none" });

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setFirstNamePlaceHolder("First Name...");
    setFirstNameStyles({ border: "none" });
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setLastNamePlaceHolder("Last Name...");
    setLastNameStyles({ border: "none" });
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailPlaceHolder("Email Address...");
    setEmailStyles({ border: "none" });
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhone(e.target.value);
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setNotes(e.target.value);

  const bookMeeting = async () => {
    if (page === "times") {
      if (selectedTime)
      setPage("contact");
      else alert("Please choose a time");
    } else {
      setIsLoading(true);
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const meetingToken = await executeRecaptcha("contact_form");
      // setRecaptchaToken(meetingToken);

      console.log("First Name", firstName)
      console.log("Last Name", lastName)
      console.log("Email", email)
      console.log("Recaptcha Token", meetingToken)

      if (
        firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        pattern.test(email) &&
        meetingToken
      ) {
        let dateString = "";
        const time = selectedTime;
        const date = formatDate(selectedDate);

        if (selectedDate && time) {
          const timeMatch = time.match(/(\d{1,2}:\d{2})([AP]M)/);
          if (timeMatch) {
            const [hoursAndMinutes, period] = timeMatch.slice(1, 3);
            const [hourString, minuteString] = hoursAndMinutes.split(":");
            let hour = parseInt(hourString, 10);
            const minute = parseInt(minuteString, 10);

            if (period === "PM" && hour !== 12) {
              hour += 12;
            } else if (period === "AM" && hour === 12) {
              hour = 0;
            }

            const combinedDateTime = new Date(selectedDate);
            combinedDateTime.setHours(hour, minute, 0, 0);
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
          recaptchaToken: meetingToken, // Use the generated meetingToken
        };

        try {
          const response = await fetch("/api/meetings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(meetingData),
          });

          const data = await response.json();

          if (data.success) {
            console.log("Meeting saved successfully");

            const emailToken = await executeRecaptcha("contact_form"); // Generate a fresh token for email
            const templateParams = {
              firstName,
              lastName,
              email,
              phone,
              notes,
              date,
              time,
              dateString,
              recaptchaToken: emailToken, // Use the generated emailToken
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

                  const redirectUrl = `/email?firstName=${encodeURIComponent(
                    firstName
                  )}&lastName=${encodeURIComponent(
                    lastName
                  )}&date=${encodeURIComponent(dateString)}`;
                  window.location.href = redirectUrl;
                  setIsLoading(false);
                } else {
                  console.log("Failed to send email");
                  setIsLoading(false);
                }
              })
              .catch((error) => {
                console.error("Error sending email:", error);
                setIsLoading(false);
              });
          } else {
            console.log("Failed to save meeting");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error saving meeting:", error);
          setIsLoading(false);
        }
      } else {
        console.log("Here");
        if (firstName === "") {
          console.log("First");
          setFirstNamePlaceHolder("Must Enter a First Name...");
          setFirstNameStyles({ border: "solid 1px red" });
        }
        if (lastName === "") {
          console.log("Last");
          setLastNamePlaceHolder("Must Enter a Last Name...");
          setLastNameStyles({ border: "solid 1px red" });
        }
        if (email === "") {
          console.log("Email");
          setEmailPlaceHolder("Must Enter an Email...");
          setEmailStyles({ border: "solid 1px red" });
        }

        if (!pattern.test(email)) {
          setEmailStyles({ border: "solid 1px red" });
        }
        setIsLoading(false);
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
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const today = new Date();
    const isCurrentMonth =
      newDate.getFullYear() === today.getFullYear() &&
      newDate.getMonth() === today.getMonth();

    // Disable the previous month button if the new date is the current month
    setDisablePreviousMonth(isCurrentMonth);

    // Allow navigation to any month except those before the current month
    if (
      newDate.getFullYear() > today.getFullYear() ||
      (newDate.getFullYear() === today.getFullYear() &&
        newDate.getMonth() >= today.getMonth())
    ) {
      setCurrentDate(newDate);
    }
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
    const today = new Date();
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // Set the time to midnight for both dates to ensure accurate comparison
    const todayMidnight = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const selectedDateMidnight = new Date(
      selectedDate.setHours(0, 0, 0, 0)
    ).getTime();

    // Check if the selected date is greater than or equal to today
    if (selectedDateMidnight >= todayMidnight) {
      setSelectedDate(selectedDate);

      // Format the selected date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split("T")[0];

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
      const isToday =
        today.getDate() === i &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      const isPast =
        today.getMonth() === currentDate.getMonth() && today.getDate() > i;
      days.push(
        <div
          key={i}
          className={`${styles["day"]} ${
            isToday ? styles["current-day"] : ""
          } ${isPast ? styles["past"] : ""}`}
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
        <div
          className={`${styles["previous-month"]} ${
            disablePreviousMonth ? styles["toggle-month-disabled"] : ""
          }`}
          onClick={handlePreviousMonth}
        >
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
        style={{ width: 600 }}
        body={
          <>
            {page == "times" && (
              <div className={moreStyles.date}>{formatDate(selectedDate)}</div>
            )}
            {page == "times" && (
              <Times
                booked={meetings}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            )}
            {page == "contact" && (
              <div className={moreStyles.book}>
                <div className={moreStyles.name}>
                  <div className={moreStyles["first-name"]}>
                    <input
                      className={
                        firstNamePlaceHolder == "Must Enter a First Name..."
                          ? moreStyles.invalid
                          : ""
                      }
                      type="text"
                      style={firstNameStyles}
                      placeholder={firstNamePlaceHolder}
                      onChange={handleFirstNameChange}
                    />
                  </div>
                  <div className={moreStyles["last-name"]}>
                    <input
                      className={
                        lastNamePlaceHolder == "Must Enter a Last Name..."
                          ? moreStyles.invalid
                          : ""
                      }
                      type="text"
                      style={lastNameStyles}
                      placeholder={lastNamePlaceHolder}
                      onChange={handleLastNameChange}
                    />
                  </div>
                </div>
                <div className={moreStyles.contact}>
                  <div className={moreStyles.email}>
                    <input
                      className={
                        emailPlaceHolder == "Must Enter an Email..."
                          ? moreStyles.invalid
                          : ""
                      }
                      type="text"
                      style={emailStyles}
                      placeholder={emailPlaceHolder}
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
        isLoading={isLoading}
        onClose={onClose}
      />
    </div>
  );
};

export default Calendar;
