"use client"
import styles from '@/css/page.module.css';
import Sidebar from '@/components/sidebar';
import FormHead from '@/components/formHead';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import FormElement from '../components/formElement'
import { loginContext } from "./layout";
import cookieUtils from '@/util/AccessControl';
import Responses from '@/components/responseBody';
import { useSearchParams } from 'next/navigation';
//import 'drag-drop-touch'
import BottomSidebar from '@/components/bottomSidebar';
import FormLiveCheckbox from '@/components/FormLiveCheckbox'
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
  form: Array<formElementObj>;
  live: boolean
}
export default function Home() {
  const [savedForms, setSavedForms] = useState<Array<formObj>>([]);
  const { loginFormState, toggleLoginForm } = useContext(loginContext);
  const [formState, setForm] = useState<formObj>({ id: 0, title: '', form: [], live: false });
  const [isClient, setIsClient] = useState(false)

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
          console.log("testingf a res", res)
          const resJSON = await res.json()

          console.log("testingf a resJSON", resJSON)
          setSavedForms(resJSON)

          //If there's a searchParam for a form that exists, Set it to formState
          if (pageSearchParams.has("form")) {
            console.log(pageSearchParams.get("form"))
            const paramsForm = resJSON.find((form: any) => pageSearchParams.get("form") === form.title)
            if (paramsForm) setForm({ id: paramsForm.id, title: paramsForm.title, form: JSON.parse(paramsForm.form), live: paramsForm.live })
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
    console.log('new formstate!!', formState)
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
      const response = await fetch("http" + "://" + window.location.hostname + ":3003/forms/" + formState.id, options);

      if (response.status == 200) {
        console.log("Created form successfully. 200")
        pageSearchParams.set("form", formState.title)
        const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
        console.log(response)
        const newElement = await response.json()
        console.log(newElement)
        const oldElementIndex = savedForms.findIndex((element: formObj) => element.id == newElement.id)
        const newSavedForms = [...savedForms]
        if (oldElementIndex > -1) {
          newSavedForms.splice(oldElementIndex, 1, newElement)
        } else {
          newSavedForms.push(newElement)
        }
        setSavedForms(newSavedForms)

        //window.location.reload()
      }
      else {
        toggleLoginForm(true);
        console.error("Internal Server Error: " + response.status)
      }
    }

  }
  const postLiveUpdate = async (form: formObj, liveState: boolean) => {
    form.live = liveState;
    const options = {
      method: "POST",
      //credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      },
      credentials: "include",
      body: JSON.stringify(form)
    }
    //@ts-ignore 
    const response = await fetch("http" + "://" + window.location.hostname + ":3003/forms/" + form.id, options);

    if (response.status == 200) {
      return true
    } else return false;
  }
  const dropzone = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    const draggedElementId = e.dataTransfer.getData("id")
    const newForm = { ...formState };
    if (draggedElementId) {
      const oldElementIndex = formState.form.findIndex((element: formElementObj) => element.id == draggedElementId)
      newForm.form.splice(oldElementIndex, 1)
    }
    const type = e.dataTransfer.getData("type")
    if (type == 'checkbox' || type == 'text' || type == 'select') {
      const newElement: formElementObj = { id: crypto.randomUUID(), question: '', subElements: [], type: type }
      newForm.form.push(newElement)
      setForm(newForm)
    }
  }

  const changeLive = async (liveState: boolean) => {
    const updatedForm = await postLiveUpdate(formState, liveState);
    if (updatedForm) {
      const ElementIndex = savedForms.findIndex((element: formObj) => element.id == formState.id)
      const newSavedForms = [...savedForms]
      newSavedForms[ElementIndex].live = liveState
      formState.live = liveState;
      setSavedForms(newSavedForms);
      console.log('inside change live', newSavedForms[ElementIndex])
      setForm({ ...formState });
    }
  }
  //map components instead of storing components in state, so that properties aren't stale
  const renderFormElements = () => {
    console.log(formState)
    const formComponents = formState.form.map((element: formElementObj) => {
      //key={element.id+ formState.id} instead of {element.id}, incase key repeats in two elements
      return <FormElement id={element.id} question={element.question} key={element.id + formState.id} formState={formState} setForm={setForm} subElements={[...element.subElements]} type={element.type} />
    })
    return formComponents
  }

  const renderFormHead = () => {
    if (isClient) {
      if (document.cookie.includes("refreshTokenExists")) {
        console.log('about to render head', savedForms)
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
      setForm({ id: 0, title: '', form: [], live: false })

    }
  }

  //Dom searchParams doesn't work as intended (params don't update), Nextjs useSearch hook works 
  const searchParams = useSearchParams()

  const renderBody = () => {
    if (searchParams.get('section') === "responses") {
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
        <FormLiveCheckbox formState={formState} isLive={formState.live} changeLive={changeLive} mobile={true}></FormLiveCheckbox>
        <Sidebar formState={formState} saveForm={saveForm} clearForm={clearForm} isLive={formState.live} changeLive={changeLive} />

      </form>
    }
  }



  const renderBottomSidebar = () => {
    if (!(searchParams.get('section') === "responses")) {
      return <BottomSidebar saveForm={saveForm} clearForm={clearForm} />
    }
  }
  return (

    <div id={styles.pageWrapper}>
      <script src="DragDropTouch.js" async></script>

      {renderFormHead()}
      {renderBody()}
      {renderBottomSidebar()}
    </div>
  )
}
