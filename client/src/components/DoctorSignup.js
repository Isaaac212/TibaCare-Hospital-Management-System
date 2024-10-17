import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

function DoctorSignup() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const passRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    const basicSchema = yup.object().shape({
        title: yup.string().required('Please select a title'),
        doctorId: yup.string().required('Cannot be blank'),
        firstName: yup.string().required('Cannot be blank'),
        lastName: yup.string().required('Cannot be blank'),
        email: yup.string().email('Please enter a valid email').required('Cannot be blank'),
        bio: yup.string(),
        education: yup.string(),
        certifications: yup.string(),
        achievements: yup.string(),
        password: yup.string().min(6).matches(passRules, {
            message: "Password must have at least 6 characters: at least 1 uppercase, 1 lowercase, and 1 number",
        }).required('Cannot be blank'),
        confirmPassword: yup.string().oneOf([yup.ref('password')], "Passwords do not match").required('Cannot be blank'),
    });

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            title: 'Select',
            doctorId: '',
            firstName: '',
            lastName: '',
            email: '',
            bio: '',
            education: '',
            certifications: '',
            achievements: '',
            image: null,
            password: '',
            confirmPassword: ''
        },
        validationSchema: basicSchema,
        onSubmit: async (values, actions) => {
            setLoading(true);
            const formData = new FormData();

            // Append form values to FormData
            Object.keys(values).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, values[key]);
                }
            });
            // Append image if uploaded
            if (values.image) {
                formData.append('image', values.image);
            }

            try {
                const response = await fetch('/doctorsignup', {
                    method: 'POST',
                    body: formData,  // Send FormData (including image)
                });

                if (!response.ok) {
                    throw new Error('Failed to submit the form');
                }

                const data = await response.json();
                setMessage(data.message);
                actions.resetForm();
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        },
    });

    // Show response message for a limited time
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <>
        <Navbar />
        <div className="signup">
            <h1>Signup</h1>
            <form className="signupForm" onSubmit={handleSubmit} encType="multipart/form-data">
                <select name="title" value={values.title} onChange={handleChange}>
                    <option>Select</option>
                    <option>Dr.</option>
                </select>
                <input
                    type="text"
                    name="doctorId"
                    placeholder="Doctor ID"
                    value={values.doctorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.doctorId && touched.doctorId ? "inputError" : ""}
                />
                {errors.doctorId && touched.doctorId && <p className="errors">{errors.doctorId}</p>}
                
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.firstName && touched.firstName ? "inputError" : ""}
                />
                {errors.firstName && touched.firstName && <p className="errors">{errors.firstName}</p>}
                
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.lastName && touched.lastName ? "inputError" : ""}
                />
                {errors.lastName && touched.lastName && <p className="errors">{errors.lastName}</p>}
                
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email ? "inputError" : ""}
                />
                {errors.email && touched.email && <p className="errors">{errors.email}</p>}
                
                <input
                    type="text"
                    name="bio"
                    placeholder="Enter Bio"
                    value={values.bio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                
                <input
                    type="text"
                    name="education"
                    placeholder="Education"
                    value={values.education}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                
                <input
                    type="text"
                    name="certifications"
                    placeholder="Certifications"
                    value={values.certifications}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                
                <input
                    type="text"
                    name="achievements"
                    placeholder="Achievements"
                    value={values.achievements}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                
                <input
                    type="file"
                    name="image"
                    onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                    onBlur={handleBlur}
                />
                
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password && touched.password ? "inputError" : ""}
                />
                {errors.password && touched.password && <p className="errors">{errors.password}</p>}
                
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword && touched.confirmPassword ? "inputError" : ""}
                />
                {errors.confirmPassword && touched.confirmPassword && <p className="errors">{errors.confirmPassword}</p>}
                
                <div className="signupButtons">
                    <button disabled={loading} type="submit">
                        {loading ? 'Submitting...' : 'SIGNUP'}
                    </button>
                    <Link to="/login" className="hero-link">
                        <button type="button" className="cancelbtn">CANCEL</button>
                    </Link>
                </div>
            </form>
            {message && <p className="responseMessage">{message}</p>}
        </div>
        </>
    );
}

export default DoctorSignup;