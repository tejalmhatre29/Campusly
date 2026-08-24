import React, { useState } from 'react';
import API from '../api';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        department: '',
        year: '',
        division: '',
        phone_number: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post('accounts/register/', formData);
            alert('Registration successful!');
        } catch (error) {
            console.log(error.response?.data);
            alert('Registration failed');
        }
    };

    return (
    <div className="register-container">
        <div className="register-card">

            <div className="register-logo">
                Campusly 🎓
            </div>

            <p className="register-subtitle">
                Create your campus account
            </p>

            <form className="register-form" onSubmit={handleRegister}>

                <div className="register-field">
                    <label>Username</label>
                    <input
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-field">
                    <label>First Name</label>
                    <input
                        name="first_name"
                        placeholder="First name"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field">
                    <label>Last Name</label>
                    <input
                        name="last_name"
                        placeholder="Last name"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field">
                    <label>Department</label>
                    <input
                        name="department"
                        placeholder="Computer Engineering"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field">
                    <label>Year</label>
                    <input
                        name="year"
                        placeholder="4th Year"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field">
                    <label>Division</label>
                    <input
                        name="division"
                        placeholder="A"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field">
                    <label>Phone Number</label>
                    <input
                        name="phone_number"
                        placeholder="Phone number"
                        onChange={handleChange}
                    />
                </div>

                <div className="register-field full">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button className="register-button" type="submit">
                    Create Account
                </button>

            </form>

            <p className="register-switch">
                Already have an account?
                <button type="button">
                    Sign in
                </button>
            </p>

        </div>
    </div>
);
}

export default Register;