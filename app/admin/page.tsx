"use client";
import React, { useState } from "react";
import styles from "./SignIn.module.css"
import { cursorTo } from "readline";

const SignIn: React.FC = () => {
  const [page, setPage] = useState<'signin' | 'register' | 'forgot'>('signin');
  const buttonTexts = {
    'signin': 'Sign In',
    'register': 'Create Account',
    'forgot': 'Send Email',
  };
  return (
    <div className={styles.background}> 
      <div className={styles.container}>
          <div className={styles.logo}>
              <svg xmlns="http://www.w3.org/2000/svg" height="150" viewBox="0 0 75 41" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.6081 40.8141H0L23.0188 0H34.6168L35.148 14.7852H35.6792L44.0899 0.0885339H66.2234C77.0245 -0.177068 79.5035 14.5196 64.1871 20.0972C73.5717 22.1335 70.9157 38.3352 54.1828 40.6371H23.9927L23.4615 25.7634H23.0188L14.6081 40.8141ZM57.8125 16.0247H50.7298L54.9794 8.49927H58.8749C62.6818 8.41074 65.3379 13.4572 57.8125 16.0247ZM51.7036 31.341H42.0534L47.0999 22.4876H54.4482C58.6093 22.3991 59.229 29.5703 51.7036 31.341Z" fill="#254D99"/>
              </svg>
          </div>
          {page === 'register' && (<div className={styles.signin}>
            <span className={styles.unclickable}>Already have an account?</span><span className={styles.clickable} onClick={() => setPage('signin')}>Sign In</span>
          </div>)}
          {page === 'forgot' && (<div className={styles.signin}>
            <span className={styles.unclickable}>Know your password?</span><span className={styles.clickable} onClick={() => setPage('signin')}>Sign In</span>
          </div>)}
          {page === 'signin' && (<div className={styles.signin}>
            <span className={styles.unclickable}>Dont have an account?</span><span className={styles.clickable} onClick={() => setPage('register')}>Create an Account</span>
          </div>)}
          <input type="text" placeholder="Username or Email" name="username" className={styles.username} />
          {page !== 'forgot' && (<input type="password" placeholder="Password" name="password" className={styles.password} />)}
          {page === 'register' && (<input type="password" placeholder="Retype Password" name="retype-password" className={styles.password} />)}
          {page === 'signin' && (<div className={styles[`forgot-password`]}><span style={{cursor: 'pointer'}} onClick={()=> setPage('forgot')}>Forgot Password</span></div>)}
          <button className={styles.submit}>{buttonTexts[page]}</button>
      </div>
    </div>
  );
};

export default SignIn;