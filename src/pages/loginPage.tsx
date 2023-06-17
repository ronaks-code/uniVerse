import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../components/firebase';
import Error from '../components/firebase.FirebaseError';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Sign in with the provided username and password
      await signInWithEmailAndPassword(auth, username, password);
      alert('Sign-in successful!');
      // Continue with your application logic after successful sign-in
    } catch (signInError) {
      // If sign-in fails, create a new user with the provided username and password
      try {
        await createUserWithEmailAndPassword(auth, username, password);
        alert('Sign-up successful!');
        // Continue with your application logic after successful sign-up
      } catch (signUpError: Error | firebase.FirebaseError) {
        alert('Error: ' + signUpError.message);
      }
    }
  };
  

  return (
    <div className="App">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={username} onChange={handleUsernameChange} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;
