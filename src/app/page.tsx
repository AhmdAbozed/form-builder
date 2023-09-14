"use client"
import styles from '../css/page.module.css'
import Sidebar from '../components/sidebar';
import { useState } from 'react';
import FormElement from '../components/formElement'

//without any I get Dispatch<Setstate...> at toggle. Use an interface with boolean and dispatch also works
/*export const draggingContext = createContext<any>({
  draggingState: false,

  toggleDragging: () => { }
})
*/
export default function Home() {

  const [draggingState, toggleDragging] = useState(false);
  const [formElements, setFormElements] = useState<Array<any>>([]);


  const dropzone = (e: React.DragEvent<HTMLElement>) => {

    e.preventDefault()
    console.log("parent drop"+formElements.length)
    const target = e.target as HTMLElement
    const newElement = <FormElement id={formElements.length} key={formElements.length} formElements={formElements} setFormElements={setFormElements} />
    formElements.push(newElement)
    setFormElements([...formElements])
  }



  return (

    <main className={styles.main}>
      <script src="DragDropTouch.js"></script>
      <section className={styles.formWrapper} onDragOver={(e) => { e.preventDefault() }} onDrop={dropzone}>
        {formElements}
      </section>
      <section className={styles.sidebarWrapper}>
        <Sidebar toggleDragging={toggleDragging} />
      </section>


    </main>
  )
}
