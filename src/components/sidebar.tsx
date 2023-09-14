"use client"
import { SetStateAction } from 'react';
import styles from '../css/sidebar.module.css'
import { Dispatch } from 'react';
const Sidebar =(props:{toggleDragging: Dispatch<SetStateAction<boolean>>})=>{
  function dragFunc(e: any){
    e.dataTransfer.setData("text/plain", "heyoo");
    e.dataTransfer.dropEffect = "copy";
  }
  return (
   <section id={styles.wrapper}>
    <div className={styles.sidebar_element} draggable="true" onDragStart={dragFunc} onTouchStart={dragFunc}>placeholder</div>
    <div className={styles.sidebar_element} draggable="true" onDragStart={dragFunc}>placeholder</div>
    <div className={styles.sidebar_element} draggable="true" onDragStart={dragFunc}>placeholder</div>
    
   </section>
  )
}

export default Sidebar