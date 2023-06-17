//Make a scheduler page for me that takes in an input from the loginpage of the school name and then displays the schedule for that school

import React, { useState } from 'react';
import './App.css';
import { Link } from 'react-router-dom';

function Scheduler() {
    const [school, setSchool] = useState('');
    
    const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSchool(e.target.value);
    }
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert(`School: ${school}`);
    }
    
    return (
        <div className="App">
        <h1>Scheduler Page</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="school">School</label>
            <input type="text" id="school" value={school} onChange={handleSchoolChange} />
            <button type="submit">Submit</button>
        </form>
        <Link to="/loginPage">Login Page</Link>
        </div>
    );
    }

export default Scheduler;

