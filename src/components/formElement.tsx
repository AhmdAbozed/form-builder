"use client"
import styles from '../css/formElement.module.css'
import React from 'react';
const FormElement = (props: { id: number }) => {


    const zoneDragEnter = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const target = e.target as HTMLElement;

        if (target.classList.contains(styles["boundary"])) {
            target.classList.add(styles["highlight"])
        }
    }
    
    const zoneDragLeave = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const target = e.target as HTMLElement;

        if (target.classList.contains(styles["highlight"])) {
            target.classList.remove(styles["highlight"])
        }
    }

    const zoneDragDrop =  (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const highlighted = document.getElementsByClassName(styles["highlight"])
        console.log("found: "+highlighted)
        if (highlighted[0]) {
            highlighted[0].classList.remove(styles["highlight"])
        }
    }

    return (<article className={styles.formElement} id={`${props.id}`} onDragEnter={zoneDragEnter} onDragLeave={zoneDragLeave} onDrop={zoneDragDrop}>
        <div className={styles.upperbound + " " + styles.boundary} />
        <input type="checkbox" name="checkers" id="checkers" />
        <label htmlFor="checkers">Checkers{props.id}</label>
        <div className={styles.lowerbound + " " + styles.boundary} />
    </article>
    )
}

export default FormElement
