"use client"
import styles from '@/css/page.module.css';
import Sidebar from '@/components/sidebar';
import FormHead from '@/components/formHead';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import FormElement from '../components/formElement'
import { loginContext } from "./layout";
import { useRouter } from 'next/navigation';
import cookieUtils from '@/util/AccessControl';
import Responses from '@/components/responseBody';
import { useSearchParams } from 'next/navigation';
//import 'drag-drop-touch'
import dynamic from 'next/dynamic'
import BottomSidebar from '@/components/bottomSidebar';
/*
const DynamicComponentWithNoSSR = dynamic(
  () => import('drag-drop-touch'),
  { ssr: false }
)
*/
export type subElementObj = {
  id: number;
  name: string;
}
export type formElementObj = {
  id: string;
  question: string;
  type: 'checkbox' | 'text' | 'select'
  subElements: Array<subElementObj>;
}
export type formObj = {
  id: number;
  title: string;
  formElements: Array<formElementObj>
}
export default function Home() {
  const [savedForms, setSavedForms] = useState<Array<any>>([]);
  const { loginFormState, toggleLoginForm } = useContext(loginContext);
  const [formState, setForm] = useState<formObj>({ id: 0, title: '', formElements: [] });
  const [isClient, setIsClient] = useState(false)
  const cookieFuncs = new cookieUtils();
  //const pageSearchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const pageSearchParams = new URLSearchParams(window.location.search);
    const getForms = async () => {

      const options: RequestInit = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        },
        credentials: "include",
      }

      if (window) {
        const res = await fetch("http" + "://" + window.location.hostname + ":3003/forms/", options);
        if (res.status == 200) {
          const resJSON = await res.json()
          setSavedForms(resJSON)

          //If there's a searchParam for a form that exists, Set it to formState
          if (pageSearchParams.has("form")) {
            console.log(pageSearchParams.get("form"))
            const paramsForm = resJSON.find((form: any) => pageSearchParams.get("form") === form.title)
            if (paramsForm) setForm({ id: paramsForm.id, title: paramsForm.title, formElements: JSON.parse(paramsForm.form) })
          }

        }
      }

    }

    if (document.cookie.includes("refreshTokenExists")) {
      getForms();
    }
    setIsClient(true)
  }, [])
  useEffect(() => {
    if (cookieFuncs.hasRefreshToken()) {
      //pageSearchParams.set("form", formState.title);
      //searchParams.set("section", "build");
      //const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
      //history.pushState(null, '', newRelativePathQuery);

    }
  }, [formState])
  const saveForm = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isClient) {

      e.preventDefault();

      const pageSearchParams = new URLSearchParams(window.location.search);
      if (!document.cookie.includes("refreshTokenExists")) {
        toggleLoginForm(true);
        return;
      }
      const options = {
        method: "POST",
        //credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        },
        credentials: "include",
        body: JSON.stringify(formState)
      }
      //@ts-ignore 
      const resp = await fetch("http" + "://" + window.location.hostname + ":3003/forms/" + formState.id, options);

      if (resp.status == 200) {
        console.log("Created form successfully. 200")
        pageSearchParams.set("form", formState.title)
        const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
        history.pushState(null, '', newRelativePathQuery);

        window.location.reload()
      }
      else {
        toggleLoginForm(true);
        console.error("Internal Server Error: " + resp.status)
      }
    }

  }

  const dropzone = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    const draggedElementId = e.dataTransfer.getData("id")
    if (draggedElementId) {
      const oldElementIndex = formState.formElements.findIndex((element: formElementObj) => element.id == draggedElementId)
      setForm({ ...formState, formElements: formState.formElements.splice(oldElementIndex, 1) })
    }
    const type = e.dataTransfer.getData("type")
    if (type == 'checkbox' || type == 'text' || type == 'select') {
      const newElement: formElementObj = { id: crypto.randomUUID(), question: '', subElements: [], type: type }

      setForm({ ...formState, formElements: formState.formElements.concat([newElement]) })
    }
  }

  //map components instead of storing components in state, so that properties aren't stale
  const renderFormElements = () => {
    console.log(formState.formElements)
    const formComponents = formState.formElements.map((element: formElementObj) => {
      //key={element.id+ formState.id} instead of {element.id}, incase key repeats in two elements
      return <FormElement id={element.id} question={element.question} key={element.id + formState.id} formState={formState} setForm={setForm} subElements={[...element.subElements]} type={element.type} />
    })
    return formComponents
  }

  const renderFormHead = () => {
    if (isClient) {
      if (document.cookie.includes("refreshTokenExists")) {
        return <FormHead toggleLoginForm={toggleLoginForm} savedForms={savedForms} formState={formState} setForm={setForm} />
      }
    }

  }
  const clearForm = () => {
    if (isClient) {

      const pageSearchParams = new URLSearchParams(window.location.search);
      pageSearchParams.set("form", "")
      const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
      history.pushState(null, '', newRelativePathQuery);
      setForm({ id: 0, title: '', formElements: [] })

    }
  }

  //Dom searchParams doesn't work as intended (params don't update), Nextjs useSearch hook works 
  const searchParams = useSearchParams()
  
  const renderBody = () => {
    if (searchParams.get('section') === "responses" && cookieFuncs.hasRefreshToken()) {
      return <Responses formState={formState} />
    }
    else {
      return <form className={styles.main} onSubmit={saveForm}>

        <input type="text" name="" id="" className={styles.formTitle} placeholder='Enter Form Title..' value={formState.title} onChange={(e) => {
          setForm({ ...formState, title: e.target.value })
        }} required />
        <section className={styles.formWrapper} onDragOver={(e) => { e.preventDefault() }} onDrop={dropzone}>
          {renderFormElements()}
        </section>
        <Sidebar saveForm={saveForm} clearForm={clearForm} />

      </form>
    }
  }

  const renderBottomSidebar = () => {
    if (!(searchParams.get('section') === "responses" && cookieFuncs.hasRefreshToken())) {
      return <BottomSidebar saveForm={saveForm} clearForm={clearForm} />
    }
  }
  return (

    <div id={styles.pageWrapper}>
      <script src="DragDropTouch.js"></script>
      
      {renderFormHead()}
      {renderBody()}
      {renderBottomSidebar()}
    </div>
  )
}
