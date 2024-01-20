"use client"
import '../css/globals.css'
import HeadElement from '../components/HeadElement'
import LoginForm from '../components/loginForm'
import { useState, createContext } from 'react'
export const loginContext = createContext<any>({
  loginFormState: false,

  toggleLoginForm: () => { }
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [loginFormState, toggleLoginForm] = useState(false);

  const renderLoginForm = () => {
    if (loginFormState) {
      if (!document.cookie.includes("refreshTokenExists")) return <LoginForm toggleLoginForm={toggleLoginForm} loginFormState={loginFormState} />;
    }
    else return;
  }
  return (
    <html lang="en">

      <body>
        <loginContext.Provider value={{ loginFormState, toggleLoginForm }}>

          <HeadElement toggleLoginForm={toggleLoginForm} />
          {renderLoginForm()}

          {children}

        </loginContext.Provider>

      </body>
    </html>
  )
}
