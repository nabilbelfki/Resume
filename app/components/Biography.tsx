import React from "react";
import Image from "next/image";
import styles from "./Biography.module.css";

interface BiographyProps {
  name: string;
  role: string;
  imagePath: string;
  imageAlt: string;
  biography: string;
}

const Biography: React.FC<BiographyProps> = ({
  name,
  role,
  imagePath,
  imageAlt,
  biography,
}) => {
  return (
    <div id="biography" className={styles.biography}>
      <div className={styles.card}>
        <div className={styles["profile-name-and-role"]}>
          <div className={styles.profile}>
            <Image src={imagePath} alt={imageAlt} />
          </div>
          <div className={styles["name-and-role"]}>
            <div className={styles.name}>{name}</div>
            <div className={styles.role}>{role}</div>
          </div>
        </div>
        <div className={styles["title-text-and-socials"]}>
          <div className={styles.title}>Biography</div>
          <div className={styles.text}>{biography}</div>
          <div className={styles.socials}>
            <a href="mailto:nabilbelfki@gmail.com">
              <svg
                height="35"
                viewBox="0 0 22 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.60602 0.0145092C1.55874 0.0231047 1.4255 0.0617876 1.30946 0.10047L1.10315 0.164941L3.4155 2.48589C7.31814 6.39282 9.8368 8.85131 10.0689 8.98025C10.6448 9.29831 11.3497 9.29831 11.9257 8.98025C12.1578 8.85131 14.6764 6.39282 18.579 2.48589L20.8914 0.169239L20.6851 0.0875759C20.4831 0.010211 20.1693 0.00591278 11.0832 0.00161457C5.91697 -0.00268364 1.6533 0.00161457 1.60602 0.0145092Z"
                  fill="white"
                />
                <path
                  d="M0.097244 1.30379C0.019879 1.5015 0.015581 1.78947 0.0026868 7.59184C-0.00590931 13.6693 -0.00161125 13.8971 0.135927 14.228L0.187503 14.3484L3.5185 11.0389L6.84949 7.72508L4.95835 5.82964C3.91822 4.78521 2.41819 3.29379 1.62305 2.51584L0.174609 1.10178L0.097244 1.30379Z"
                  fill="white"
                />
                <path
                  d="M18.4713 4.40714L15.1447 7.72094L18.4713 11.0347C20.947 13.4932 21.8109 14.3313 21.8367 14.2841C21.8539 14.2497 21.8969 14.1078 21.9356 13.9703C21.9915 13.7511 22.0001 12.9474 22.0001 7.72094C22.0001 2.4945 21.9915 1.69076 21.9356 1.47156C21.8969 1.33403 21.8539 1.19219 21.8367 1.15781C21.8109 1.11053 20.947 1.94865 18.4713 4.40714Z"
                  fill="white"
                />
                <path
                  d="M4.41654 11.9674L1.08984 15.2726L1.32624 15.3542C1.55403 15.4316 1.82481 15.4359 10.9969 15.4359C20.1044 15.4359 20.4397 15.4316 20.6632 15.3542L20.891 15.2769L19.0084 13.3857C17.9683 12.3456 16.4683 10.8585 15.6689 10.0762L14.2204 8.65356L13.6273 9.2295C13.3049 9.54756 12.9224 9.88281 12.7849 9.97307C11.8909 10.5662 10.7347 10.6737 9.74613 10.261C9.30773 10.0762 9.00257 9.84842 8.37075 9.2338C8.0484 8.92434 7.77332 8.66646 7.76043 8.66646C7.75183 8.66646 6.24321 10.1536 4.41654 11.9674Z"
                  fill="white"
                />
              </svg>
            </a>
            <a href="https://www.github.com/nabilbelfki" target="_blank">
              <svg
                height="50"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.5 0C1.11929 0 0 1.11929 0 2.5V18.5C0 19.8807 1.11929 21 2.5 21H18.5C19.8807 21 21 19.8807 21 18.5V2.5C21 1.11929 19.8807 0 18.5 0H2.5ZM4.36349 5.00061C4.09632 4.35938 4.1292 3.04405 4.42926 2.23841L4.51147 2.01233H4.80742C5.48975 2.01233 6.4968 2.40282 7.52852 3.0646L7.77103 3.21669L8.00122 3.16736C9.20968 2.90018 10.0523 2.81386 11.1251 2.84675C11.9513 2.87552 12.4775 2.93718 13.2502 3.1057L13.7517 3.21258L14.0518 3.0235C14.5286 2.71521 15.2767 2.3535 15.7576 2.18908C16.107 2.07399 16.2878 2.03699 16.6002 2.02055L16.9989 2L17.0483 2.1192C17.3565 2.92484 17.4264 4.05932 17.2127 4.82386L17.1346 5.10748L17.3565 5.38699C17.8087 5.9419 18.1211 6.62012 18.2608 7.34355C18.3472 7.77926 18.3595 8.77809 18.2814 9.39054C18.0471 11.2567 17.1798 12.572 15.7042 13.3078C15.1369 13.5914 14.1299 13.875 13.316 13.9778L12.9378 14.0271L13.1146 14.2573C13.3489 14.5532 13.4927 14.8492 13.6037 15.2397C13.6859 15.5397 13.69 15.6672 13.7024 17.5292C13.7106 18.6143 13.727 19.5433 13.7353 19.5926C13.764 19.7159 13.9079 19.8475 14.0641 19.8886C14.2573 19.9379 13.0776 19.9708 10.0153 19.9913C7.68883 20.0078 7.30656 20.0037 7.43809 19.9543C7.64772 19.8803 7.74637 19.7858 7.79981 19.6049C7.84502 19.457 7.84091 17.5374 7.79159 17.4922C7.77925 17.4799 7.54907 17.5004 7.27778 17.5333C6.42693 17.6484 5.68705 17.5456 5.04582 17.2332C4.81564 17.1181 4.643 16.9907 4.40049 16.7482C4.09221 16.444 4.04288 16.3742 3.78803 15.8439C3.35233 14.9396 3.04816 14.5409 2.5138 14.1792C2.24251 13.9942 2 13.764 2 13.69C2 13.5338 2.36994 13.4229 2.71932 13.4804C3.38932 13.5914 3.91546 13.9778 4.42515 14.7341C5.1157 15.7617 6.01177 16.1193 7.19969 15.8439C7.33533 15.8151 7.53263 15.7535 7.63539 15.7083C7.82447 15.6261 7.82858 15.6219 7.89024 15.3383C7.98067 14.9437 8.1533 14.5738 8.3876 14.2902C8.5068 14.1422 8.56024 14.0477 8.52735 14.0394C8.50329 14.0326 8.33265 14.0056 8.12598 13.9729C8.08549 13.9665 8.04363 13.9598 8.00122 13.9531C4.76631 13.4722 3.19202 11.6431 3.19202 8.35883C3.19202 7.22024 3.45509 6.36938 4.05932 5.5473C4.16619 5.39932 4.29362 5.24312 4.33883 5.20202C4.40871 5.13625 4.41282 5.1157 4.36349 5.00061Z"
                  fill="#2E2E2E"
                />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/nabilbelfki" target="_blank">
              <svg
                height="50"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.5 0H2.5C1.12 0 0 1.12 0 2.5V18.5C0 19.88 1.12 21 2.5 21H18.5C19.88 21 21 19.88 21 18.5V2.5C21 1.12 19.88 0 18.5 0ZM6.5 8V17.5H3.5V8H6.5ZM3.5 5.235C3.5 4.535 4.1 4 5 4C5.9 4 6.465 4.535 6.5 5.235C6.5 5.935 5.94 6.5 5 6.5C4.1 6.5 3.5 5.935 3.5 5.235ZM17.5 17.5H14.5C14.5 17.5 14.5 12.87 14.5 12.5C14.5 11.5 14 10.5 12.75 10.48H12.71C11.5 10.48 11 11.51 11 12.5C11 12.955 11 17.5 11 17.5H8V8H11V9.28C11 9.28 11.965 8 13.905 8C15.89 8 17.5 9.365 17.5 12.13V17.5Z"
                  fill="#0E44B9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography;
