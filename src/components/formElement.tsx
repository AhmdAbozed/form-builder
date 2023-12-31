"use client"
import styles from '../css/formElement.module.css'
import React, { SetStateAction, useState, Dispatch, useEffect } from 'react';
import SubElement from './subElement'
import { formElementObj, subElementObj } from '@/app/page';
const FormElement = (props: { id: string; title: string; formElements: Array<any>; setFormElements: Dispatch<SetStateAction<any[]>>; subElements: Array<any>; type: 'checkbox' | 'text' | 'select' }) => {


    const [subElements, setSubElements] = useState<Array<any>>(props.subElements);
    const [titleState, setTitleState] = useState<string>(props.title);
    //update formElement on state change

    useEffect(() => {
        let newElement: formElementObj = { id: props.id, title: titleState, subElements: subElements, type: props.type }
        console.log(newElement.title)
        const oldElementIndex = props.formElements.findIndex((element: formElementObj) => element.id == props.id)
        console.log("oldElementIndex: " + oldElementIndex)
        props.formElements.splice(oldElementIndex, 1, newElement)
        console.log(props.formElements)
    }, [titleState, subElements])

    const zoneDragOver = (e: React.DragEvent<HTMLElement>) => {

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
        console.log("formElements: " + props.formElements.length)
        e.preventDefault();
        e.stopPropagation(); //stops event from bubbling to parent and triggering drop twice

        //reset highlights if any before processing 
        e.currentTarget.classList.remove(styles["upperHighlight"])
        e.currentTarget.classList.remove(styles["lowerHighlight"])

        const currentTarget = e.currentTarget as HTMLElement
        const formElements = props.formElements;

        console.log("current target id: "+currentTarget.id)
        
        console.log("the formelements before index search: "+JSON.stringify(props.formElements))
        const currentIndex = formElements.findIndex((e: formElementObj) => e.id == currentTarget.id)
        console.log("current index(e.id == currentTId): " + currentIndex)
        //remove original formelement when dragged to new position 
        const draggedElementId = e.dataTransfer.getData("id")

        if (draggedElementId) {
            console.log("oldExists: " + draggedElementId)
            const oldElementIndex = formElements.findIndex((element: formElementObj) => element.id == draggedElementId)
            formElements.splice(oldElementIndex, 1)
        }

        //Used to determine whether element is dropped near the top or bottom
        const y = e.pageY - e.currentTarget.offsetTop;

        //index of dropped-on element, to see where to place new element

        const type = e.dataTransfer.getData("type")

        if (type == 'checkbox' || type == 'text' || type == 'select') {
            //New Element to insert
            let newElement: formElementObj = { id: crypto.randomUUID(), title: e.dataTransfer.getData("title"), subElements: JSON.parse(e.dataTransfer.getData("text/plain")), type: type }

            if (y <= (currentTarget.getBoundingClientRect().height) / 2) {
                formElements.splice(currentIndex, 0, newElement)
                props.setFormElements([...formElements])
                console.log("placed up?" + currentIndex)
            }

            else if (y > (currentTarget.getBoundingClientRect().height) / 2) {
                formElements.splice(currentIndex + 1, 0, newElement)
                props.setFormElements([...formElements])
                console.log("placed down?" + currentIndex)
            }
        }
    }

    const addSubElementButton = () => {
        if (props.type != 'text') {
            return <button id="insertOption" onClick={() => {
                const sub: subElementObj = { id: subElements.length, name: "" }
                subElements.push(sub)
                setSubElements([...subElements])
            }} value={""}>Add Option</button>
        }
        else {
            return <input type='text' className={styles.answerInput} placeholder='Answer goes here' disabled></input>
        }
    }

    const renderSubElements = () => {
        const subsArray: Array<any> = subElements.map((e: subElementObj) => {
            return <SubElement id={Number(e.id)} value={e.name || ''} subElements={subElements} setSubElements={setSubElements} key={Number(e.id)} type={props.type} />
        })
        return subsArray
    }

    const dragMouseDown = (e: any) => {
        e.currentTarget.parentElement?.setAttribute("draggable", "true")
    }

    const dragStartParent = (e: React.DragEvent<HTMLElement>) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(subElements));
        e.dataTransfer.setData("id", props.id);
        e.dataTransfer.setData("type", props.type);
        e.dataTransfer.setData("title", titleState);
        e.dataTransfer.dropEffect = "copy";
    }
return (<article className={styles.formElement} id={`${props.id}`} onDragStart={dragStartParent} onDragEnter={zoneDragEnter} onDragLeave={zoneDragLeave} onDrop={zoneDragDrop} onDragOver={zoneDragOver} draggable="false">
        <div className={styles.formElementBody}>
            <div className={styles.dragDiv} onMouseDown={dragMouseDown} onTouchStart={dragMouseDown}>Drag Me</div>
            <input type='text' placeholder={"Enter Question.."} className={styles.formElementTitle} defaultValue={props.title} onChange={(e) => { setTitleState(e.target.value) }} />

            <div className={styles.subElementsWrapper}>
                <form className={styles.subElementsForm} onSubmit={(e) => { e.preventDefault() }}>
                    <ol>
                        {renderSubElements()}
                    </ol>
                </form>
                {addSubElementButton()}
            </div>

        </div>
    </article>
    )
}
//<label htmlFor="checkbox">Checkers{props.id}</label>

export default FormElement