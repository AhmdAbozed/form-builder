"use client"
//import { useParams } from "react-router-dom"
import React, { useEffect, useState } from "react"
import cookieUtils from "../util/AccessControl";
import "./../css/Head.css"
import { protocol } from "../util/utilFuncs";
const cookieFuncs = new cookieUtils();
export const verifyLogin = (e: any, toggleLogin: any) => {
    if (document.cookie.includes("refreshTokenExists")) {
        return true;
    }
    e.preventDefault()
    toggleLogin(true)
    return false;
}

const HeadElement = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    //let { id } = useParams();
    let id = 1;
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        //used to prevent server side rendering for sign in/out buttons, which causes "hydration" mismatch
        setIsClient(true)
    }, [])

    const renderLoginButton = () => {

        if (!(cookieFuncs.hasRefreshToken()) && isClient) {
            return <input type="button" className="head-item head-button" id="signin-button" key="signin-button" aria-label="sign in" value={"Log In"} onClick={
                () => {
                    props.toggleLoginForm(true)
                }
            } />
        }

    }

    const renderSignoutButton = () => {

        if (cookieFuncs.hasRefreshToken() && isClient) {
            return <input type="button" className="head-item head-button" id="signin-button" key="signout-button" aria-label="sign out" value={"Sign Out"} onClick={signOut} />
        }

    }
    const signOut = async () => {
        //const options = 
        const res = await fetch(protocol + "://" + window.location.hostname + ":3003/users/signout", {
            method: "GET",

            credentials: "include"
        });

        console.log(res.status)
        if (res.status == 200) {
            console.log("Signed Out")
            window.location.reload()
        }
        else {
            console.log("Si")
        }
    }

    return (
        <div id="head-parent">
            <header id="head">
                <div className="head-item" id="logo"><a href="/" aria-label="Go to homepage" className="anchor"><span /></a></div>
                <div className="head-item dropdown" id="communities-dropdown" hidden>-communities dropdown-</div>
                {renderLoginButton()}
                {renderSignoutButton()}

            </header>
        </div>
    )
}

export default HeadElement