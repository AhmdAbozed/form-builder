//Component from an older project, needs refactoring as it manipulates DOM directly
import React, { useState, useEffect } from "react";
import "./../css/LoginForm.css"
const protocol = "http";

const LoginForm = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    loginFormState: boolean;
}) => {
    const [formState, setForm] = useState<"" | "login" | "emailSignup" | "signup" | "emailVerification">("login");
    const resetErrors = () => {
        document.getElementById("invalid-username-prompt")!.hidden = true;
        document.getElementById("input-username")?.classList.remove("invalid-input")
        document.getElementById("invalid-password-prompt")!.hidden = true;
        document.getElementById("input-password")?.classList.remove("invalid-input")
    }

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as any
        const submission = { Username: target.elements.username.value, Password: target.elements.password.value, Email: target.elements.email.value }
        const regex = /^\w{4,20}$/
        const userValidation = regex.exec(submission.Username)
        const passValidation = regex.exec(submission.Password)

        let endpoint;
        console.log(target.id)
        if (target.id == "signin-form") { endpoint = "users/signin" }
        else { endpoint = "users/signup" }

        if (userValidation && passValidation) {
            const options: RequestInit = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Credentials': 'true'
                },
                credentials: "include",

                body: JSON.stringify(submission)
            }
            const res = await fetch(protocol + "://" + window.location.hostname + ":3003/" + endpoint, options);
            console.log(res)

            const resJSON = await res.json()
            console.log("resJSON" + resJSON)

            if (res.status == 200) {
                document.getElementById("result")!.innerHTML = ""
                if (formState == "signup") {
                    //setForm("emailVerification")
                    window.location.reload()
                } else {
                    window.location.reload()
                }

            }
            else {
                console.log("invalid credentials")
                document.getElementById("invalid-username-prompt")!.hidden = false;
                document.getElementById("invalid-username-prompt")!.innerHTML = resJSON as string;
            }
            return res;
        }
        else {
            if (!userValidation) {
                document.getElementById("invalid-username-prompt")!.hidden = false;
                document.getElementById("invalid-username-prompt")!.innerHTML = "Username must be 4-20 non-special characters"
                document.getElementById("input-username")?.classList.add("invalid-input")
            } else {
                document.getElementById("invalid-username-prompt")!.hidden = true;
                document.getElementById("input-username")?.classList.remove("invalid-input")

            }
            if (!passValidation) {
                document.getElementById("invalid-password-prompt")!.hidden = false;
                document.getElementById("input-password")?.classList.add("invalid-input")
            } else {
                document.getElementById("invalid-password-prompt")!.hidden = true;
                document.getElementById("input-password")?.classList.remove("invalid-input")

            }
        }

    }

    const submitEmailCode = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as any
        const submission = { mailCode: target.elements.code.value }

        const options: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            credentials: "include",
            body: JSON.stringify(submission)
        }
        const res = await fetch(protocol + "://" + window.location.hostname + ":3003/users/verifyemail", options);
        console.log(res.status)

        console.log("res" + res)

        if (res.status == 200) {
            document.getElementById("result")!.innerHTML = ""
        }
        else {
            console.log("invalid code: " + res.status)

        }
        return res;
    }

    const resendEmailCode = async () => {
        const options: RequestInit = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': 'true'
            },
            credentials: "include"
        }
        const res = await fetch(protocol + "://" + window.location.hostname + ":3003/users/sendemailcode", options);
        console.log(res.status)

        console.log("res" + res)

        if (res.status == 200) {
            document.getElementById("result")!.innerHTML = ""
        }
        else {
            console.log("invalid code: " + res.status)

        }
    }

    const formHandler = () => {

        const renderLogIn = () => {
            return <form className="user-form" id="signin-form" onSubmit={submitForm}>
                <section id="login-body">
                    <input type="button" id="signin-cancel" onClick={() => { props.toggleLoginForm(false) }} />

                    <div id="signin-info">
                        <h2>Log In</h2>
                        <p>By continuing, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                    </div>

                    <div className="container-input">
                        <input key="1" type="text" name="username" className="signin-inputs" id="input-username" required />
                        <label
                            htmlFor="input-username"
                            className="custom-placeholder"
                            id="custom-placeholder-username"
                            onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}
                        >Username</label>
                    </div>

                    <div className="container-input">
                        <input type="password" name="password" className="signin-inputs" id="input-password" required />
                        <label
                            htmlFor="input-password"
                            className="custom-placeholder"
                            id="custom-placeholder-password"
                            onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}
                        >Password</label>
                    </div>

                    <div id="invalid-prompts-container">
                        <div id="invalid-username-prompt" className="invalid-prompt" hidden>Username must be 4-20 non-special characters</div>
                        <div id="invalid-password-prompt" className="invalid-prompt" hidden>Password must be 4-20 non-special characters</div>
                    </div>

                    <input type="submit" value="Log In" id="signin-submit" aria-label="signin submit" />
                    <div id="signup-prompt" >New to Form Builder? <a href="" aria-label="sign up" onClick={(e) => { e.preventDefault(); resetErrors(); setForm("signup") }}>Sign up</a></div>
                    <div data-testid="result" id="result">

                    </div>
                </section>
            </form>
        }

        const renderSignUp = () => {
            return <form className="user-form" id="signup-form" onSubmit={submitForm}>
                <div id="login-body">
                    <input type="button" id="signin-cancel" onClick={() => { props.toggleLoginForm(false) }} />

                    <div id="signin-info">
                        <h2>Sign Up</h2>
                        <p>By creating an account, you agree to our <a href="">User Agreement</a> and <a href="">Privacy Policy</a>.</p>
                    </div>

                    <div className="container-input">
                        <input type="text" className="signin-inputs" id="input-email" name="email" required  onBlur={(e) => {
                        e.preventDefault();
                        const emailRegex = /^(\w+)\@\w+.com$/
                        const validation = emailRegex.exec((document.getElementById("input-email") as HTMLInputElement).value)
                        console.log(validation)
                        if (validation) {
                            document.getElementById("invalid-email-prompt")!.hidden = true;

                        }else{
                            document.getElementById("invalid-email-prompt")!.hidden = false;

                        }
                    }
                    }/>
                        <label htmlFor="input-email" className="custom-placeholder" id="custom-placeholder-email" onClick={() => { console.log("clicked"); document.getElementById("input-email")?.focus() }}>Email</label>
                        <div id="invalid-email-prompt" className="invalid-prompt" hidden>Invalid Email.</div>

                    </div>
                   
                    <div className="container-input">
                        <input key="3" type="text" className="signin-inputs" id="input-username" name="username" required />
                        <label htmlFor="input-username" className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>Username</label>
                    </div>

                    <div className="container-input">
                        <input key="4" type="password" className="signin-inputs" id="input-password" name="password" required />
                        <label htmlFor="input-password" className="custom-placeholder" id="custom-placeholder-password" onClick={() => { console.log("clicked"); document.getElementById("input-password")?.focus() }}>Password</label>
                    </div>
                    <div id="invalid-prompts-container">
                        <div id="invalid-username-prompt" className="invalid-prompt" hidden>Username must be 4-20 non-special characters</div>
                        <div id="invalid-password-prompt" className="invalid-prompt" hidden>Password must be 4-20 non-special characters</div>
                    </div>
                    <input type="submit" value="Sign Up" id="signin-submit" aria-label="signup submit" />
                    <div id="signup-prompt">Already a User? <a href="" onClick={(e) => { e.preventDefault(); resetErrors(); setForm("login") }}>Log In</a></div>
                    <div data-testid="result" id="result">

                    </div>
                </div>
            </form>

        }
        const renderEmailVerification = () => {
            return <form className="user-form" id="signup-form" onSubmit={submitEmailCode}>
                <div id="login-body">
                    <input type="button" id="signin-cancel" onClick={() => { props.toggleLoginForm(false) }} />

                    <div id="signin-info">
                        <h2>Verify Email</h2>
                        <p>A 4-digits code has been sent to your Email. Enter the code to verify it</p>
                    </div>

                    <div className="container-input">
                        <input key="3" type="text" className="signin-inputs" id="input-code" name="code" required />
                        <label htmlFor="input-code" className="custom-placeholder" id="custom-placeholder-username" onClick={() => { console.log("clicked"); document.getElementById("input-username")?.focus() }}>4-digits Code</label>
                    </div>
                    <input type="submit" value="Verify" id="signin-submit" aria-label="signup submit" />
                    <div id="signup-prompt"><a href="" onClick={async (e) => { e.preventDefault(); await resendEmailCode() }}>Resend Code?</a></div>
                    <div data-testid="result" id="result">

                    </div>
                </div>
            </form>
        }
        switch (formState) {
            case "login": ; return renderLogIn(); break;
            case "signup": return renderSignUp(); break;
            case "emailVerification": return renderEmailVerification()
        }

    }
    return (
        <div id="signin-component">
            <div className="dark-background" />
            {formHandler()}
        </div>

    )
}

export default LoginForm;