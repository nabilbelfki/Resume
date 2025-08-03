"use client"
import React, { useState } from "react";
import styles from "./User.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import AvatarUpload from "@/components/AvatarUpload/AvatarUpload";
import { Breadcrumb as breadcrumb} from "@/lib/types";

interface UserData {
  image?: {
    name: string | null;
    path: string | null;
  };
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday?: string;
  phoneNumber?: string;
  role?: string;
  status?: string;
  address?: {
    addressOne?: string;
    addressTwo?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

const User: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phoneNumber: '',
    address: {
      addressOne: '',
      addressTwo: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const initials = `${(formData.firstName[0] ? formData.firstName[0] : '')}${(formData.lastName[0] ? formData.lastName[0] : '')}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs: breadcrumb[] = [
    {
      label: 'Users',
      href: '/admin/users'
    },
    {
      label: 'All Users',
      href: '/admin/users'
    },
    {
      label: 'Create User',
      href: '/admin/users/create'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    console.log(`ID: ${id}`, value)

    if (id in formData) {
      console.log('In User')
      setFormData({
        ...formData,
        [id]: value
      });
    } else if (id in formData.address!) {
      console.log('In Address')
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [id]: value
        }
      });
    }
    console.log(formData);
  };

   const handleAvatarChange = (media: { name: string | null; path: string | null }) => {
    setFormData(prev => ({
      ...prev,
      image: {
        name: media.name,
        path: media.path
      }
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
        // Basic validation
        if (!formData.username || !formData.firstName || !formData.lastName || !formData.email) {
          alert('Username, first name, last name, and email are required');
        }

        // Prepare the data to send - ensure all address fields are strings (empty or filled)
        const dataToSend = {
        ...formData,
        image: formData.image?.name && formData.image?.path 
          ? `${formData.image.path}${formData.image.name}`
          : '',
        birthday: formData.birthday || "",
        phoneNumber: formData.phoneNumber || "",
        role: "",
        status: "Pending",
        address: {
            addressOne: formData.address?.addressOne || "",
            addressTwo: formData.address?.addressTwo || "",
            city: formData.address?.city || "",
            state: formData.address?.state || "",
            zipCode: formData.address?.zipCode || "",
            country: formData.address?.country || "",
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
        
        // Redirect to users list
        window.location.href = '/admin/users';
    } catch (err) {
        console.error('Error creating user:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
        <button className={styles.back} onClick={()=>location.href = '/admin/users'}>
          <svg style={{rotate: '180deg'}} xmlns="http://www.w3.org/2000/svg" version="1.0"height="20" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#727272" stroke="none">
              <path d="M1721 4034 c-94 -47 -137 -147 -107 -249 11 -37 29 -63 68 -101 29 -28 333 -290 676 -583 342 -293 622 -535 621 -539 0 -4 -277 -243 -615 -532 -777 -663 -740 -629 -759 -693 -54 -181 134 -339 298 -251 59 32 1549 1310 1583 1358 64 90 51 196 -33 278 -26 25 -382 331 -790 680 -556 476 -751 637 -781 646 -60 18 -103 14 -161 -14z"/>
            </g>
          </svg>
          <span>Back</span>
        </button>
        <button 
          className={styles.save} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.content}>
        <AvatarUpload 
        initials={initials}
          value={formData.image}
          onChange={handleAvatarChange}
        />
        <label className={styles.title}>General Information</label>
        <div className={styles.general}>
          <div className={styles.input}>
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              placeholder="Enter First Name" 
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              placeholder="Enter Last Name" 
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter Username" 
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter Email Address" 
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="birthday">Birthday</label>
            <input 
              type="date" 
              id="birthday" 
              placeholder="Enter Birthday" 
              value={formData.birthday}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              placeholder="Enter Phone Number" 
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <label className={styles.title}>Address Information</label>
        <div className={styles.address}>
          <div className={styles.input}>
            <label htmlFor="addressOne">Address One</label>
            <input 
              type="text" 
              id="addressOne" 
              placeholder="Enter Address One" 
              value={formData.address?.addressOne || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="addressTwo">Address Two</label>
            <input 
              type="text" 
              id="addressTwo" 
              placeholder="Enter Address Two" 
              value={formData.address?.addressTwo || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="city">City</label>
            <input 
              type="text" 
              id="city" 
              placeholder="Enter City" 
              value={formData.address?.city || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="state">State</label>
            <input 
              type="text" 
              id="state" 
              placeholder="Enter State" 
              value={formData.address?.state || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="zipCode">Zip Code</label>
            <input 
              type="text" 
              id="zipCode" 
              placeholder="Enter Zip Code" 
              value={formData.address?.zipCode || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.input}>
            <label htmlFor="country">Country</label>
            <input 
              type="text" 
              id="country" 
              placeholder="Enter Country" 
              value={formData.address?.country || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;