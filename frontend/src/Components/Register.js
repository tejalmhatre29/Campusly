import React, { useState } from 'react';
import API from '../api';

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
        <div>
            <h2>Create Campusly Account</h2>

            <form onSubmit={handleRegister}>
                <input name="username" placeholder="Username" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <input name="first_name" placeholder="First Name" onChange={handleChange} />
                <input name="last_name" placeholder="Last Name" onChange={handleChange} />
                <input name="department" placeholder="Department" onChange={handleChange} />
                <input name="year" placeholder="Year" onChange={handleChange} />
                <input name="division" placeholder="Division" onChange={handleChange} />
                <input name="phone_number" placeholder="Phone Number" onChange={handleChange} />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;