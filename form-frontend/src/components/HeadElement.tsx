"use client";

import React, { useEffect, useState } from "react";
import cookieUtils from "../util/AccessControl";
import styles from "../css/Head.module.css";
import { isSignedIn, protocol } from "../util/utilFuncs";
import Link from "next/link";

const cookieFuncs = new cookieUtils();

export const verifyLogin = (e: any, toggleLogin: any) => {
    if (isSignedIn()) {
        return true;
    }
    e.preventDefault();
    toggleLogin(true);
    return false;
};

const HeadElement = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    let id = 1;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // Used to prevent server-side rendering for sign in/out buttons, which causes "hydration" mismatch
        setIsClient(true);
    }, []);

    const renderLoginButton = () => {
        if (!cookieFuncs.hasRefreshToken() && isClient) {
            return (
                <input
                    type="button"
                    className={`${styles.head_item} ${styles.head_button}`}
                    id={styles.signin_button}
                    key="signin-button"
                    aria-label="sign in"
                    value="Log In"
                    onClick={() => {
                        props.toggleLoginForm(true);
                    }}
                />
            );
        }
    };

    const renderSignoutButton = () => {
        if (cookieFuncs.hasRefreshToken() && isClient) {
            return (
                <input
                    type="button"
                    className={`${styles.head_item} ${styles.head_button}`}
                    id={styles.signout_button}
                    key="signout-button"
                    aria-label="sign out"
                    value="Sign Out"
                    onClick={signOut}
                />
            );
        }
    };

    const signOut = async () => {
        const res = await fetch(`${protocol}://${window.location.hostname}:3003/users/signout`, {
            method: "GET",
            credentials: "include",
        });

        console.log(res.status);
        if (res.status === 200) {
            console.log("Signed Out");
            window.location.reload();
        } else {
            console.log("Error Signing Out");
        }
    };
    
    return (
        <div id={styles.head_parent}>
            <header id={styles.head}>
                <div className={styles.head_item} id={styles.logo}>
                    <Link
                        id={styles.logo_anchor}
                        href="/"
                        aria-label="Go to homepage"
                        className={styles.anchor}
                    >
                        <span />
                    </Link>
                </div>
                <div
                    className={`${styles.head_item} ${styles.dropdown}`}
                    id={styles.communities_dropdown}
                    hidden
                >
                    -communities dropdown-
                </div>
                {renderLoginButton()}
                {renderSignoutButton()}
            </header>
        </div>
    );
};

export default HeadElement;
