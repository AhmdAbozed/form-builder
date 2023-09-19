"use client"
import { SetStateAction } from 'react';
import styles from '../css/sidebar.module.css'
import { Dispatch } from 'react';
const Sidebar =(props:{})=>{
  function dragFunc(e: any, type: 'checkbox' | 'select' | 'text'){
    e.dataTransfer.setData("text/plain", JSON.stringify([]));
    e.dataTransfer.setData("type", type);
    e.dataTransfer.dropEffect = "copy";
  }
  return (
   <section id={styles.wrapper}>
    <div className={styles.sidebar_element} draggable="true" onDragStart={(e)=>dragFunc(e, 'text')} onTouchStart={(e)=>dragFunc(e, 'text')}>Text Question</div>
    <div className={styles.sidebar_element} draggable="true" onDragStart={(e)=>dragFunc(e, 'checkbox')} onTouchStart={(e)=>dragFunc(e, 'checkbox')}>Multiple Choices</div>
    <div className={styles.sidebar_element} draggable="true" onDragStart={(e)=>dragFunc(e, 'select')} onTouchStart={(e)=>dragFunc(e, 'select')}>Dropdown</div>
    
   </section>
  )
}

export default Sidebar