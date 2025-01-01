"use client";
import HeadElement from '../components/HeadElement';
import LoginForm from '../components/LoginForm';
import { useState, createContext } from 'react';
import { isSignedIn } from '@/util/utilFuncs';
import styles from '@/css/footer.module.css'
export const loginContext = createContext<any>({
  loginFormState: false,
  toggleLoginForm: () => { },
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
      <div className={styles.mainWrapper}>
        <HeadElement toggleLoginForm={toggleLoginForm} />
        {renderLoginForm()}
        {children}
        <footer className={styles.footer}> 
          <a href="https://github.com/AhmdAbozed" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            <div className={styles.githubLogo} />
          </a>
          <a href="https://www.linkedin.com/in/ahmed-hassan-abozed-6271b223a/" target="_blank" rel="noopener noreferrer" className={styles.githubLink}>
            <div  className={styles.linkedinLogo} />
          </a>
          <p className={styles.rights}>© Ahmed Hassan. All rights reserved.</p>
        </footer>
      </div>
    </loginContext.Provider>
  );
}