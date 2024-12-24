"use client";
import HeadElement from '../components/HeadElement';
import LoginForm from '../components/LoginForm';
import { useState, createContext } from 'react';
import { isSignedIn } from '@/util/utilFuncs';

export const loginContext = createContext<any>({
  loginFormState: false,
  toggleLoginForm: () => {},
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loginFormState, toggleLoginForm] = useState(false);

  const renderLoginForm = () => {
    if (loginFormState && !isSignedIn()) {
      return <LoginForm toggleLoginForm={toggleLoginForm} loginFormState={loginFormState} />;
    }
    return null;
  };

  return (
    <loginContext.Provider value={{ loginFormState, toggleLoginForm }}>
      <div>
        <HeadElement toggleLoginForm={toggleLoginForm} />
        {renderLoginForm()}
        {children}
      </div>
    </loginContext.Provider>
  );
}