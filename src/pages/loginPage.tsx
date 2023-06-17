import React, { useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../components/firebase';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Sign in with the provided email and password
      await signInWithEmailAndPassword(auth, email, password);
      alert('Sign-in successful!');
      // Redirect or render different component
        
    } catch (signInError) {
      // If sign-in fails, create a new user with the provided email and password
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Sign-up successful!');
        // Redirect or render different component
          
      } catch (signUpError: unknown) {
        if (signUpError instanceof Error) {
          // Handle Firebase errors
          const errorCode = (signUpError as any).code;
          if (errorCode === 'auth/user-not-found') {
            alert('There is no user corresponding to the given email.');
          } else if (errorCode === 'auth/wrong-password') {
            alert('Wrong password is provided.');
          } else {
            alert('Error: ' + signUpError.message);
          }
        } else {
          // Handle any other unexpected errors
          alert('An unexpected error occurred');
        }
      }
    }
  };

  // Check if user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        //// User is signed in, redirect or render different component
        console.log('User is already signed in');
        // Redirect to another page or update state accordingly
      }
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="App">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;
