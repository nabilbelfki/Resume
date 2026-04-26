export const snippets = [
`"use client";
import React, { useState } from "react";
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
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
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
        const response = await fetch(\`/api/meetings?date=\${formattedDate}\`);
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
          key={\`prev-\${i}\`}
          className={\`\${styles["day"]} \${styles["unselected"]}\`}
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
          className={\`\${styles["day"]} \${isToday ? styles["current-day"] : ""
            } \${isPast ? styles["past"] : ""}\`}
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
            key={\`next-\${i}\`}
            className={\`\${styles["day"]} \${styles["unselected"]}\`}
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
          key={\`extra-\${days.length}\`}
          className={\`\${styles["day"]} \${styles["unselected"]}\`}
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
          className={\`\${styles["previous-month"]} \${disablePreviousMonth ? styles["toggle-month-disabled"] : ""
            }\`}
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
`,
`"use client";
import React, { useState } from "react";
import { useReCaptcha } from "next-recaptcha-v3";
import Button from "@/components/Button/Button";
import Loading from "@/components/Loading/Loading";
import styles from "./ContactForm.module.css";

const Contact: React.FC<unknown> = () => {
  const { executeRecaptcha } = useReCaptcha();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [firstNameStyles, setFirstNameStyles] = useState({ border: "none" });
  const [lastNameStyles, setLastNameStyles] = useState({ border: "none" });
  const [emailStyles, setEmailStyles] = useState({ border: "none" });
  const [messageStyles, setMessageStyles] = useState({ border: "none" });

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    setFirstNameStyles({ border: "none" });
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    setLastNameStyles({ border: "none" });
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailStyles({ border: "none" });
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setMessageStyles({ border: "none" });
  };

  const sendEmail = async () => {
    setIsLoading(true);
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
    const recaptchaToken = await executeRecaptcha('contact_form');
    // setRecaptchaToken(await executeRecaptcha("contact_form"));


    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      message !== "" &&
      pattern.test(email) &&
      recaptchaToken
    ) {
      const templateParams = {
        firstName,
        lastName,
        email,
        message,
        recaptchaToken,
      };

      fetch("/api/message", {
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
            // Clear input fields
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
            // setRecaptchaToken(null); // Optionally clear reCAPTCHA token if needed
          } else {
            console.log("Failed to send email");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      if (firstName == "")
        setFirstNameStyles({ border: "solid 1px red" });
      if (lastName == "")
        setLastNameStyles({ border: "solid 1px red" });
      if (email == "" || !pattern.test(email))
        setEmailStyles({ border: "solid 1px red" });
      if (message == "")
        setMessageStyles({ border: "solid 1px red" });
    }
  };

  return (
    <div id="contact" className={styles["contact-form"]}>
      <Loading isLoading={isLoading} zIndex={10} />
      <div className={styles["contact-form-title"]}>
        Send Message
      </div>
      <div className={styles["email-first-and-last-name"]}>
        <input
          className={styles["first-name"]}
          type="text"
          placeholder="First Name..."
          style={firstNameStyles}
          value={firstName}
          onChange={handleFirstNameChange}
        />
        <input
          className={styles["last-name"]}
          type="text"
          placeholder="Last Name..."
          style={lastNameStyles}
          value={lastName}
          onChange={handleLastNameChange}
        />
        <input
          className={styles["email"]}
          type="text"
          placeholder="Email Address..."
          style={emailStyles}
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className={styles["message"]}>
        <textarea
          placeholder="Then reach out to me and let’s discuss it..."
          style={messageStyles}
          value={message}
          onChange={handleMessageChange}
        ></textarea>
        <Button
          text="Send"
          onClick={sendEmail}
          style={{
            bottom: 10,
            right: 5,
            position: "absolute",
            fontWeight: 600,
            fontSize: 16,
            backgroundColor: "#2571FF"
          }}
        />
      </div>
    </div>
  );
};

export default Contact;
`,
`"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationLink from "@/components/NavigationBar/NavigationLink/NavigationLink";
import styles from "./NavigationBar.module.css";
import { useUser } from '@/contexts/UserContext';
import { stringToHexColor, isColorTooDark } from '@/lib/color';
import { signOut } from "next-auth/react";


interface NavigationBarProps {
  type?: 'classic' | 'admin';
}

const NavigationBar: React.FC<NavigationBarProps> = ({ type = 'classic' }) => {
  console.log("Navigation Type: ", type)
  const { user } = useUser();

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(false);
      }
    };

    if (dropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown]);

  const signout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/admin' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setDropdown(false); // Close the dropdown
    }
  }

  if (type === "admin" && !user) return null;

  return (
    <nav className={type === 'classic' ? styles.nav : styles['nav-admin']}>
      {type === 'admin' && user ? (<>
        <Link href="/">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 0 16 16" fill="none">
            <rect width="15.168" height="15.168" rx="2" fill="#011A49" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4.53135 10.3163H2.57764L5.65622 4.85773H7.20735L7.2784 6.83512H7.34944L8.47431 4.86957H11.4345C12.879 4.83405 13.2106 6.7996 11.1621 7.54557C12.4173 7.8179 12.062 9.98475 9.82415 10.2926H5.78647L5.71542 8.30337H5.65622L4.53135 10.3163ZM10.3096 7.00094H9.36236L9.93072 5.99448H10.4517C10.9609 5.98264 11.3161 6.65755 10.3096 7.00094ZM9.49261 9.04938H8.20197L8.87689 7.86531H9.85967C10.4162 7.85347 10.4991 8.81256 9.49261 9.04938Z" fill="white" />
          </svg>
        </Link>
        <div className={styles['search-and-avatar']}>
          <div className={styles.search}>
            <div className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 7 7" fill="none">
                <path d="M5.20646 6.30819L4.18322 5.28978C3.80448 5.59246 3.34432 5.78062 2.84196 5.80814C1.44309 5.88478 0.239371 4.6863 0.15422 3.1321C0.0690905 1.57831 1.13465 0.255095 2.53352 0.178454C3.93202 0.101833 5.13612 1.3007 5.22125 2.85449C5.2519 3.41384 5.13315 3.94306 4.90451 4.39481L5.92775 5.41321C6.15237 5.63685 6.17332 6.01927 5.97448 6.26611C5.77527 6.51297 5.43144 6.53181 5.20646 6.30819ZM4.49739 2.89415C4.43661 1.7847 3.57615 0.927985 2.57758 0.982695C1.57865 1.03742 0.817297 1.98299 0.878082 3.09244C0.938888 4.2023 1.79896 5.05863 2.79789 5.0039C3.79646 4.94919 4.5582 4.004 4.49739 2.89415Z" fill="#BDBDBD" />
              </svg>
            </div>
            <input type="text" placeholder="" />
          </div>
          <div className={styles.avatar} ref={dropdownRef}>
            <div className={styles['avatar-background']} style={{ backgroundColor: stringToHexColor(\`\${user.firstName} \${user.lastName}\`), color: isColorTooDark(stringToHexColor(\`\${user.firstName} \${user.lastName}\`)) ? '#FFFFFF' : '#4C4C4C' }} onClick={() => setDropdown(!dropdown)}>
              {user.image ? (
                <Image src={user.image} alt='A profile picture of the user' height={50} width={50} />
              ) : (
                <span>{\`\${user.firstName.charAt(0)} \${user.lastName.charAt(0)}\`}</span>
              )}
            </div>
            {dropdown && (
              <div className={styles.dropdown}>
                <button onClick={() => { location.href = '/admin/users/edit/' + user.id }}>Account</button>
                <button onClick={() => { location.href = '/admin/settings' }}>Settings</button>
                <button onClick={signout}>Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </>
      ) :
        (<>
          <Link href="/">
            <svg height="35" viewBox="0 0 40 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-0.000195302 10.0801V7.77245e-05H2.7858L7.2658 8.90408L6.57981 9.07208V7.77245e-05H8.6798V10.0801H5.8938L1.4138 1.17608L2.0998 1.00808V10.0801H-0.000195302ZM9.71198 10.0801L13.324 7.77245e-05H15.172L11.854 10.0801H9.71198ZM17.104 10.0801L13.8 7.77245e-05H15.732L19.344 10.0801H17.104ZM11.616 6.17408H17.272V7.85408H11.616V6.17408ZM21.9708 10.0801V8.54008H24.5748C25.0415 8.54008 25.3915 8.41408 25.6248 8.16208C25.8675 7.90074 25.9888 7.54141 25.9888 7.08408C25.9888 6.61741 25.8582 6.24874 25.5968 5.97808C25.3448 5.70741 24.9808 5.57208 24.5048 5.57208H21.9708V4.03208H24.3928C24.8315 4.03208 25.1628 3.92941 25.3868 3.72408C25.6202 3.50941 25.7368 3.19674 25.7368 2.78608C25.7368 2.37541 25.6248 2.06741 25.4008 1.86208C25.1862 1.64741 24.8642 1.54008 24.4348 1.54008H21.9708V7.77245e-05H24.8968C25.7928 7.77245e-05 26.5162 0.228745 27.0668 0.686078C27.6175 1.14341 27.8928 1.76408 27.8928 2.54808C27.8928 3.04274 27.7762 3.46741 27.5428 3.82208C27.3095 4.17674 26.9968 4.44741 26.6048 4.63408C26.2128 4.82074 25.7742 4.91408 25.2888 4.91408L25.3588 4.62008C25.8815 4.62008 26.3528 4.73208 26.7728 4.95608C27.2022 5.18008 27.5428 5.49741 27.7948 5.90808C28.0468 6.30941 28.1728 6.78541 28.1728 7.33608C28.1728 7.88674 28.0422 8.37208 27.7808 8.79208C27.5288 9.20274 27.1695 9.52008 26.7028 9.74408C26.2455 9.96808 25.7042 10.0801 25.0788 10.0801H21.9708ZM20.2068 10.0801V7.77245e-05H22.3628V10.0801H20.2068ZM29.2986 10.0801V7.77245e-05H31.4546V10.0801H29.2986ZM32.8533 10.0801V7.77245e-05H35.0093V10.0801H32.8533ZM33.8613 10.0801V8.42808H39.8533V10.0801H33.8613Z" fill="url(#paint0_linear_1558_4622)" />
              <defs>
                <linearGradient id="paint0_linear_1558_4622" x1="-1.14453" y1="-1.28199" x2="41.3912" y2="10.6412" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#636363" />
                  <stop offset="1" stopColor="#1F1F1F" />
                </linearGradient>
              </defs>
            </svg>
          </Link>
          <ul>
            <NavigationLink href="/" label="Portfolio" />
            <NavigationLink href="/resume" label="Resume" />
            <NavigationLink href="/blog" label="Blog" />
            <NavigationLink href="/contact" label="Contact" />
          </ul>
        </>
        )}
    </nav>
  );
};

export default NavigationBar;
`,
`"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Video from '@/components/Video/Video';
import { Project } from '@/lib/types';
import styles from './ProjectsCarousel.module.css';

interface ProjectsCarouselProps {
    projects: Project[];
}

const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({ projects }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Group projects into chunks of 4 globally
    const chunkSize = 4;
    const chunkedProjects = [];
    for (let i = 0; i < projects.length; i += chunkSize) {
        chunkedProjects.push(projects.slice(i, i + chunkSize));
    }

    const totalChunks = chunkedProjects.length;

    // Automatic slideshow tick mapping
    useEffect(() => {
        if (totalChunks <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalChunks);
        }, 6000); // 6 seconds slide

        return () => clearInterval(interval);
    }, [totalChunks]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchStartX.current - touchEndX.current;
            const threshold = 50;

            if (distance > threshold) {
                // Swiped Left - go Next
                setCurrentIndex((prev) => (prev + 1) % totalChunks);
            } else if (distance < -threshold) {
                // Swiped Right - go Previous
                setCurrentIndex((prev) => (prev - 1 + totalChunks) % totalChunks);
            }
        }
        // Reset 
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (!projects || projects.length === 0) return null;

    return (
        <div className={styles.carouselContainer}>
            <div
                className={styles.carouselTrack}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: \`translateX(-\${currentIndex * 100}%)\`,
                    transition: 'transform 0.5s ease-in-out'
                }}
            >
                {chunkedProjects.map((chunk, chunkIndex) => (
                    <div className={styles.carouselSlide} key={\`chunk-\${chunkIndex}\`}>
                        <div className="projects">
                            {chunk.map((project) => (
                                <Link key={project._id} href={\`/application/\${project._id}\`}>
                                    <Video
                                        name={project.name}
                                        videoPath={\`/videos/\${project.slug}.mp4\`}
                                        thumbnail={project.thumbnail}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {totalChunks > 1 && (
                <div className="project-pages">
                    {chunkedProjects.map((_, dotIndex) => (
                        <div
                            key={\`dot-\${dotIndex}\`}
                            className={\`project-page \${currentIndex === dotIndex ? 'selected-page' : ''}\`}
                            onClick={() => setCurrentIndex(dotIndex)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsCarousel;
`,
`"use client";
import React, { useState, useEffect, useMemo } from "react";
import Skill from "@/components/Skill/Skill";
import Scrubber from "@/components/Scrubber/Scrubber";
import styles from "./Skills.module.css";

interface Image {
  name: string;
  url: string;
  backgroundColor: string;
  height: number;
  width: number;
}

interface Description {
  color: string;
  text: string;
  backgroundColor: string;
}

interface Skill {
  name: string;
  type: string;
  image: Image;
  description: Description;
}

interface SkillsProps {
  skills: Skill[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const [type, setType] = useState("backend");
  const [backgroundColor, setBackgroundColor] = useState("rgba(96, 96, 96, 0.1)");
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  // State for expanded skills
  const [clickedMobileIndex, setMobileClickedIndex] = useState<number | null>(0);
  const [clickedFrontendIndex, setFrontendClickedIndex] = useState<number | null>(0);
  const [clickedBackendIndex, setBackendClickedIndex] = useState<number | null>(0);
  const [clickedDatabaseIndex, setDatabaseClickedIndex] = useState<number | null>(0);
  const [clickedCloudIndex, setCloudClickedIndex] = useState<number | null>(0);
  const [clickedMiscellaneousIndex, setMiscellaneousClickedIndex] = useState<number | null>(0);

  // Categorize skills with memoization
  const { mobile, frontend, backend, database, cloud, miscellaneous } = useMemo(() => {
    const mobile: Skill[] = [];
    const frontend: Skill[] = [];
    const backend: Skill[] = [];
    const database: Skill[] = [];
    const cloud: Skill[] = [];
    const miscellaneous: Skill[] = [];

    skills.forEach((skill) => {
      if (skill.type === "mobile") mobile.push(skill);
      else if (skill.type === "frontend") frontend.push(skill);
      else if (skill.type === "backend") backend.push(skill);
      else if (skill.type === "database") database.push(skill);
      else if (skill.type === "cloud") cloud.push(skill);
      else miscellaneous.push(skill);
    });

    return { mobile, frontend, backend, database, cloud, miscellaneous };
  }, [skills]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update background color when type changes
  useEffect(() => {
    const currentSkills = 
      type === "mobile" ? mobile :
      type === "frontend" ? frontend :
      type === "backend" ? backend :
      type === "database" ? database :
      type === "cloud" ? cloud :
      miscellaneous;
    
    if (currentSkills.length > 0) {
      setBackgroundColor(hexToRgba(currentSkills[0].image.backgroundColor, 0.3));
    }
  }, [type, mobile, frontend, backend, database, cloud, miscellaneous]);

  const hexToRgba = (hex: string, alpha: number) => {
    if (hex == "#FFFFFF") return \`rgba(96, 96, 96, 0.1)\`;
    if (hex == "#EAF9FF") return \`rgba(47, 129, 255, 0.3)\`;
    hex = hex.replace(/^#/, "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return \`rgba(\${r}, \${g}, \${b}, \${alpha})\`;
  };

  const renderSkills = (
    skills: Skill[],
    clickedIndex: number | null,
    setClickedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    isMobile: boolean
  ) => {
    const columns = isMobile ? 2 : 3;

    return skills.map((skill, index) => {
      const originalRow = Math.floor(index / columns) + 1;
      const originalCol = (index % columns) + 1;
      let gridArea = \`\${originalRow} / \${originalCol} / \${originalRow + 1} / \${originalCol + 1}\`;

      if (clickedIndex !== null) {
        const clickedRow = Math.floor(clickedIndex / columns) + 1;
        const clickedCol = (clickedIndex % columns) + 1;

        if (clickedIndex === index) {
          if (isMobile) {
            gridArea = \`\${clickedRow} / 1 / \${clickedRow + 1} / 3\`;
          } else {
            gridArea = clickedCol === 1 
              ? \`\${clickedRow} / 1 / \${clickedRow + 2} / 3\`
              : \`\${clickedRow} / 2 / \${clickedRow + 2} / 4\`;
          }
        } else {
          if (isMobile) {
            const currentRow = Math.floor(index / columns) + 1;
            if (currentRow === clickedRow) {
              gridArea = \`\${clickedRow + 1} / 1 / \${clickedRow + 2} / 2\`;
            } else if (currentRow > clickedRow) {
              gridArea = originalCol === 1
                ? \`\${currentRow} / 2 / \${currentRow + 1} / 3\`
                : \`\${currentRow + 1} / 1 / \${currentRow + 2} / 2\`;
            }
          } else {
            if (originalRow === clickedRow) {
              if (clickedCol === 1) {
                if (originalCol === 2) gridArea = \`\${clickedRow} / 3 / \${clickedRow + 1} / 4\`;
                if (originalCol === 3) gridArea = \`\${clickedRow + 1} / 3 / \${clickedRow + 2} / 4\`;
              } else if (clickedCol === 2) {
                if (originalCol === 1) gridArea = \`\${clickedRow} / 1 / \${clickedRow + 1} / 2\`;
                if (originalCol === 3) gridArea = \`\${clickedRow + 1} / 1 / \${clickedRow + 2} / 2\`;
              } else {
                if (originalCol === 1) gridArea = \`\${clickedRow} / 1 / \${clickedRow + 1} / 2\`;
                if (originalCol === 2) gridArea = \`\${clickedRow + 1} / 1 / \${clickedRow + 2} / 2\`;
              }
            } else if (originalRow > clickedRow) {
              gridArea = \`\${originalRow + 1} / \${originalCol} / \${originalRow + 2} / \${originalCol + 1}\`;
            }
          }
        }
      }

      return (
        <Skill
          key={index}
          gridArea={gridArea}
          isMobile={isMobile}
          image={skill.image}
          name={skill.name}
          description={skill.description}
          showDescription={clickedIndex === index}
          onClick={() => {
            setClickedIndex(clickedIndex === index ? null : index);
            setBackgroundColor(hexToRgba(skill.image.backgroundColor, 0.3));
          }}
          className={\`\${styles.skill} \${clickedIndex === index ? styles.clicked : ""}\`}
        />
      );
    });
  };

  return (
    <div className={styles.skills} style={{ backgroundColor }}>
      {type === "mobile" && (
        <div className={styles.mobile}>
          {renderSkills(mobile, clickedMobileIndex, setMobileClickedIndex, isMobile)}
        </div>
      )}
      {type === "frontend" && (
        <div className={styles.frontend}>
          {renderSkills(frontend, clickedFrontendIndex, setFrontendClickedIndex, isMobile)}
        </div>
      )}
      {type === "backend" && (
        <div className={styles.backend}>
          {renderSkills(backend, clickedBackendIndex, setBackendClickedIndex, isMobile)}
        </div>
      )}
      {type === "database" && (
        <div className={styles.database}>
          {renderSkills(database, clickedDatabaseIndex, setDatabaseClickedIndex, isMobile)}
        </div>
      )}
      {type === "cloud" && (
        <div className={styles.cloud}>
          {renderSkills(cloud, clickedCloudIndex, setCloudClickedIndex, isMobile)}
        </div>
      )}
      {type === "miscellaneous" && (
        <div className={styles.miscellaneous}>
          {renderSkills(miscellaneous, clickedMiscellaneousIndex, setMiscellaneousClickedIndex, isMobile)}
        </div>
      )}
      <Scrubber type={type} setType={setType} />
    </div>
  );
};

export default Skills;`,
];
