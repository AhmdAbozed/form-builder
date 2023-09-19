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
export type subElementObj = {

  id?: Number;
  name?: string;

}

export type formElementObj = {
  id: string;
  type: 'checkbox' | 'text' | 'select'
  subElements: Array<subElementObj>;

}

export default function Home() {

  const [formElements, setFormElements] = useState<Array<any>>([]);

  const dropzone = (e: React.DragEvent<HTMLElement>) => {

    e.preventDefault()
    console.log("parent drop" + formElements.length)
    const type = e.dataTransfer.getData("type")
    if (type == 'checkbox' || type == 'text' || type == 'select') {
      const newElement: formElementObj = { id: crypto.randomUUID(), subElements: [], type: type }
      setFormElements(formElements.concat([newElement]))
      console.log("parent drop end" + formElements.length)
    }
  }

  //map components instead of storing components in state, so that properties(formElements specifically) aren't stale
  const renderFormELements = () => {
    const formComponents = formElements.map((element: formElementObj) => {
      return <FormElement id={element.id} key={element.id} formElements={formElements} setFormElements={setFormElements} subElements={element.subElements} type={element.type} />
    })
    return formComponents
  }

  return (

    <main className={styles.main}>
      <script src="DragDropTouch.js"></script>
      <section className={styles.formWrapper} onDragOver={(e) => { e.preventDefault() }} onDrop={dropzone}>
        {renderFormELements()}
      </section>
      <section className={styles.sidebarWrapper}>
        <Sidebar />
      </section>


    </main>
  )
}
