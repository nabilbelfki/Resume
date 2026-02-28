"use client"
import React, { useState } from "react";
import styles from "./Message.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import { useReCaptcha } from "next-recaptcha-v3";
import { Breadcrumb as breadcrumb } from "@/lib/types";
import { useRouter } from "next/navigation";

interface message {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}


const Message: React.FC = () => {
  const router = useRouter();
  const { executeRecaptcha } = useReCaptcha();
  const [formData, setFormData] = useState<message>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const breadcrumbs: breadcrumb[] = [
    { label: 'Message', href: '/admin/messages' },
    { label: 'All Message', href: '/admin/messages' },
    { label: 'Create Message', href: '/admin/messages/create' }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.firstName) errors.firstName = true;
    if (!formData.lastName) errors.lastName = true;
    if (!formData.email) errors.email = true;
    if (!formData.message) errors.message = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }


    try {
      const messageToken = await executeRecaptcha("contact_form");

      // Prepare the request body
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        message: formData.message || "",
        recaptchaToken: messageToken
      };

      const response = await fetch('/api/message', {
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

      alert('Message successfully sent');

      location.href = '/admin/messages';

    } catch (err) {
      console.error('Error creating meeting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className={styles.actions}>
        <button
          className={styles.back}
          onClick={() => router.push('/admin/messages')}
        >
          <svg style={{ rotate: '180deg' }} xmlns="http://www.w3.org/2000/svg" version="1.0" height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="var(--form-back-button-icon)" stroke="none">
              <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z" />
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
        </div>

        <div className={styles.textbox}>
          <label htmlFor="notes">Description</label>
          <textarea
            id="notes"
            placeholder="Enter Description"
            value={formData.message}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                message: e.target.value
              }))
              // Clear validation error when value is selected
              if (validationErrors.message) {
                setValidationErrors(prev => ({ ...prev, message: false }));
              }
            }}
            style={{ border: validationErrors.message ? '1.6px solid red' : '' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Message;
