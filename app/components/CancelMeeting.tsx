"use client";
import React from "react";
import Button from "../components/Button";
import styles from "./CancelMeeting.module.css";

interface CancelMeetingProps {
    meetingID: string;
}

const CancelMeeting: React.FC<CancelMeetingProps> = ({ meetingID }) => {
  return (
    <div className={styles["cancel-meeting"]} >
      <div className={styles.title}>
        Something unexpected came up and you need to cancel? No worries, I understand just click the button below.
      </div>
      <Button text="CANCEL" onClick={()=> {}} />
    </div>
  );
};

export default CancelMeeting;
