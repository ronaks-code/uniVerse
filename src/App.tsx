import React from 'react';
import LoginPage from './pages/loginPage';
import './App.css';
import { db } from './components/firebase';
import { uid } from 'uid';
import { set, ref } from 'firebase/database';

function App() {

  // write
  const writeToDatabase = () => {
    const uuid = uid()
    set(ref(db, `/${uuid}`), {
      username: 'test',
      password: 'test'
    });
  }
  // read
  // update
  // delete
  return (
    <div>
      <input type="text" />
      <button>submit</button>
      <LoginPage />
    </div>
  );
}

export default App;
