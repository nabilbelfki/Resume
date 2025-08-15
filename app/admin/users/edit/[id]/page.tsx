"use client"
import React, { useState, useEffect } from "react";
import styles from "./User.module.css"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import AvatarUpload from "@/components/AvatarUpload/AvatarUpload";
import { Breadcrumb as breadcrumb} from "@/lib/types";
import { useParams, useRouter } from "next/navigation";

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
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch user`);
        }


        const data = await response.json();
    
        // Extract name and path from the image URL
        const imageUrl = data.image || '';
        let imageName = '';
        let imagePath = '';

        if (imageUrl) {
          const lastSlashIndex = imageUrl.lastIndexOf('/');
          if (lastSlashIndex >= 0) {
            imageName = imageUrl.substring(lastSlashIndex + 1);
            imagePath = imageUrl.substring(0, lastSlashIndex + 1);
          } else {
            // Handle case where URL has no slashes (just a filename)
            imageName = imageUrl;
          }
        }
        
        setFormData({
          username: data.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          birthday: data.birthday ? new Date(data.birthday).toISOString().split('T')[0] : '',
          phoneNumber: data.phoneNumber || '',
          role: data.role || '',
          status: data.status || '',
          image: {
            name: imageName,
            path: imagePath
          },
          address: {
            addressOne: data.address?.addressOne || '',
            addressTwo: data.address?.addressTwo || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            zipCode: data.address?.zipCode || '',
            country: data.address?.country || ''
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      label: id ? 'Edit User' : 'Create User',
      href: id ? `/admin/users/edit/${id}` : '/admin/users/create'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id in formData) {
      setFormData({
        ...formData,
        [id]: value
      });
    } else if (id in formData.address!) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [id]: value
        }
      });
    }
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    const errors: Record<string, boolean> = {};
    if (!formData.firstName) errors.firstName = true;
    if (!formData.lastName) errors.lastName = true;
    if (!formData.username) errors.username = true;
    if (!formData.email) errors.email = true;
    if (!formData.birthday) errors.birthday = true;
    if (!formData.phoneNumber) errors.phoneNumber = true;
    if (!formData.address?.addressOne) errors.addressOne = true;
    if (!formData.address?.city) errors.city = true;
    if (!formData.address?.state) errors.state = true;
    if (!formData.address?.zipCode) errors.zipCode = true;
    if (!formData.address?.country) errors.country = true;

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {

      const dataToSend = {
        ...formData,
        image: formData.image?.name && formData.image?.path 
          ? `${formData.image.path}${formData.image.name}`
          : '',
        birthday: formData.birthday || "",
        phoneNumber: formData.phoneNumber || "",
        address: {
          addressOne: formData.address?.addressOne || "",
          addressTwo: formData.address?.addressTwo || "",
          city: formData.address?.city || "",
          state: formData.address?.state || "",
          zipCode: formData.address?.zipCode || "",
          country: formData.address?.country || "",
        }
      };

      let response;
      // PUT request for updating existing user
      response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update user`);
      }

      const result = await response.json();
      console.log(`User updated successfully:`, result);
      
      // Redirect to users list
      router.push('/admin/users');
    } catch (err) {
      console.error(`Error updating user:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleDelete = async () => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      console.log('User deleted successfully');
      router.push('/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Breadcrumbs breadcrumbs={breadcrumbs}/>
      <div className={styles.actions}>
          <button 
            className={styles.back} 
            onClick={() => router.push('/admin/users')}
          >
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
        
        <button 
          className={styles.delete} 
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Deleting...' : 'Delete User'}
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
              style={{ border: validationErrors.firstName ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.lastName ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.username ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.email ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.birthday ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.phoneNumber ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.addressOne ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.city ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.state ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.zipCode ? '1.6px solid red' : '' }}
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
              style={{ border: validationErrors.country ? '1.6px solid red' : '' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;