"use client";
import React from "react";
import Button from "../components/Button";
import styles from "./CancelMeeting.module.css";
import { useRouter } from "next/navigation";
interface CancelMeetingProps {
  firstName: string;
  lastName: string;
  dateTimeString: string;
}

const CancelMeeting: React.FC<CancelMeetingProps> = ({firstName, lastName, dateTimeString}) => {
  const router = useRouter();

  const handleCancelMeeting = async () => {

    if (!firstName || !lastName || !dateTimeString) {
      alert("Missing required parameters in URL");
      return;
    }

    try {
      const response = await fetch('/api/meetings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateTimeString: decodeURIComponent(dateTimeString)
        })
      });

      const result = await response.json();

      if (result.success) {
        alert("Meeting cancelled successfully!");
        router.push("/");
      } else {
        alert(`Failed to cancel meeting: ${result.error}`);
      }
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      alert("An error occurred while cancelling the meeting.");
    }
  };

  return (
    <div className={styles["cancel-meeting"]}>
      <div className={styles.title}>
        Something unexpected came up and you need to cancel? No worries, I understand just click the button below.
      </div>
      <Button 
        text="CANCEL MEETING" 
        style={{width: 150, fontWeight: 600, minHeight: 50}} 
        onClick={handleCancelMeeting} 
      />
    </div>
  );
};

export default CancelMeeting;