import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import InputControl from '../InputControl/InputControl';
import { auth } from '../../Firebase';
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  // Inputs
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState('');
  const [show, setshow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        await updateProfile(user, {
          displayName: values.name,
        });
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };
  const onSignInSubmit = () => {
    onCaptchaVerify();
    const phoneNumber = mynumber;
    const appVerifier = window.recaptchaVerifier;
    setshow(true);
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("OTP Sent Successfully.");
        otp(true);
      })
      .catch((error) => {
        // Error; SMS not sent
      });
  };

  const onCaptchaVerify = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      },
      auth
    );
  };
  const onfinal = () => {
    alert('Otp verification Successful');
  }
  return (
    <>
    <header className='header'>
      <span><h1>Bill</h1><h1 className='bl'>Splitter</h1></span>
    </header>
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Signup</h1>
        <InputControl
          label="Name"
          placeholder="Enter your name"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <InputControl
          label="Email"
          placeholder="Enter email address"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <InputControl
          label="Password"
          type="password"
          placeholder="Enter password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
        />
        <div>
            <div>
                <InputControl 
                label="Phone Number"
                value={mynumber}
                onChange={(e) => {setnumber(e.target.value) }}
                placeholder="Enter Phone number"
                />
                <div id="recaptcha-container"></div>
                <button onClick={onSignInSubmit} className={styles.otp}>Send OTP</button>
                </div>
                <div style={{ display: show ? "block" : "none" }}>
                    <InputControl
                     type="text"
                     placeholder={"Enter your OTP"}
                     onChange={(e) => {setotp(e.target.value) }}
                     autoComplete="one-time-code"
                     pattern="\d{6}"
                    ></InputControl>
                    <button onClick={onCaptchaVerify} onClickCapture={onfinal} className={styles.otp}>Verify</button>
                </div>
        </div>
        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            Signup
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Signup;