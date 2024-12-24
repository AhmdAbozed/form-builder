"use client"
import styles from '../css/sidebar.module.css'
import '../css/util/customCheckbox.module.css'
import FormLiveCheckbox from '@/components/FormLiveCheckbox'
import { useEffect, useState } from 'react'
import FormElement from './FormElement'
import { formObj } from '@/pages/index'
const Sidebar = (props: { formState: formObj, saveForm: any, clearForm: any, isLive: boolean, changeLive: any }) => {
  const [isClient, setIsClient] = useState(false)
 
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
        props.saveForm(true)
      }}/>
    }
    else return <input type="submit" value="SAVE FORM" className={styles.sidebarButton} id={styles.saveBtn} onClick={e=>{
      props.saveForm(false);
    }} />
  }
  
  return (
    <section id={styles.wrapper}>
      <div id={styles.sidebarBody}>
        <section id={styles.draggablesBody}>
          <div id={styles.sidebarHead}>DRAG FROM HERE</div>
          <div id={styles.sidebarContent}>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'text')} onTouchStart={(e) => dragFunc(e, 'text')}>Text Question</div>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'checkbox')} onTouchStart={(e) => dragFunc(e, 'checkbox')}>Multiple Choices</div>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'select')} onTouchStart={(e) => dragFunc(e, 'select')}>Dropdown</div>
          </div>

        </section>
        <section id={styles.saveWrapper}>
          {isClient ? renderSaveBtn() : null}
          <button type="button" className={styles.sidebarButton} id={styles.deleteBtn} onClick={(e: any) => { props.clearForm(); e.target.blur() }}>CLEAR FORM</button>
        </section>
        <FormLiveCheckbox formState={props.formState} isLive={props.isLive} changeLive={props.changeLive} mobile={false}></FormLiveCheckbox>
      </div>

    </section>
  )
}

export default Sidebar