import React from "react";
import styles from "./UpcomingMeetings.module.css";
import { stringToHexColor, isColorTooDark } from "@/lib/color";

const meetings = [
  {
    firstName: 'Michael',
    lastName: 'Resello',
    datetime: 'Tomorrow at 2:00PM',
    notes: 'Hey, Nabil I saw your website and wanted to chat about some things. I really like your design and I think that we could do some nice work together. Lo...'
  },
  {
    firstName: 'Shaniqua',
    lastName: 'Thomas',
    datetime: 'Sunday at 11:00AM',
    notes: 'Hey, Nabil I saw your website and wanted to chat about some things. I really like your design and I think that we could do some nice work together. Lo...'
  },
  {
    firstName: 'Anthony',
    lastName: 'Jarius',
    datetime: 'Wednesday at 7:00PM',
    notes: 'Hey, Nabil I saw your website and wanted to chat about some things. I really like your design and I think that we could do some nice work together. Lo...'
  }
];


const UpcomingMeetings: React.FC = () => {

    return (<div className={styles.container}>
        <h2 className={styles.title}>Upcoming Meetings</h2>
        <div className={styles.meetings}>
          {meetings.map((meeting, index) => {
            const name = `${meeting.firstName} ${meeting.lastName}`;
            const initials = `${meeting.firstName[0]}${meeting.lastName[0]}`;
            const backgroundColor = stringToHexColor(name);
            const color = isColorTooDark(backgroundColor) ? '#FFFFFF' : '#4C4C4C';
            return (
              <div key={`meeting-${index}`} className={styles.meeting}>
                <div className={styles['initials-and-name']}>
                  <div className={styles.initials} style={{backgroundColor, color}}>{initials}</div>
                  <div className={styles.name}>{name}</div>
                </div>
                <div className={styles.datetime}>{meeting.datetime}</div>
                <div className={styles.message}>{meeting.notes}</div>
              </div>
            );
          })}
        </div>
    </div>);
};

export default UpcomingMeetings;