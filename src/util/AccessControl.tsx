"use client"
import React from "react"
//import { Navigate } from "react-router-dom";
class cookieUtils {
    //See backend for why there are "fake" cookies
    hasAccessToken() {
        if (document.cookie.includes("accessTokenExists")) {
            return true;
        }
        else return false;
    }

    hasRefreshToken() {
        if (typeof document !== 'undefined') {
            if (document.cookie.includes("refreshTokenExists")) {
                return true;
            }
            else {
                console.log("cookie doesnt exist" + document.cookie)
                return false;
            }
        }

    }
}

/*export const AccessControl = ({ child }: { child: React.ReactElement }) => {
    const cookieFuncs = new cookieUtils()
    if (cookieFuncs.hasRefreshToken()) {

        return child
    }
    else {
        //return <Navigate replace to="/login" />
        console.log("nextjs's equivalent of navigate to login")
    }
}*/

export default cookieUtils