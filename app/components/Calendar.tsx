import React from "react";
import styles from "./Calendar.module.css";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = ({}) => {
  return (
    <div className={styles["calendar"]}>
      <div className={styles["calendar-legend"]}>
        <div className={styles["previous-month"]}>
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
        <div className={styles["current-month"]}>December 2024</div>
        <div className={styles["next-month"]}>
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
        <div className={styles["days"]}>
          <div className={styles["day"]}>1</div>
          <div className={styles["day"]}>2</div>
          <div className={styles["day"]}>3</div>
          <div className={styles["day"]}>4</div>
          <div className={styles["day"]}>5</div>
          <div className={styles["day"]}>6</div>
          <div className={styles["day"]}>7</div>
        </div>
        <div className={styles["days"]}>
          <div className={styles["day"]}>8</div>
          <div className={styles["day"]}>9</div>
          <div className={styles["day"]}>10</div>
          <div className={styles["day"]}>11</div>
          <div className={styles["day"]}>12</div>
          <div className={styles["day"]}>13</div>
          <div className={styles["day"]}>14</div>
        </div>
        <div className={styles["days"]}>
          <div className={styles["day"]}>15</div>
          <div className={styles["day"] + " " + styles["current-day"]}>16</div>
          <div className={styles["day"]}>17</div>
          <div className={styles["day"]}>18</div>
          <div className={styles["day"]}>19</div>
          <div className={styles["day"]}>20</div>
          <div className={styles["day"]}>21</div>
        </div>
        <div className={styles["days"]}>
          <div className={styles["day"]}>22</div>
          <div className={styles["day"]}>23</div>
          <div className={styles["day"]}>24</div>
          <div className={styles["day"]}>25</div>
          <div className={styles["day"]}>26</div>
          <div className={styles["day"]}>27</div>
          <div className={styles["day"]}>28</div>
        </div>
        <div className={styles["days"]}>
          <div className={styles["day"]}>29</div>
          <div className={styles["day"]}>30</div>
          <div className={styles["day"]}>31</div>
          <div className={styles["day"] + " " + styles["unselected"]}> </div>
          <div className={styles["day"] + " " + styles["unselected"]}> </div>
          <div className={styles["day"] + " " + styles["unselected"]}> </div>
          <div className={styles["day"] + " " + styles["unselected"]}> </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
