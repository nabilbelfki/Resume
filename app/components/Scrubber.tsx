import React, { useState, useRef } from "react";
import styles from "./Scrubber.module.css";

interface ScrubberProps {
  type: string;
  setType: (type: string) => void;
}

const Scrubber: React.FC<ScrubberProps> = ({ type, setType }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrubberRef.current) {
      setIsDragging(true);
      setStartY(e.pageY - scrubberRef.current.offsetTop);
      setScrollTop(scrubberRef.current.scrollTop);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrubberRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrubberRef.current.offsetTop;
    const walk = (y - startY) * 3; // Adjust the scroll speed
    scrubberRef.current.scrollTop = scrollTop - walk;
    determineType(e.pageY); // Call determineType while dragging
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrubberRef.current) {
      setIsDragging(true);
      setStartY(e.touches[0].pageY - scrubberRef.current.offsetTop);
      setScrollTop(scrubberRef.current.scrollTop);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrubberRef.current) return;
    e.preventDefault();
    const y = e.touches[0].pageY - scrubberRef.current.offsetTop;
    const walk = (y - startY) * 3; // Adjust the scroll speed
    scrubberRef.current.scrollTop = scrollTop - walk;
    determineType(e.touches[0].pageY); // Call determineType while dragging
  };

  const determineType = (pageY: number) => {
    if (!scrubberRef.current) return;
    const scrubberHeight = scrubberRef.current.offsetHeight;
    const relativeY = pageY - scrubberRef.current.offsetTop;
    const sectionHeight = scrubberHeight / 6; // Assuming 6 sections

    let newType = "";
    if (relativeY < sectionHeight) {
      newType = "mobile";
    } else if (relativeY < sectionHeight * 2) {
      newType = "frontend";
    } else if (relativeY < sectionHeight * 3) {
      newType = "backend";
    } else if (relativeY < sectionHeight * 4) {
      newType = "database";
    } else if (relativeY < sectionHeight * 5) {
      newType = "cloud";
    } else {
      newType = "miscellaneous";
    }

    if (newType !== type) {
      setType(newType);
      triggerVibration();
    }
  };

  const triggerVibration = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms
    }
  };

  return (
    <div
      className={styles["skills-types"]}
      ref={scrubberRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <div className="mobile-type" onClick={() => setType("mobile")}>
        <svg
          height="20"
          viewBox="0 0 3 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: type == "mobile" ? "scale(1.3)" : "scale(1)" }}
        >
          <path
            d="M0.608213 0.0149031C0.421663 0.0598316 0.261484 0.213174 0.213625 0.394841C0.202881 0.434886 0.199951 0.81287 0.199951 2.49964C0.199951 3.87581 0.203858 4.57025 0.210695 4.59955C0.252693 4.78415 0.43436 4.95507 0.623841 4.98926C0.662909 4.99609 0.977408 5 1.56636 5C2.53818 5 2.52841 5 2.64952 4.94042C2.72766 4.90233 2.83119 4.79978 2.87319 4.72066C2.93863 4.5976 2.93472 4.74606 2.93472 2.48987C2.93472 0.277637 2.93765 0.393864 2.88491 0.289357C2.83803 0.19657 2.74524 0.10476 2.64952 0.0559244C2.53623 -0.00170088 2.55088 -0.000724316 1.56538 0.000252724C0.832855 0.00122929 0.653142 0.00318241 0.608213 0.0149031ZM1.11512 0.321588C1.1454 0.332332 1.16689 0.36554 1.16689 0.400701C1.16689 0.430979 1.12391 0.468094 1.08875 0.468094C1.05359 0.468094 1.01062 0.430979 1.01062 0.400701C1.01062 0.367493 1.0321 0.332332 1.05847 0.322565C1.07215 0.317681 1.08387 0.312798 1.08485 0.312798C1.08582 0.311821 1.0995 0.316705 1.11512 0.321588ZM1.86621 0.334285C1.88574 0.350889 1.89258 0.366517 1.89258 0.389957C1.89258 0.413398 1.88574 0.429026 1.86621 0.44563C1.83984 0.468094 1.83886 0.468094 1.5732 0.468094C1.31828 0.468094 1.30558 0.467117 1.28019 0.447583C1.26065 0.431956 1.25479 0.419259 1.25479 0.389957C1.25479 0.360656 1.26065 0.347959 1.28019 0.332332C1.30558 0.312798 1.31828 0.311821 1.5732 0.311821C1.83886 0.311821 1.83984 0.311821 1.86621 0.334285ZM2.70031 2.4801V4.21864H1.58687H0.473428V2.4801V0.741571H1.58687H2.70031V2.4801ZM1.65036 4.39933C1.73533 4.43449 1.78612 4.51262 1.78612 4.60932C1.78612 4.75094 1.67184 4.85545 1.53315 4.8408C1.47162 4.83494 1.43548 4.81736 1.39348 4.77438C1.34563 4.72555 1.32804 4.68062 1.32804 4.60932C1.32902 4.48821 1.39544 4.41105 1.52339 4.38175C1.54976 4.37491 1.61422 4.3837 1.65036 4.39933Z"
            fill="#2E2E2E"
            fillOpacity={type == "mobile" ? "0.7" : "0.3"}
          />
        </svg>
      </div>
      <div className="frontend-type" onClick={() => setType("frontend")}>
        <svg
          height="20"
          viewBox="0 0 5 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: type == "frontend" ? "scale(1.3)" : "scale(1)",
          }}
        >
          <path
            opacity="0.997"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5 0.537367C5 1.4651 5 2.39284 5 3.32057C4.93951 3.58779 4.77675 3.75868 4.51172 3.83327C3.84149 3.84457 3.17092 3.84946 2.5 3.84791C1.82908 3.84946 1.15851 3.84457 0.488281 3.83327C0.223248 3.75868 0.0604877 3.58779 0 3.32057C0 2.39284 0 1.4651 0 0.537367C0.0657258 0.25842 0.238252 0.0842669 0.517578 0.0149056C1.17818 0.00366338 1.83898 -0.00121943 2.5 0.000257129C3.16102 -0.00121943 3.82182 0.00366338 4.48242 0.0149056C4.76175 0.0842669 4.93428 0.25842 5 0.537367Z"
            fill="#2E2E2E"
            fillOpacity={type == "frontend" ? "0.7" : "0.3"}
          />
          <path
            opacity="0.968"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.8555 4.07252C2.28519 4.07252 2.71487 4.07252 3.14456 4.07252C3.14456 4.18971 3.14456 4.3069 3.14456 4.42408C3.46093 4.41942 3.77668 4.4243 4.09183 4.43873C4.19128 4.50297 4.21569 4.58923 4.16507 4.69752C4.13261 4.74937 4.0854 4.77703 4.02347 4.78053C3.00784 4.78704 1.99222 4.78704 0.976594 4.78053C0.868923 4.76876 0.813585 4.70854 0.810578 4.59986C0.809396 4.52573 0.841948 4.47202 0.908234 4.43873C1.22338 4.4243 1.53913 4.41942 1.8555 4.42408C1.8555 4.3069 1.8555 4.18971 1.8555 4.07252Z"
            fill="#2E2E2E"
            fillOpacity={type == "frontend" ? "0.7" : "0.3"}
          />
        </svg>
      </div>
      <div className="backend-type" onClick={() => setType("backend")}>
        <svg
          height="20"
          viewBox="0 0 5 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: type == "backend" ? "scale(1.3)" : "scale(1)" }}
        >
          <path
            d="M0.367956 0.00842714C0.195087 0.0377269 0.0388221 0.197899 0.00952241 0.375651C-0.00317414 0.450853 -0.00317414 1.13842 0.00952241 1.21362C0.0300322 1.34059 0.124768 1.47244 0.24099 1.53494C0.349399 1.59354 0.236107 1.59061 2.5 1.59061C4.76389 1.59061 4.6506 1.59354 4.75901 1.53494C4.87523 1.47244 4.96997 1.34059 4.99048 1.21362C5.00317 1.13842 5.00317 0.450853 4.99048 0.375651C4.96118 0.193015 4.80589 0.0377269 4.62325 0.00842714C4.55293 -0.0032928 0.436322 -0.00231612 0.367956 0.00842714ZM0.857261 0.473316C0.905118 0.506523 0.908048 0.527032 0.908048 0.794637C0.908048 1.06419 0.905118 1.08275 0.855308 1.11596C0.801592 1.15112 0.718576 1.12475 0.69416 1.06517C0.686346 1.04564 0.683416 0.960669 0.68537 0.77608L0.6883 0.514336L0.720529 0.486013C0.756666 0.452806 0.820148 0.446947 0.857261 0.473316ZM1.30652 0.471363C1.35926 0.498709 1.36219 0.516289 1.36219 0.794637C1.36219 1.07201 1.36024 1.0847 1.30848 1.11498C1.25476 1.14721 1.17858 1.12768 1.15026 1.07494C1.14049 1.05638 1.13756 0.988015 1.13756 0.79073C1.13756 0.559262 1.13952 0.528009 1.15417 0.506523C1.18835 0.458666 1.25378 0.444017 1.30652 0.471363ZM1.77923 0.486013L1.81146 0.514336L1.81439 0.77608C1.81634 0.960669 1.81341 1.04564 1.8056 1.06517C1.77044 1.14916 1.64835 1.15405 1.60538 1.07201C1.58487 1.03099 1.58487 0.557309 1.60636 0.516289C1.64054 0.450853 1.72356 0.436203 1.77923 0.486013ZM3.51475 0.594422C3.55186 0.612978 3.57823 0.638371 3.60948 0.687204C3.62413 0.709668 3.62804 0.734084 3.62804 0.794637C3.62804 0.863003 3.62511 0.877653 3.60069 0.913789C3.50596 1.06126 3.28621 1.05052 3.20905 0.895233C3.12897 0.735061 3.25593 0.551449 3.43173 0.570982C3.4581 0.573912 3.49521 0.583679 3.51475 0.594422ZM4.15446 0.578795C4.29119 0.619815 4.35467 0.76729 4.29119 0.895233C4.21403 1.05052 3.99429 1.06126 3.89955 0.913789C3.87513 0.877653 3.8722 0.863003 3.8722 0.794637C3.8722 0.734084 3.87611 0.709668 3.89076 0.687204C3.93373 0.620792 3.97475 0.589539 4.03824 0.573912C4.08414 0.563169 4.10465 0.564145 4.15446 0.578795Z"
            fill="#2E2E2E"
            fillOpacity={type == "backend" ? "0.7" : "0.3"}
          />
          <path
            d="M0.304473 1.73125C0.164811 1.78399 0.0730047 1.87872 0.0222185 2.02229C0.00659199 2.06917 0.00463867 2.11117 0.00463867 2.4989C0.00463867 2.88663 0.00659199 2.92863 0.0222185 2.97551C0.0739814 3.12298 0.170671 3.21967 0.317169 3.27046C0.372839 3.28999 0.397255 3.28999 2.5 3.28999C4.60274 3.28999 4.62716 3.28999 4.68283 3.27046C4.82933 3.21967 4.92602 3.12298 4.97778 2.97551C4.99341 2.92863 4.99536 2.88663 4.99536 2.4989C4.99536 2.11117 4.99341 2.06917 4.97778 2.02229C4.92602 1.87482 4.82933 1.77813 4.68283 1.72734C4.62716 1.70781 4.60274 1.70781 2.49609 1.70878H0.366002L0.304473 1.73125ZM0.860191 2.17953C0.903164 2.2059 0.908047 2.23911 0.908047 2.49695C0.908047 2.63173 0.904141 2.75283 0.899257 2.76553C0.866051 2.8505 0.745922 2.86124 0.700019 2.78311C0.685369 2.75869 0.683416 2.72256 0.683416 2.4989C0.683416 2.27622 0.685369 2.23911 0.700019 2.21469C0.731272 2.16195 0.805498 2.14535 0.860191 2.17953ZM1.31824 2.18539C1.36317 2.21762 1.36805 2.25767 1.36512 2.51843C1.36219 2.78799 1.35926 2.79971 1.2909 2.82803C1.25964 2.84073 1.24988 2.84171 1.21667 2.82999C1.19518 2.82217 1.16881 2.80362 1.15807 2.78897C1.13854 2.7626 1.13756 2.7499 1.13756 2.49988C1.13756 2.26353 1.13952 2.23618 1.15514 2.21176C1.1903 2.15805 1.26453 2.14535 1.31824 2.18539ZM1.75188 2.17172C1.81341 2.20102 1.81634 2.21469 1.81634 2.4989C1.81634 2.72256 1.81439 2.75869 1.79974 2.78311C1.75383 2.86124 1.6337 2.8505 1.6005 2.76553C1.59561 2.75283 1.59171 2.63173 1.59171 2.49695C1.59171 2.20493 1.59561 2.19125 1.67961 2.16391C1.705 2.15512 1.71965 2.15707 1.75188 2.17172ZM3.49424 2.2899C3.57725 2.32408 3.63292 2.40709 3.63292 2.4989C3.63292 2.62587 3.53428 2.72353 3.40634 2.72353C3.28328 2.72256 3.18366 2.62196 3.18366 2.4989C3.18366 2.41393 3.23933 2.32701 3.31453 2.29283C3.36336 2.27036 3.4454 2.26939 3.49424 2.2899ZM4.18571 2.29283C4.23357 2.31431 4.29412 2.38268 4.30682 2.42956C4.32928 2.51062 4.31365 2.58387 4.26091 2.6454C4.12613 2.80264 3.8683 2.70791 3.86732 2.50085C3.86732 2.37291 3.96499 2.27427 4.09195 2.27427C4.1232 2.27427 4.16227 2.28208 4.18571 2.29283Z"
            fill="#2E2E2E"
            fillOpacity={type == "backend" ? "0.7" : "0.3"}
          />
          <path
            d="M0.354283 3.42184C0.182391 3.45896 0.0378455 3.61131 0.00952241 3.78418C-0.00317414 3.85939 -0.00317414 4.54695 0.00952241 4.62216C0.0388221 4.80479 0.194111 4.96008 0.376746 4.98938C0.454878 5.00208 4.54512 5.00208 4.62325 4.98938C4.80589 4.96008 4.96118 4.80479 4.99048 4.62216C5.00317 4.54695 5.00317 3.85939 4.99048 3.78418C4.96997 3.65722 4.87523 3.52537 4.75901 3.46286C4.6506 3.40426 4.76487 3.40719 2.49512 3.40817C0.781082 3.40817 0.404092 3.4111 0.354283 3.42184ZM0.855308 3.88185C0.905118 3.91506 0.908048 3.93361 0.908048 4.20317C0.908048 4.47077 0.905118 4.49128 0.857261 4.52449C0.820148 4.55086 0.756666 4.545 0.720529 4.51179L0.6883 4.48347L0.68537 4.22563C0.683416 4.08499 0.68537 3.95803 0.6883 3.94533C0.69123 3.93264 0.707833 3.9092 0.724436 3.89357C0.758619 3.86134 0.815265 3.85646 0.855308 3.88185ZM1.30848 3.88283C1.36024 3.9131 1.36219 3.9258 1.36219 4.20317C1.36219 4.48152 1.35926 4.4991 1.30652 4.52644C1.25183 4.55477 1.17858 4.53621 1.15221 4.48542C1.1317 4.44831 1.13073 3.95998 1.15026 3.92287C1.17858 3.87013 1.25476 3.8506 1.30848 3.88283ZM1.76751 3.88576C1.81439 3.91896 1.81732 3.93947 1.81439 4.22173L1.81146 4.48347L1.77923 4.51179C1.74309 4.545 1.67961 4.55086 1.64249 4.52449C1.59464 4.49128 1.59171 4.47077 1.59171 4.20317C1.59171 4.04104 1.59561 3.94533 1.60245 3.93166C1.6337 3.86915 1.71281 3.84669 1.76751 3.88576ZM3.45712 3.9844C3.5167 3.99807 3.56846 4.03323 3.60069 4.08402C3.62511 4.12015 3.62804 4.1348 3.62804 4.20317C3.62804 4.28423 3.62023 4.30572 3.57042 4.36236C3.52158 4.41803 3.42392 4.44343 3.34676 4.41901C3.28133 4.39948 3.23835 4.36334 3.20905 4.30377C3.14557 4.17582 3.21198 4.02346 3.34969 3.98733C3.40439 3.9717 3.40439 3.9717 3.45712 3.9844ZM4.14665 3.98635C4.28728 4.02346 4.35663 4.17387 4.29119 4.30377C4.26189 4.36334 4.21892 4.39948 4.15348 4.41901C4.07633 4.44343 3.97866 4.41803 3.92983 4.36236C3.88002 4.30572 3.8722 4.28423 3.8722 4.20317C3.8722 4.1348 3.87513 4.12015 3.89857 4.08499C3.9308 4.03421 3.97475 4.00295 4.03238 3.98733C4.09 3.9717 4.08902 3.9717 4.14665 3.98635Z"
            fill="#2E2E2E"
            fillOpacity={type == "backend" ? "0.7" : "0.3"}
          />
        </svg>
      </div>
      <div className="database-type" onClick={() => setType("database")}>
        <svg
          height="20"
          viewBox="0 0 5 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: type == "database" ? "scale(1.3)" : "scale(1)",
          }}
        >
          <path
            d="M2.05947 0.0106034C0.87049 0.0780139 0.0604021 0.382523 0.00461415 0.7835C-0.0011971 0.82999 0.0011274 0.839288 0.0313459 0.870668C0.0755114 0.917158 0.228928 1.01827 0.33818 1.0729C0.607822 1.20888 0.975093 1.30419 1.43999 1.3623C1.7968 1.40763 2.02925 1.41925 2.49996 1.41925C2.97068 1.41925 3.20313 1.40763 3.55994 1.3623C4.02484 1.30419 4.39211 1.20888 4.66175 1.0729C4.771 1.01827 4.92442 0.917158 4.96858 0.870668C4.9988 0.839288 5.00113 0.82999 4.99532 0.7835C4.93953 0.377874 4.13641 0.0791762 2.91837 0.00944114C2.68941 -0.00334358 2.29308 -0.00334358 2.05947 0.0106034Z"
            fill="#2E2E2E"
            fillOpacity={type == "database" ? "0.7" : "0.3"}
          />
          <path
            d="M0.0012207 1.7226V2.2735L0.0511975 2.31651C0.272025 2.50595 0.645107 2.65472 1.12628 2.74538C1.27853 2.77443 1.66324 2.81976 1.88407 2.83487C1.99564 2.84184 2.27342 2.84882 2.50006 2.84882C3.30201 2.84882 3.89011 2.77676 4.35966 2.62334C4.60141 2.54314 4.81294 2.43389 4.95008 2.31651L4.9989 2.2735V1.7226C4.9989 1.41925 4.99541 1.17169 4.99192 1.17169C4.98727 1.17169 4.95357 1.19029 4.91638 1.21237C4.42939 1.50874 3.61466 1.65983 2.50006 1.65983C1.38546 1.65983 0.570723 1.50874 0.0837405 1.21237C0.0465485 1.19029 0.0128432 1.17169 0.0081942 1.17169C0.00470745 1.17169 0.0012207 1.41925 0.0012207 1.7226Z"
            fill="#2E2E2E"
            fillOpacity={type == "database" ? "0.7" : "0.3"}
          />
          <path
            d="M0.0012207 3.14635V3.70307L0.0570087 3.74956C0.477743 4.10056 1.29132 4.27606 2.50006 4.27606C3.18346 4.27606 3.67742 4.22841 4.1214 4.11916C4.48286 4.02966 4.7525 3.90879 4.94427 3.74956L4.9989 3.70307V3.14635V2.58964L4.92102 2.63845C4.55492 2.86277 3.97495 3.00921 3.20903 3.06848C2.9545 3.08824 2.04562 3.08824 1.79109 3.06848C1.02516 3.00921 0.4452 2.86277 0.0802537 2.63845L0.0012207 2.58964V3.14635Z"
            fill="#2E2E2E"
            fillOpacity={type == "database" ? "0.7" : "0.3"}
          />
          <path
            d="M0.00348675 4.61427L0.0069735 5.21051L0.0395165 5.27211C0.0999535 5.38717 0.19642 5.47434 0.369596 5.56964C0.930962 5.8788 2.17457 6.02292 3.28684 5.90786C4.19689 5.81371 4.79544 5.58591 4.96048 5.27211L4.99303 5.21051L4.99651 4.61427L5 4.0192L4.92097 4.06685C4.55253 4.29349 3.9563 4.4411 3.18573 4.49805C2.91957 4.51781 2.08043 4.51781 1.81427 4.49805C1.0437 4.4411 0.447466 4.29349 0.079033 4.06685L0 4.0192L0.00348675 4.61427Z"
            fill="#2E2E2E"
            fillOpacity={type == "database" ? "0.7" : "0.3"}
          />
        </svg>
      </div>
      <div className="cloud-type" onClick={() => setType("cloud")}>
        <svg
          height="15"
          viewBox="0 0 5 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: type == "cloud" ? "scale(1.3)" : "scale(1)" }}
        >
          <path
            d="M1.78245 0.00303864C1.49225 0.047008 1.27924 0.152535 1.08773 0.343069C0.881564 0.549236 0.769197 0.795465 0.743793 1.09543L0.736953 1.18142L0.663671 1.19998C0.582572 1.2205 0.453595 1.27913 0.384221 1.32701C0.302145 1.38368 0.203458 1.4853 0.144832 1.57421C-0.0808777 1.91717 -0.0398396 2.35394 0.247427 2.65293C0.358816 2.77018 0.510266 2.85812 0.673442 2.90111L0.756495 2.92358H2.50061H4.24473L4.32779 2.90111C4.54373 2.84444 4.73133 2.71155 4.85444 2.52884C5.0098 2.3002 5.04302 1.9973 4.94336 1.73739C4.88571 1.58887 4.75087 1.41885 4.61701 1.32701C4.54666 1.27815 4.41866 1.2205 4.33365 1.19901C4.29066 1.18826 4.25451 1.17751 4.25255 1.17653C4.25157 1.17458 4.24083 1.13843 4.23008 1.09543C4.15289 0.791557 3.91057 0.549236 3.59985 0.465206C3.53634 0.447618 3.4953 0.44371 3.38 0.44371C3.21585 0.44371 3.14061 0.459343 3.00187 0.524809C2.95594 0.546305 2.91686 0.562916 2.91588 0.561939C2.9149 0.559984 2.89341 0.528717 2.86703 0.491588C2.69897 0.251222 2.44199 0.0831606 2.14886 0.0206265C2.07753 0.00597 1.84107 -0.00575519 1.78245 0.00303864Z"
            fill="#2E2E2E"
            fillOpacity={type == "cloud" ? "0.7" : "0.3"}
          />
        </svg>
      </div>
      <div
        className="miscellaneous-type"
        onClick={() => setType("miscellaneous")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          height="15"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: type == "miscellaneous" ? "scale(1.3)" : "scale(1)",
          }}
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#2E2E2E"
            fillOpacity={type == "miscellaneous" ? "0.7" : "0.3"}
            stroke="none"
          >
            <path d="M2345 4984 c-16 -2 -73 -9 -125 -15 -358 -40 -669 -179 -891 -398 -180 -178 -221 -420 -107 -634 143 -268 412 -300 705 -84 134 99 230 145 358 172 94 19 271 19 353 0 137 -33 246 -116 300 -233 23 -49 27 -70 27 -147 0 -79 -3 -97 -29 -147 -44 -88 -113 -156 -279 -281 -287 -216 -434 -409 -520 -682 -94 -298 -38 -707 118 -874 59 -63 113 -85 195 -79 124 9 199 99 273 329 75 231 153 365 294 500 37 36 167 139 288 229 236 176 390 317 465 429 235 351 254 762 51 1148 -199 376 -525 620 -961 717 -202 45 -396 63 -515 50z" />
            <path d="M2370 1194 c-248 -53 -400 -246 -400 -509 0 -375 303 -619 673 -540 137 29 271 125 344 247 70 115 91 295 53 443 -24 93 -56 151 -124 223 -117 124 -343 180 -546 136z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Scrubber;
