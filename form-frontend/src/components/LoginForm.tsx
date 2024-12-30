import React, { useState } from "react";
import styles from "./../css/LoginForm.module.css";

const protocol = "http";

const LoginForm = (props: {
  toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
  loginFormState: boolean;
}) => {
  const [formState, setForm] = useState<"" | "login" | "emailSignup" | "signup" | "emailVerification">("login");
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    password: "",
    email: "",
  });

  const resetErrors = () => {
    setErrorMessages({ username: "", password: "", email: "" });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as any;
    const submission = {
      Username: target.elements.username.value,
      Password: target.elements.password.value,
      Email: target.id === "signup-form" ? target.elements.email.value : "",
    };
    const regex = /^\w{4,20}$/;
    const userValidation = regex.test(submission.Username);
    const passValidation = regex.test(submission.Password);

    let endpoint = target.id === "signin-form" ? "users/signin" : "users/signup";

    if (userValidation && passValidation) {
      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
        },
        credentials: "include",
        body: JSON.stringify(submission),
      };

      const res = await fetch(`${protocol}://${window.location.hostname}:3003/${endpoint}`, options);
      const resJSON = await res.json();

      if (res.status === 200) {
        if (formState === "signup") {
          window.location.reload();
        } else {
          window.location.reload();
        }
      } else {
        setErrorMessages({ ...errorMessages, username: resJSON });
      }
    } else {
      setErrorMessages({
        username: !userValidation ? "Username must be 4-20 non-special characters" : "",
        password: !passValidation ? "Password must be 4-20 non-special characters" : "",
        email: "",
      });
    }
  };

  const testAccountSignup = async () => {
    const submission = {
      Username: Math.floor(100000 + Math.random() * 900000),
      Password: Math.floor(100000 + Math.random() * 900000),
      Email: Math.floor(100000 + Math.random() * 900000) + '@mail.com',
    };


    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
      },
      credentials: "include",
      body: JSON.stringify(submission),
    };

    const res = await fetch(`${protocol}://${window.location.hostname}:3003/users/signup/`, options);
    const resJSON = await res.json();

    if (res.status === 200) {

      window.location.reload();

    }
  }


  const renderFormContent = () => {
    const renderLogIn = () => (
      <form className={styles.userForm} id="signin-form" onSubmit={submitForm}>
        <section className={styles.loginBody}>
          <button type="button" className={styles.signinCancel} onClick={() => props.toggleLoginForm(false)} />
          <div className={styles.signinInfo}>
            <h2>Log In</h2>
            <p>
              By continuing, you agree to our <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>

          <div className={styles.containerInput}>
            <input type="text" name="username" className={styles.signinInputs} />
            <label htmlFor="username" className={styles.customPlaceholder}>
              Username
            </label>
          </div>
          {errorMessages.username && <div className={styles.invalidPrompt}>{errorMessages.username}</div>}

          <div className={styles.containerInput}>
            <input type="password" name="password" className={styles.signinInputs} />
            <label htmlFor="password" className={styles.customPlaceholder}>
              Password
            </label>
          </div>
          {errorMessages.password && <div className={styles.invalidPrompt}>{errorMessages.password}</div>}

          <input type="submit" value="Log In" className={styles.signinSubmit} />
          <button type="button" value="Guest Account" className={styles.signinSubmit} onClick={testAccountSignup}>Guest Account</button>
          <div className={styles.signupPrompt}>
            New to Form Builder?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); resetErrors(); setForm("signup") }}>
              Sign up
            </a>
          </div>
        </section>
      </form>
    );

    const renderSignUp = () => (
      <form className={styles.userForm} id="signup-form" onSubmit={submitForm}>
        <div className={styles.loginBody}>
          <button type="button" className={styles.signinCancel} onClick={() => props.toggleLoginForm(false)} />
          <div className={styles.signinInfo}>
            <h2>Sign Up</h2>
            <p>
              By creating an account, you agree to our <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>

          <div className={styles.containerInput}>
            <input type="text" name="email" className={styles.signinInputs} />
            <label htmlFor="email" className={styles.customPlaceholder}>
              Email
            </label>
          </div>
          {errorMessages.email && <div className={styles.invalidPrompt}>{errorMessages.email}</div>}

          <div className={styles.containerInput}>
            <input type="text" name="username" className={styles.signinInputs} />
            <label htmlFor="username" className={styles.customPlaceholder}>
              Username
            </label>
          </div>
          {errorMessages.username && <div className={styles.invalidPrompt}>{errorMessages.username}</div>}

          <div className={styles.containerInput}>
            <input type="password" name="password" className={styles.signinInputs} />
            <label htmlFor="password" className={styles.customPlaceholder}>
              Password
            </label>
          </div>
          {errorMessages.password && <div className={styles.invalidPrompt}>{errorMessages.password}</div>}

          <input type="submit" value="Sign Up" className={styles.signinSubmit} />
          <div className={styles.signupPrompt}>
            Already a User?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); resetErrors(); setForm("login") }}>
              Log In
            </a>
          </div>
        </div>
      </form>
    );

    switch (formState) {
      case "login":
        return renderLogIn();
      case "signup":
        return renderSignUp();
      default:
        return null;
    }
  };

  return (
    <div className={styles.signinComponent}>
      <div className={styles.darkBackground} />
      {renderFormContent()}
    </div>
  );
};

export default LoginForm;