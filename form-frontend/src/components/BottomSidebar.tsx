"use client"
import { formObj } from '@/pages'
import styles from '../css/bottomSidebar.module.css'
import '../css/util/customCheckbox.module.css'
import { useEffect, useState } from 'react'
const BottomSidebar = (props: { formState: formObj, saveForm: any, clearForm: any }) => {
  const [isClient, setIsClient] = useState(false)
  const [inputsFlagState, setInputsFlag] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const dragFunc = (e: any, type: 'checkbox' | 'select' | 'text') => {
    console.log(e)
    //On android a polyfill catches the ontouch and binds drag api to it but throws dataTransfer is undefined anyway on client-side
    e.dataTransfer.setData("text/plain", JSON.stringify([]));
    e.dataTransfer.setData("type", type);
    e.dataTransfer.dropEffect = "copy";
  }

  const renderSaveBtn = () => {
    if (isClient && props.formState.id) {
      return <input type="submit" value="SAVE CHANGES" className={styles.sidebarButton} id={styles.saveBtn} onClick={e=>{
        if(props.formState.title)props.saveForm(true)
      }}/>
    }
    else return <input type="submit" value="SAVE FORM" className={styles.sidebarButton} id={styles.saveBtn} onClick={e=>{
      if(props.formState.title)props.saveForm(false);
    }} />
  }
  
  const renderSidebarInputs = () => {
    if (inputsFlagState) {
      return <section id={styles.draggablesBody}>
        <div id={styles.sidebarHead}>DRAG FROM HERE</div>
        <div id={styles.sidebarInputs}>
          <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'text')} onTouchStart={(e) => dragFunc(e, 'text')}>Text Question</div>
          <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'checkbox')} onTouchStart={(e) => dragFunc(e, 'checkbox')}>Multiple Choices</div>
          <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'select')} onTouchStart={(e) => dragFunc(e, 'select')}>Dropdown</div>
        </div>

      </section>

    }
  }
  return (
    <section id={styles.wrapper}>
      <button type="button" className={styles.sidebarButton} id={styles.elementsBtn} onClick={()=>{inputsFlagState ? setInputsFlag(false) : setInputsFlag(true)}}>ADD INPUT</button>
      {renderSaveBtn()}
      <button type="button" className={styles.sidebarButton} id={styles.deleteBtn} onClick={(e: any) => { props.clearForm(); e.target.blur()}}>CLEAR FORM</button>
      {renderSidebarInputs()}
    </section>
  )
}

export default BottomSidebar