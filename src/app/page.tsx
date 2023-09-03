"use client"
import styles from '../css/page.module.css'
import Sidebar from '../components/sidebar';
import { useState } from 'react';
import FormElement from '../components/formElement'
export default function Home() {

  const [formElements, setformElements] = useState<Array<any>>([]);


  const dropzone = (e: React.DragEvent<HTMLElement>) => {
   
    e.preventDefault()
    const target = e.target as HTMLElement
    const parentId = Number(target.parentElement?.id)
    const parentIndex = formElements.findIndex((e) => e.props.id == parentId)
    const newElement = <FormElement id={formElements.length} key={formElements.length} />

    if (target.className.includes("upperbound")) {
      formElements.splice(parentIndex, 0, newElement)
      setformElements([...formElements])
    } 
    
    else if (target.className.includes("lowerbound")) {
      formElements.splice(parentIndex + 1, 0, newElement)
      setformElements([...formElements])
    }
    
    else {
      const data = e.dataTransfer.getData("text/plain");
      console.log(data)
      setformElements(formElements.concat([newElement]))
    }
  }



  return (
    <main className={styles.main}>
      <section className={styles.formWrapper} onDragOver={(e) => { e.preventDefault() }} onDrop={dropzone}>
        {formElements}
      </section>
      <section className={styles.sidebarWrapper}>
        <Sidebar />
      </section>
    </main>
  )
}
