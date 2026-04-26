"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Calendar.module.css";
import moreStyles from "@/components/ScheduleMeeting/ScheduleMeeting.module.css";
import { useReCaptcha } from "next-recaptcha-v3";
import Popup from "@/components/Popup/Popup";
import Button from "@/components/Button/Button";
import Times from "@/components/Times/Times";
import { formatDate } from "@/lib/utilities";

interface Bookings {
  dateTime: string;
}

const Calendar: React.FC<unknown> = () => {
  const router = useRouter();
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
  const disablePreviousMonth =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();
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

          const bookingData = await response.json();
          if (bookingData.success) {
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
                  router.push(`/email?ID=${bookingData.ID}`);
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
        console.log("Data", data)
        if (data.success) {
          setMeetings(data.data);
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
          className={`${styles["day"]} ${isToday ? styles["current-day"] : ""
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

  return (
    <div className={styles["calendar"]}>
      <div className={styles["calendar-legend"]}>
        <div
          className={`${styles["previous-month"]} ${disablePreviousMonth ? styles["toggle-month-disabled"] : ""
            }`}
          onClick={handlePreviousMonth}
        >
          <svg height="14" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.39062 0.191895L0.390625 2.69189L3.39062 5.19189" stroke="#4C4C4C" strokeWidth="0.7" />
          </svg>
        </div>
        <div className={styles["current-month"]}>{monthAndYear}</div>
        <div className={styles["next-month"]} onClick={handleNextMonth}>
          <svg height="14" viewBox="0 0 4 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.160156 0.191895L3.16016 2.69189L0.160156 5.19189" stroke="#4C4C4C" strokeWidth="0.7" />
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
        style={{ width: 600, padding: 80 }}
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
                today={(selectedDate ? selectedDate.toDateString() : null) == new Date().toDateString()}
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
            <Button text={page == "times" ? "Next" : "Book"} onClick={bookMeeting} className={styles.buttonPrimary} />
            {page == "contact" && <Button text="Back" onClick={backToTimes} className={styles.buttonSecondary} />}
            {page == "times" && <Button text="Close" onClick={onClose} className={styles.buttonSecondary} />}
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
