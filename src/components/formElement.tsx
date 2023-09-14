"use client"
import styles from '../css/formElement.module.css'
import React, { SetStateAction, useEffect, useState, Dispatch } from 'react';
const FormElement = (props: { id: number; formElements: any; setFormElements: Dispatch<SetStateAction<any[]>> }) => {

    const [subElements, setSubElements] = useState<Array<any>>([]);

    const zoneDragOver = (e: React.DragEvent<HTMLElement>) => {

        const x = e.pageX - e.currentTarget.offsetLeft;
        const y = e.pageY - e.currentTarget.offsetTop;
        const currentTarget = e.currentTarget as HTMLElement

        if (y <= (currentTarget.getBoundingClientRect().height) / 2) {
            if (!currentTarget.classList.contains(styles["upperHighlight"])) {
                currentTarget.classList.add(styles["upperHighlight"])
            }
            currentTarget.classList.remove(styles["lowerHighlight"])
        }

        else if (y > (currentTarget.getBoundingClientRect().height) / 2) {
            if (!currentTarget.classList.contains(styles["lowerHightlight"])) {
                currentTarget.classList.add(styles["lowerHighlight"])
            }
            currentTarget.classList.remove(styles["upperHighlight"])

        }
        else {
            currentTarget.classList.remove(styles["upperHighlight"])
            currentTarget.classList.remove(styles["lowerHighlight"])
        }
    }


    const zoneDragEnter = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
    }

    const zoneDragLeave = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        const upper = document.querySelectorAll("." + styles["upperHighlight"])
        const lower = document.querySelectorAll("." + styles["lowerHighlight"])
        upper.forEach(element => {
            element.classList.remove(styles["upperHighlight"]);
        });
        lower.forEach(element => {
            element.classList.remove(styles["lowerHighlight"]);
        })
    }

    const zoneDragDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation(); //stops event from bubbling to parent and triggering drop twice

        e.currentTarget.classList.remove(styles["upperHighlight"])
        e.currentTarget.classList.remove(styles["lowerHighlight"])

        const currentTarget = e.currentTarget as HTMLElement
        const formElements = props.formElements;

        const currentIndex = formElements.findIndex((e: any) => e.props.id == Number(currentTarget.id))
        const newElement = <FormElement id={formElements.length} key={formElements.length} formElements={formElements} setFormElements={props.setFormElements} />

        const y = e.pageY - e.currentTarget.offsetTop;

        if (y <= (currentTarget.getBoundingClientRect().height) / 2) {
            formElements.splice(currentIndex, 0, newElement)
            console.log(formElements)
            props.setFormElements([...formElements])
            console.log("placed up?" + currentIndex)
        }

        else if (y > (currentTarget.getBoundingClientRect().height) / 2) {
            formElements.splice(currentIndex + 1, 0, newElement)
            console.log(formElements)
            props.setFormElements([...formElements])
            console.log("placed down?" + currentIndex)
        }

        else {
            const data = e.dataTransfer.getData("text/plain");
            formElements.push(newElement)
            props.setFormElements([...formElements])
        }
    }

    const addSubElement = () => {
        const subElement = [
            <div className={styles.checkboxWrapper} key={props.id}>
                <input type='checkbox'>
                </input>
                <input type='text' placeholder='Enter Option..'></input>
            </div>
        ]
        subElements.push(subElement)
        setSubElements([...subElements])
    }

    const dragMouseDown = (e: any) => {
        /*e.dataTransfer.setData("text/plain", "heyoo");
        e.dataTransfer.dropEffect = "copy";
        e.currentTarget.parentElement?.setAttribute("draggable", "true")
        const event = new DragEvent("dragstart", {
            dataTransfer: e.dataTransfer
        }) 
        //e.currentTarget.parentElement?.dispatchEvent(event)
        console.log("test")
        */
       e.currentTarget.parentElement?.setAttribute("draggable", "true")
    }

    const dragStartParent = (e: React.DragEvent<HTMLElement>) => {
        console.log("CAUGHT")
        e.dataTransfer.setData("text/plain", "heyoo");
        e.dataTransfer.dropEffect = "copy";
    }
    return (<article className={styles.formElement} id={`${props.id}`} onDragStart={dragStartParent} onDragEnter={zoneDragEnter} onDragLeave={zoneDragLeave} onDrop={zoneDragDrop} onDragOver={zoneDragOver} draggable="false">
        <div className={styles.formElementBody}>
            <div className={styles.dragDiv} onMouseDown={dragMouseDown} onTouchStart={dragMouseDown}>Drag Me</div>
            <input type='text' placeholder={"(No Title)"} className={styles.formElementTitle} />

            <div className={styles.subElementsWrapper}>
                <form className={styles.subElementsBody}>
                    {subElements}
                </form>
                <button id="insertCheckbox" onClick={addSubElement} value={""}>Add Checkbox</button>
            </div>
            <label htmlFor="checkbox">Checkers{props.id}</label>

        </div>
    </article>
    )
}

export default FormElement