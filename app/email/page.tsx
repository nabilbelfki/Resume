"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AddCalendar from "../../components/AddCalendar/AddCalendar";
import Canceled from "../../components/Canceled/Canceled";
import Confirmation from "../../components/Confirmation/Confirmation";
import Project from "../../components/Project/Project";
import CancelMeeting from "../../components/CancelMeeting/CancelMeeting";
import styles from "./Email.module.css";

const EmailContent: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Check if searchParams is null
  const ID = searchParams?.get("ID") || null;
  
  // State to store the meeting data
  const [meetingData, setMeetingData] = useState<{
    firstName: string;
    lastName: string;
    dateTime: string;
    canceled: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ID) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/meetings/${ID}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch meeting`);
        }

        const data = await response.json();
        console.log(data);
        
        // Store the data in state
        setMeetingData({
          firstName: data.firstName,
          lastName: data.lastName,
          dateTime: data.dateTime,
          canceled: data.canceled
        });
        
      } catch (err) {
        console.error('Error fetching meeting:', err);
        setError('Failed to load meeting details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ID]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.background}>
        <div className={styles.loading}>Loading meeting details...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.background}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  // Show message if no ID provided
  if (!ID) {
    return (
      <div className={styles.background}>
        <div className={styles.error}>No meeting ID provided</div>
      </div>
    );
  }

  // Show message if no meeting data found
  if (!meetingData) {
    return (
      <div className={styles.background}>
        <div className={styles.error}>Meeting not found</div>
      </div>
    );
  }

  return (
    <div className={styles.background}> 
      {meetingData.canceled ? (
        <Canceled
          firstName={meetingData.firstName}
          lastName={meetingData.lastName}
          dateTime={new Date(meetingData.dateTime)}
        />
      ) : (
        <Confirmation
          firstName={meetingData.firstName}
          lastName={meetingData.lastName}
          dateTime={new Date(meetingData.dateTime)}
        />
      )}
      <div className={styles.content}>
        <div className={styles["add-calendar-and-cancel-meeting"]}>
          <AddCalendar dateTime={new Date(meetingData.dateTime)} />
          <CancelMeeting 
            firstName={meetingData.firstName} 
            lastName={meetingData.lastName} 
            dateTimeString={meetingData.dateTime} 
            disabled={meetingData.canceled || new Date() > new Date(meetingData.dateTime)}
          />
        </div>
        <div className={styles["project-preview"]}>
          <Link key="67a2432855f8ecd625cc5ea5" href={`/#biography`}>
            <Project
              name="Personal Website"
              videoPath={`/videos/personal.gif`}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Email: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailContent />
    </Suspense>
  );
};

export default Email;