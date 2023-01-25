import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from './Components/Signup/Signup';
import { auth , db} from "./Firebase";
import Main from "./Main";
// import Main2 from "./Main2";
import "./App.css";
import "./friends.css";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [userName, setUserName] = useState("");
  // let uid1;
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
        // uid1 = user.uid;
        // console.log(uid1);
      }
      else setUserName("");
    });
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Main" element={<Main/>}/>
          {/* <Route path="/Main2" element={<Main2/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
