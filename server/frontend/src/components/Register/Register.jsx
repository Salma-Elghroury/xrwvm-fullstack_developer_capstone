import React, { useState } from "react";
import "./Register.css";
import Header from '../Header/Header';
import user_icon from "../assets/person.png"
import email_icon from "../assets/email.png"
import password_icon from "../assets/password.png"
import close_icon from "../assets/close.png"

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");

  // Redirect to home
  const gohome = () => {
    window.location.href = window.location.origin;
  }

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();

    let register_url = window.location.origin + "/djangoapp/register";

    // Send POST request to register endpoint
    const res = await fetch(register_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": userName,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      }),
    });

    const json = await res.json();
    if (json.status) {
      // Save username in session and reload home
      sessionStorage.setItem('username', json.userName);
      window.location.href = window.location.origin;
    }
    else if (json.error === "Already Registered") {
      alert("The user with same username is already registered");
      window.location.href = window.location.origin;
    }
  };

  return (
    <div className="register_page">
      <Header />
      <div className="register_container">
        <div className="register_header">
          <h2 className="form_title">Sign Up</h2>
          <a href="/" onClick={() => { gohome() }} className="close_link" aria-label="Close">
            <img src={close_icon} alt="X" />
          </a>
        </div>

        <form onSubmit={register}>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} className="img_icon" alt='Username' />
              <input type="text" name="username" placeholder="Username" className="input_field" onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className="input">
              <img src={user_icon} className="img_icon" alt='First Name' />
              <input type="text" name="first_name" placeholder="First Name" className="input_field" onChange={(e) => setFirstName(e.target.value)} />
            </div>

            <div className="input">
              <img src={user_icon} className="img_icon" alt='Last Name' />
              <input type="text" name="last_name" placeholder="Last Name" className="input_field" onChange={(e) => setlastName(e.target.value)} />
            </div>

            <div className="input">
              <img src={email_icon} className="img_icon" alt='Email' />
              <input type="email" name="email" placeholder="Email" className="input_field" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="input">
              <img src={password_icon} className="img_icon" alt='Password' />
              <input name="psw" type="password" placeholder="Password" className="input_field" onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="submit_panel">
            <input className="submit action_button" type="submit" value="Register" />
          </div>
          <a className="loginlink" href="/login">Already have an account? Login</a>
        </form>
      </div>
    </div>
  )
}

export default Register;
