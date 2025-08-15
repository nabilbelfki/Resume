"use client"
import React, { useState, useEffect } from "react";
import styles from "./Meeting.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useReCaptcha } from "next-recaptcha-v3";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import Dropdown from "@/components/Dropdown/Dropdown";
import {formatDate, formatTime} from "@/lib/utilities";

interface meeting {
  firstName: string;
  lastName: string;
  notes: string;
  email: string;
  phone: string;
  time: string | null;
  date: string;
}

const Meeting: React.FC = () => {
  const { executeRecaptcha } = useReCaptcha();
  const [formData, setFormData] = useState<meeting>({
    firstName: '',
    lastName: '',
    notes: '',
    email: '',
    phone: '',
    time: '',
    date:''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Meetings', href: '/admin/meetings' },
    { label: 'All Meetings', href: '/admin/meetings' },
    { label: 'Create Meeting', href: '/admin/meetings/create' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear validation error when user types
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    // Get current date in YYYY-MM-DD format (required for input[type="date"])
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.firstName) errors.firstName = true;
    if (!formData.lastName) errors.lastName = true;
    if (!formData.email) errors.email = true;
    if (!formData.date) errors.date = true;
    if (!formData.time) errors.time = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      setError('Please fill all required fields');
      return;
    }

    try {
      console.log(formData)
      // Combine date and time into ISO string format
      const [ year, month, day] = formData.date.split('-');
      const [hours, minutes, seconds] = formData.time?.split(':') || ['', '', ''];
      
      const dateTime = new Date(
        Date.UTC(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds)
      )).toISOString();

      const meetingToken = await executeRecaptcha("contact_form");

      // Prepare the request body
      const requestBody = {
        dateTimeString: dateTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
        notes: formData.notes || "",
        recaptchaToken: meetingToken
      };

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create meeting');
      }

      const result = await response.json();
      if (result.success) {
        console.log("Meeting saved successfully");
        const date = formatDate(new Date(formData.date));
        const time = formatTime(`${hours}:${minutes}:${seconds}`)+' ET'

        const emailToken = await executeRecaptcha("contact_form"); // Generate a fresh token for email
        const templateParams = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || "",
          notes: formData.notes || "",
          date,
          time,
          dateString: dateTime,
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
              window.location.href = '/admin/meetings';
            } else {
              console.log("Failed to send email");
            }
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          });
      }
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
        <button 
          className={styles.back} 
          onClick={() => window.location.href = '/admin/meetings'}
        >
          <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#727272" stroke="none">
              <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
            </g>
          </svg>
          <span>Back</span>
        </button>
        <button 
          className={styles.save} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {/* {error && <div className={styles.error}>{error}</div>} */}
      <div className={styles.content}>
        <label className={styles.title}>General Information</label>
        <div className={styles.grid}>
          <div className={styles.input}>
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              placeholder="Enter First Name" 
              value={formData.firstName}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.firstName ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              placeholder="Enter Last Name" 
              value={formData.lastName}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.lastName ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="text" 
              id="email" 
              placeholder="Enter Email Address" 
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.email ? '1.6px solid red' : '' }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="type">Time</label>
            <Dropdown 
              placeholder='Choose Time' 
              options={[
                { label: '11:00AM', value: '11:00:00' },
                { label: '11:30AM', value: '11:30:00' },
                { label: '12:00PM', value: '12:00:00' },
                { label: '12:30PM', value: '12:30:00' },
                { label: '1:00PM', value: '13:00:00' },
                { label: '1:30PM', value: '13:30:00' },
                { label: '2:00PM', value: '14:00:00' },
                { label: '2:30PM', value: '14:30:00' },
                { label: '3:00PM', value: '15:00:00' },
                { label: '3:30PM', value: '15:30:00' },
                { label: '4:00PM', value: '16:00:00' },
                { label: '4:30PM', value: '16:30:00' },
                { label: '5:00PM', value: '17:00:00' },
                { label: '5:30PM', value: '17:30:00' }
              ]}
              value={formData.time}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  time: value
                }));
                // Clear validation error when value is selected
                if (validationErrors.time) {
                  setValidationErrors(prev => ({ ...prev, time: false }));
                }
              }}
              style={{
                button: {
                  border: validationErrors.time ? '1.6px solid red' : '' 
                }
              }}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="date">Date</label>
            <input 
              type="date" 
              id="date" 
              placeholder="Enter Date" 
              value={formData.date}
              onChange={handleInputChange}
              required
              style={{ border: validationErrors.date ? '1.6px solid red' : '' }}
            />
          </div>
        </div>

        <div className={styles.textbox}>
          <label htmlFor="notes">Description</label>
          <textarea 
            id="notes"
            placeholder="Enter Description"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default Meeting;