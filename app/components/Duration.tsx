import React from "react";
import styles from "./Duration.module.css";

interface DurationProps {
  duration: string;
}

const Duration: React.FC<DurationProps> = ({ duration }) => {
  return (
    <div className={styles.duration}>
      <div className={styles.icon}>
        <svg
          width="5"
          height="7"
          viewBox="0 0 5 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.74475 0.267978V0.520002H1.99677H2.2488V0.644255V0.768509L2.30038 0.761476C2.36836 0.750926 2.60749 0.750926 2.68955 0.761476L2.75285 0.768509V0.644255V0.520002H2.99901H3.24517V0.267978V0.0159541H2.49496H1.74475V0.267978Z"
            fill="#2E2E2E"
            fillOpacity="0.8"
          />
          <path
            d="M4.00121 0.766173L3.82538 0.942003L3.92502 1.04164L4.02465 1.14128L3.9133 1.25264L3.80194 1.364L3.62024 1.27256C3.52061 1.22333 3.37877 1.16238 3.30609 1.13776C2.27338 0.790789 1.15041 1.12487 0.513905 1.96768C0.264226 2.29824 0.100117 2.67686 0.0274404 3.093C0.00165191 3.23835 -0.00889793 3.60056 0.00868513 3.76584C0.110667 4.74112 0.769445 5.564 1.70135 5.88401C2.19016 6.05047 2.69655 6.05985 3.20997 5.9098C3.76794 5.74687 4.27082 5.36473 4.58028 4.86654C4.78073 4.54536 4.8956 4.25113 4.96476 3.88423C4.99407 3.72599 4.99407 3.23601 4.96476 3.07541C4.89912 2.72258 4.77252 2.40257 4.58731 2.12593C4.48885 1.97823 4.41852 1.89266 4.28957 1.7602L4.20049 1.66877L4.2884 1.58085L4.37632 1.49294L4.47595 1.59258L4.57559 1.69221L4.75142 1.51638L4.92725 1.34055L4.55215 0.965447L4.17704 0.590342L4.00121 0.766173ZM2.49493 2.61825V3.49741H3.37408H4.25206L4.2462 3.57595C4.23565 3.71309 4.2169 3.83969 4.19228 3.93698C4.06568 4.44103 3.7023 4.87475 3.22756 5.08809C2.652 5.34715 1.98385 5.28267 1.46925 4.91812C1.35086 4.83372 1.16096 4.64382 1.07422 4.52191C0.858533 4.22066 0.749518 3.87251 0.748346 3.49155C0.747173 2.5573 1.46573 1.80123 2.40701 1.74731C2.43984 1.74496 2.47266 1.74262 2.48086 1.74145C2.49141 1.7391 2.49493 1.92197 2.49493 2.61825Z"
            fill="#2E2E2E"
            fillOpacity="0.8"
          />
        </svg>
      </div>
      <div className={styles.text}>{`${duration}`}</div>
    </div>
  );
};

export default Duration;
