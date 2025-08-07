"use client";
import React, { useState } from "react";
import styles from "./SignIn.module.css"
import { useRouter } from "next/navigation";

interface Form {
  firstName?: string;
  lastName?: string;
  emailOrUsername: string;
  password?: string;
  retypePassword?: string;
}

const SignIn: React.FC = () => {
  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    emailOrUsername: '',
    password: '',
    retypePassword: ''
  });
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [page, setPage] = useState<'signin' | 'register' | 'forgot' | 'account-created' | 'email-sent'>('signin');
  
  const buttonTexts = {
    'signin': 'Sign In',
    'register': 'Create Account',
    'forgot': 'Send Email',
  };

  const usernameEmailPlaceholder = page === 'register' ? 'Email' : 'Username or Email';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    console.log("Validating...")
    const newErrors: Record<string, boolean> = {};
    
    if (page === 'register') {
      console.log('Register');
      if (!form.firstName) newErrors.firstname = true;
      if (!form.lastName) newErrors.lastname = true;
      if (!form.emailOrUsername) newErrors.username = true;
      if (!form.password) newErrors.password = true;
      if (!form.retypePassword) newErrors.retypePassword = true;
      
      if (form.password && form.retypePassword && form.password !== form.retypePassword) {
        newErrors.password = true;
        newErrors.retypePassword = true;
      }
      
      if (form.emailOrUsername && !form.emailOrUsername.includes("@")) {
        newErrors.emailOrUsername = true;
      }
    } else if (page === 'signin') {
      if (!form.emailOrUsername) newErrors.username = true;
      if (!form.password) newErrors.password = true;
    } else if (page === 'forgot') {
      if (!form.emailOrUsername) newErrors.username = true;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (page === 'register') {
        await createUser();
      } else if (page === 'forgot') {
        await sendPasswordResetEmail();
      } else if (page === 'signin') {
        await signin();
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const changePage = (page: 'signin' | 'register' | 'forgot' | 'account-created' | 'email-sent') => {
    setErrors({
      firstname: false,
      lastname: false,
      username: false,
      password: false,
      retypePassword: false,
    });
    setPage(page);
  };

  const createUser = async () => {
    try {
      // Prepare the data to send - ensure all address fields are strings (empty or filled)
      const dataToSend = {
        username: form.emailOrUsername.split("@")[0],
        firstName: form.firstName || '',
        lastName: form.lastName || '',
        email: form.emailOrUsername,
        password: form.password,
        image: '',
        birthday: "",
        phoneNumber: "",
        role: "",
        status: "Pending",
        address: {
            addressOne: "",
            addressTwo: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        }
      };

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const newUser = await response.json();
      console.log('User created successfully:', newUser);
      
      setPage('account-created');
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const sendPasswordResetEmail = () => {
    setPage('email-sent');
  }

  // In your signin function
  const signin = async () => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This is crucial
        body: JSON.stringify({
          emailOrUsername: form.emailOrUsername,
          password: form.password
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Immediately verify the session after signin
      const authCheck = await fetch('/api/authorize', {
        credentials: 'include'
      });
      const authData = await authCheck.json();
      
      if (authData.isAuthenticated) {
        router.push('/admin/dashboard');
      } else {
        throw new Error('Session verification failed');
      }
    } catch (error) {
      setErrorMessage('Something went wrong');
    }
  }

  const getInputClassName = (fieldName: string) => {
    return `${styles[fieldName]} ${errors[fieldName] ? styles.error : ''}`;
  };

  return (
    <div className={styles.background}> 
      <form className={styles.container} onSubmit={handleSubmit}>
          {page === 'account-created' || page === 'email-sent' ? (
            <div className={styles.verified}>
              <svg xmlns="http://www.w3.org/2000/svg" height="150" viewBox="0 0 40 40" fill="none">
                <path d="M19.9707 0.000296191C20.0502 0.000464339 20.1296 0.000632487 20.2114 0.000805731C21.3513 0.00468112 22.4697 0.0242565 23.5893 0.258743C23.6654 0.274244 23.7414 0.289745 23.8198 0.305716C28.4676 1.27787 32.8649 3.766 35.7618 7.59277C35.7942 7.63481 35.8266 7.67685 35.86 7.72016C37.7717 10.2067 39.0586 13.0586 39.6876 16.1313C39.6991 16.1873 39.7106 16.2434 39.7224 16.3012C39.9545 17.522 40.0044 18.7292 39.9997 19.9689C39.9995 20.0484 39.9994 20.1278 39.9992 20.2096C39.9953 21.3494 39.9757 22.4676 39.7412 23.5872C39.718 23.7013 39.718 23.7013 39.6943 23.8177C38.8943 27.6413 37.1512 31.0746 34.4353 33.886C34.3886 33.9345 34.3418 33.9829 34.2937 34.0328C33.6957 34.6493 33.0916 35.238 32.4065 35.7585C32.3644 35.7911 32.3222 35.8236 32.2788 35.8571C29.7921 37.7685 26.94 39.0551 23.8673 39.684C23.8112 39.6955 23.7551 39.707 23.6973 39.7188C22.5522 39.9365 21.4188 39.9989 20.2554 39.9963C20.026 39.9961 19.7967 39.9979 19.5673 39.9999C18.5239 40.0034 17.5176 39.9093 16.4887 39.7376C16.3556 39.7156 16.3556 39.7156 16.2199 39.6932C16.0173 39.6568 15.8167 39.6163 15.6158 39.5719C15.5074 39.5479 15.5074 39.5479 15.3968 39.5235C11.8782 38.7054 8.70326 36.9315 6.11091 34.4322C6.0357 34.3602 6.0357 34.3602 5.95897 34.2867C5.24297 33.598 4.59145 32.8927 4.00414 32.0915C3.95443 32.0249 3.95443 32.0249 3.90371 31.9569C3.39531 31.275 2.94015 30.5693 2.5216 29.8289C2.49021 29.7737 2.45883 29.7186 2.4265 29.6617C1.41014 27.8566 0.727483 25.8928 0.312411 23.8651C0.300913 23.809 0.289415 23.753 0.277568 23.6952C0.0455223 22.4744 -0.0044248 21.2672 0.000296218 20.0275C0.000464381 19.948 0.000632545 19.8686 0.000805804 19.7868C0.00468154 18.647 0.0242587 17.5288 0.258766 16.4092C0.274268 16.3331 0.289771 16.2571 0.305743 16.1787C1.09544 12.4039 2.80556 8.97186 5.48668 6.18838C5.53601 6.13694 5.58533 6.08549 5.63615 6.03249C6.34968 5.2922 7.07514 4.6103 7.90557 4.00378C7.99538 3.93683 8.0852 3.86988 8.17501 3.80293C8.81404 3.33187 9.47748 2.9119 10.1684 2.52137C10.2236 2.48999 10.2788 2.45861 10.3356 2.42628C12.1408 1.41002 14.1049 0.727417 16.1327 0.312382C16.1888 0.300885 16.2449 0.289389 16.3027 0.277543C17.5236 0.0455182 18.7309 -0.0044244 19.9707 0.000296191ZM28.6935 12.0601C28.6448 12.1089 28.5962 12.1576 28.546 12.2079C28.384 12.3704 28.2228 12.5338 28.0616 12.6972C27.9452 12.8142 27.8288 12.9313 27.7123 13.0482C27.4621 13.2997 27.2123 13.5515 26.9627 13.8035C26.5683 14.2018 26.1729 14.5991 25.7774 14.9962C24.7242 16.0539 23.6723 17.1129 22.621 18.1725C21.9297 18.8693 21.2379 19.5655 20.545 20.2606C20.1514 20.6557 19.7586 21.0515 19.3666 21.4481C19.1231 21.694 18.8788 21.939 18.6343 22.1838C18.5207 22.2979 18.4075 22.4123 18.2946 22.527C18.141 22.6831 17.9862 22.8379 17.8312 22.9924C17.7863 23.0386 17.7414 23.0847 17.6952 23.1323C17.5691 23.2564 17.5691 23.2564 17.347 23.4311C17.073 23.3951 16.9474 23.294 16.7557 23.0989C16.7017 23.0446 16.6477 22.9902 16.592 22.9342C16.5336 22.8742 16.4751 22.8141 16.4149 22.7523C16.3527 22.6894 16.2905 22.6264 16.2264 22.5616C16.0912 22.4248 15.9563 22.2877 15.8216 22.1504C15.6083 21.933 15.3942 21.7166 15.1799 21.5003C14.5705 20.8853 13.9625 20.269 13.3555 19.6516C12.9843 19.2741 12.6119 18.8978 12.2388 18.5222C12.0969 18.3788 11.9554 18.235 11.8144 18.0907C11.617 17.8888 11.4182 17.6884 11.219 17.4883C11.1611 17.4284 11.1033 17.3685 11.0437 17.3068C10.6873 16.9524 10.4377 16.7849 9.93431 16.7213C9.38771 16.842 9.03859 17.2546 8.65539 17.643C8.54453 17.755 8.43191 17.8649 8.31903 17.9748C8.24807 18.0459 8.1771 18.117 8.10399 18.1903C8.00746 18.2867 8.00746 18.2867 7.90898 18.3851C7.7154 18.6385 7.64491 18.8253 7.59345 19.14C7.67696 19.5584 7.80349 19.7888 8.10388 20.0884C8.15823 20.1434 8.15823 20.1434 8.21369 20.1995C8.33449 20.3213 8.45664 20.4417 8.57883 20.5621C8.66607 20.6495 8.75322 20.7369 8.84029 20.8245C9.0764 21.0614 9.31371 21.297 9.55127 21.5324C9.79983 21.7791 10.0474 22.0268 10.295 22.2744C10.7109 22.6899 11.1275 23.1046 11.5446 23.5189C12.0269 23.9978 12.5082 24.4777 12.9889 24.9582C13.5009 25.4698 14.0135 25.9809 14.5263 26.4917C14.674 26.6389 14.8216 26.7862 14.9692 26.9335C15.201 27.1649 15.4333 27.3959 15.6659 27.6265C15.7512 27.7112 15.8364 27.7961 15.9214 27.8811C16.0374 27.997 16.1539 28.1125 16.2706 28.2278C16.3357 28.2925 16.4008 28.3573 16.4679 28.424C16.7769 28.6975 16.9955 28.7541 17.4098 28.7726C17.9116 28.6672 18.2928 28.2038 18.6402 27.8556C18.6981 27.7982 18.756 27.7407 18.8157 27.6815C19.0092 27.4894 19.2022 27.2966 19.3952 27.1039C19.534 26.9658 19.6728 26.8278 19.8117 26.6898C20.1885 26.315 20.5648 25.9398 20.9409 25.5644C21.1759 25.3298 21.4111 25.0954 21.6462 24.861C22.2977 24.2114 22.9491 23.5617 23.5999 22.9115C23.6415 22.8699 23.6831 22.8283 23.726 22.7855C23.7677 22.7439 23.8094 22.7022 23.8523 22.6593C23.9368 22.5749 24.0213 22.4904 24.1058 22.406C24.1477 22.3642 24.1896 22.3223 24.2328 22.2791C24.9122 21.6004 25.5926 20.9228 26.2735 20.2456C26.9732 19.5497 27.672 18.8529 28.3699 18.1553C28.7615 17.7638 29.1535 17.3727 29.5465 16.9826C29.916 16.6158 30.2843 16.2478 30.6518 15.8789C30.7868 15.7438 30.9222 15.6091 31.0581 15.4748C31.2436 15.2913 31.4276 15.1064 31.6113 14.9211C31.6652 14.8684 31.7192 14.8157 31.7748 14.7614C32.1123 14.4169 32.3283 14.0839 32.4065 13.6004C32.2943 12.9685 31.8492 12.6 31.4019 12.1668C31.3318 12.0965 31.2617 12.0262 31.1895 11.9537C30.6753 11.442 30.6753 11.442 29.9974 11.2305C29.4444 11.2969 29.0668 11.6789 28.6935 12.0601Z" fill="#47AF2B"/>
              </svg>
              <div className={styles.confirmation}>{page === 'account-created' ? 'Account Created' : 'Email Sent'}</div>
              <div className={styles.text}>{page === 'account-created' ? 'Sit back and relax, while an administrator reviews your account. Once its approved we will send you an email.' : 'We just sent you an email to reset your password. Please follow the instructions and hopefully this time you can sign in.'}</div>
            </div>) : (
            <>
              <div className={styles.logo}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="150" viewBox="0 0 75 41" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M14.6081 40.8141H0L23.0188 0H34.6168L35.148 14.7852H35.6792L44.0899 0.0885339H66.2234C77.0245 -0.177068 79.5035 14.5196 64.1871 20.0972C73.5717 22.1335 70.9157 38.3352 54.1828 40.6371H23.9927L23.4615 25.7634H23.0188L14.6081 40.8141ZM57.8125 16.0247H50.7298L54.9794 8.49927H58.8749C62.6818 8.41074 65.3379 13.4572 57.8125 16.0247ZM51.7036 31.341H42.0534L47.0999 22.4876H54.4482C58.6093 22.3991 59.229 29.5703 51.7036 31.341Z" fill="#254D99"/>
                  </svg>
              </div>
              
              {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

              {page === 'register' && (<div className={styles.signin}>
                <span className={styles.unclickable}>Already have an account?</span><span className={styles.clickable} onClick={() => changePage('signin')}>Sign In</span>
              </div>)}
              {page === 'forgot' && (<div className={styles.signin}>
                <span className={styles.unclickable}>Know your password?</span><span className={styles.clickable} onClick={() => changePage('signin')}>Sign In</span>
              </div>)}
              {page === 'signin' && (<div className={styles.signin}>
                <span className={styles.unclickable}>Dont have an account?</span><span className={styles.clickable} onClick={() => changePage('register')}>Create an Account</span>
              </div>)}
              {page === 'register' && (<div className={styles['first-and-last-name']}>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    name="firstName" 
                    className={getInputClassName('firstname')} 
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    name="lastName" 
                    className={getInputClassName('lastname')} 
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>)}
              <input 
                type="text" 
                placeholder={usernameEmailPlaceholder} 
                name="emailOrUsername" 
                className={getInputClassName('username')} 
                value={form.emailOrUsername}
                onChange={handleChange}
              />
              {page !== 'forgot' && (
                <input 
                  type="password" 
                  placeholder="Password" 
                  name="password" 
                  className={getInputClassName('password')} 
                  value={form.password}
                  onChange={handleChange}
                />
              )}
              {page === 'register' && (
                <input 
                  type="password" 
                  placeholder="Retype Password" 
                  name="retypePassword" 
                  className={getInputClassName('password')} 
                  value={form.retypePassword}
                  onChange={handleChange}
                />
              )}
              {page === 'signin' && (<div className={styles[`forgot-password`]}><span style={{cursor: 'pointer'}} onClick={()=> changePage('forgot')}>Forgot Password</span></div>)}
              <button type="submit" className={styles.submit}>{buttonTexts[page]}</button>
            </>
          )}
      </form>
    </div>
  );
};

export default SignIn;