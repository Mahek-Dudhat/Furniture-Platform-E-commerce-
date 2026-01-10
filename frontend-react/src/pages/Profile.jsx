import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../api/authservice';


function Profile() {

    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        fullname: '',
        phoneno: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        }
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserProfile();
    }, [user, navigate]);

    const fetchUserProfile = async () => {
        try {
            // Fetch user profile data from API
            const response = await getUserProfile();
            console.log('Fetched user profile:', response);
            if (response.success) {
                setProfileData({
                    fullname: response.user.fullname || '',
                    phoneno: response.user.phoneno || '',
                    address: response.user.address || {
                        street: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        country: ''
                    }
                });
                setPreviewImage(response.user.profilePicture?.url || null);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setMessage({ type: 'error', text: 'Failed to load profile' });
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setProfileData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                }
            }));
        } else {
            setProfileData((prev) => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log("File: ", file);
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
                return;
            }
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await updateUserProfile(profileData);

            if (response.success) {
                setMessage({ type: 'success', text: 'profile updated sucessfully..' });
                setIsEditing(false);
                updateUser(response.user);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setMessage({ type: 'error', text: 'Failed to update profile' });

        } finally {
            setLoading(false);
        }

    }

    const handlePictureUpload = async () => {
        if (!profilePicture) {
            setMessage({ type: 'error', text: 'Please select an image' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        try {
            const response = await uploadProfilePicture(formData);

            if (response.success) {
                setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
                setPreviewImage(response.profilePicture.url);
                setProfilePicture(null);
                // Update user context with new profile picture
                updateUser({ ...user, profilePicture: response.profilePicture });

            } else {
                setMessage({ type: 'error', text: 'Failed to upload profile picture' });
            }
        } catch (err) {
            console.error('Error uploading picture:', err);
            setMessage({ type: 'error', text: 'Failed to upload picture' });
        } finally {
            setLoading(false);
        }
    }

    const getDefaultProfilePicture = () => {
        return 'https://res.cloudinary.com/drk76tu20/image/upload/v1766900739/default-avatar_rzvuws.jpg';
    }

    return (
        <div className='profile-container'>
            <div className="profile-wrapper">
                <h1 className="profile-title">My Profile</h1>

                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-content">
                    {/* Profile Picture Section */}
                    <div className="profile-picture-section">
                        <div className="profile-picture-wrapper">
                            <img src={previewImage || getDefaultProfilePicture()} alt="Profile"
                                className="profile-picture"
                            />
                        </div>

                        <div className="profile-picture-actions">
                            <input type='file' id="profilePicture"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="profilePicture" className="btn-select-image">
                                Choose Photo
                            </label>
                            {
                                profilePicture && (
                                    <button
                                        onClick={handlePictureUpload}
                                        disabled={loading}
                                        className="btn-upload-image"
                                    >
                                        {loading ? 'Uploading...' : 'Upload'}
                                    </button>
                                )
                            }
                        </div>
                        <p className="profile-picture-hint">
                            {user?.googleId ? 'Google profile photo or custom photo' : 'Upload your profile photo'}
                        </p>

                    </div>

                    {/* Profile Information Section */}
                    <div className="profile-info-section">
                        <div className="profile-header">
                            <h2>Personal Information</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-edit"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    value={profileData.fullname}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phoneno"
                                    value={profileData.phoneno}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit phone number"
                                />
                            </div>
                            <div className="address-section">
                                <h3>Address</h3>
                                <div className="form-group">
                                    <label>Street</label>
                                    <input
                                        type="text"
                                        name="address.street"
                                        value={profileData.address.street}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={profileData.address.city}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>State</label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={profileData.address.state}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Zip Code</label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={profileData.address.zipCode}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            name="address.country"
                                            value={profileData.address.country}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                            </div>

                            {
                                isEditing && (
                                    <div className="form-actions">
                                        <button type='submit' disabled={loading} className='btn-save'>{loading ? 'Updating...' : 'Update Profile'}</button>

                                        <button type='button' className='btn-cancel' onClick={() => { setIsEditing(false); fetchUserProfile(); }}>
                                            Cancel
                                        </button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Profile
