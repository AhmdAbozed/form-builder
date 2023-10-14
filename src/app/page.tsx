"use client"
import styles from '../css/page.module.css'
import Sidebar from '../components/sidebar';
import { createContext, useContext, useState } from 'react';
import FormElement from '../components/formElement'
import { loginContext } from "./layout";
export const formContext = createContext<any>({
  formElementsState: false,

  setFormElements: () => { }
})

export type subElementObj = {
  id: Number;
  name: string;
}
export type formElementObj = {
  id: string;
  title: string;
  type: 'checkbox' | 'text' | 'select'
  subElements: Array<subElementObj>;
}
export default function Home() {
  const { loginFormState, toggleLoginForm } = useContext(loginContext);
  const [formElements, setFormElements] = useState<Array<any>>([]);
  const saveForm = async (e: React.MouseEvent<HTMLElement>) => {
    if (!document.cookie.includes("refreshTokenExists")) {
      console.log("NOT LOGGED IN")
      toggleLoginForm(true);
      return;
    }
    const submission = formElements
    const options = {
      method: "POST",
      //credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true'
      },
      credentials: "include",
      body: JSON.stringify(submission)
    }
    //@ts-ignore, following error is fixed by adding object directly, rather than through a variable. 
    const resp = await fetch("http" + "://" + window.location.hostname + ":3003/forms", options);

    if (resp.status == 200) {
      console.log("Created post successfully. 200")
    }
    else if (resp.status == 404 || resp.status == 401 || resp.status == 403) {
      toggleLoginForm(true);
      console.error("Internal Server Error: " + resp.status)
    }
  }

  const dropzone = (e: React.DragEvent<HTMLElement>) => {

    e.preventDefault()
    console.log("parent drop" + formElements.length)


    const draggedElementId = e.dataTransfer.getData("id")
    if (draggedElementId) {
      console.log("oldExists: " + draggedElementId)
      const oldElementIndex = formElements.findIndex((element: formElementObj) => element.id == draggedElementId)
      formElements.splice(oldElementIndex, 1)
    }

    const type = e.dataTransfer.getData("type")
    if (type == 'checkbox' || type == 'text' || type == 'select') {
      const newElement: formElementObj = { id: crypto.randomUUID(), title: '', subElements: [], type: type }
      setFormElements(formElements.concat([newElement]))
      console.log("parent drop end" + formElements.length)
    }
  }

  //map components instead of storing components in state, so that properties aren't stale
  const renderFormELements = () => {
    const formComponents = formElements.map((element: formElementObj) => {
      return <FormElement id={element.id} title={element.title} key={element.id} formElements={formElements} setFormElements={setFormElements} subElements={element.subElements} type={element.type} />
    })
    return formComponents
  }
  return (


    <main className={styles.main}>
      <script src="DragDropTouch.js"></script>
      <section className={styles.formWrapper} onDragOver={(e) => { e.preventDefault() }} onDrop={dropzone}>
        {renderFormELements()}
      </section>

      <Sidebar saveForm={saveForm} />



    </main>
  )
}
