"use client"
import styles from '../css/formElement.module.css'
import React, { SetStateAction, useState, Dispatch, useEffect } from 'react';
import SubElement from './subElement'
import { formElementObj, formObj, subElementObj } from '@/app/page';
const FormElement = (props: { id: string; question: string; formState: formObj; setForm: Dispatch<SetStateAction<formObj>>; subElements: Array<any>; type: 'checkbox' | 'text' | 'select' }) => {

    const [subElements, setSubElements] = useState<Array<any>>([...props.subElements]);
    const [questionState, setQuestionState] = useState<string>(props.question);

    //update formElement on state change
    useEffect(() => {
        let newElement: formElementObj = { id: props.id, question: questionState, subElements: [...subElements], type: props.type }
        const oldElementIndex = props.formState.formElements.findIndex((element: formElementObj) => element.id == props.id)
        props.formState.formElements.splice(oldElementIndex, 1, newElement)
        const newElements = [...props.formState.formElements]
        //props.setForm({...props.formState, formElements: props.formState.formElements.splice(oldElementIndex, 1, newElement)})
        //rerenders everything on any input change, no noticeable effect on performance yet
        props.setForm({ ...props.formState, formElements: newElements })
        localStorage.setItem("lastForm", JSON.stringify(props.formState.formElements));
    }, [questionState, subElements])

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
        e.preventDefault();
        e.stopPropagation(); //stops event from bubbling to parent and triggering drop twice

        //reset highlights if any before processing 
        e.currentTarget.classList.remove(styles["upperHighlight"])
        e.currentTarget.classList.remove(styles["lowerHighlight"])

        const formElements = props.formState.formElements;

        //The dropped-on element
        const currentTarget = e.currentTarget as HTMLElement

        //Id of element being dragged
        const draggedElementId = e.dataTransfer.getData("id")

        //If element dropped on itself, do nothing
        if (draggedElementId === currentTarget.id) {
            return
        }
        //remove original formelement when dragged to new position 
        if (draggedElementId) {
            const oldElementIndex = formElements.findIndex((element: formElementObj) => element.id == draggedElementId)
            formElements.splice(oldElementIndex, 1)
        }

        //index of dropped-on element, to see where to place new element
        const currentIndex = formElements.findIndex((e: formElementObj) => currentTarget.id == e.id)

        //Used to determine whether element is dropped near the top or bottom
        const y = e.pageY - e.currentTarget.offsetTop;

        const type = e.dataTransfer.getData("type")

        if (type == 'checkbox' || type == 'text' || type == 'select') {
            //New Element to insert
            let newElement: formElementObj = { id: crypto.randomUUID(), question: e.dataTransfer.getData("question"), subElements: JSON.parse(e.dataTransfer.getData("text/plain")), type: type }
            console.log("dropped on index: " + currentIndex)
            if (y <= (currentTarget.getBoundingClientRect().height) / 2) {
                formElements.splice(currentIndex, 0, newElement)
                props.setForm({ ...props.formState, formElements: [...formElements] })
                console.log("placed up?" + currentIndex)
            }

            else if (y > (currentTarget.getBoundingClientRect().height) / 2) {
                formElements.splice(currentIndex + 1, 0, newElement)
                props.setForm({ ...props.formState, formElements: [...formElements] })
                console.log("placed down?" + currentIndex)
            }
        }
    }

    const addSubElementButton = () => {
        if (props.type != 'text') {
            return <input type='button' className={styles.insertOption} onClick={() => {
                const sub: subElementObj = { id: subElements.length, name: "" }
                subElements.push(sub)
                setSubElements([...subElements])
            }} value={"ADD OPTION"}></input>
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
        e.dataTransfer.setData("question", questionState);
        e.dataTransfer.dropEffect = "copy";
    }
    return (<article className={styles.formElement} id={`${props.id}`} onDragStart={dragStartParent} onDragEnter={zoneDragEnter} onDragLeave={zoneDragLeave} onDrop={zoneDragDrop} onDragOver={zoneDragOver} draggable="false">
        <div className={styles.formElementBody}>
            <div className={styles.dragDiv} onMouseDown={dragMouseDown} onTouchStart={dragMouseDown}>
            </div>
            <input type='text' placeholder={"Enter Question.."} className={styles.formElementTitle} defaultValue={questionState} onChange={(e) => { setQuestionState(e.target.value) }} />

            <div className={styles.subElementsWrapper}>
                <div className={styles.subElementsForm} onSubmit={(e) => { e.preventDefault() }}>
                    <ol>
                        {renderSubElements()}
                    </ol>
                </div>
                {addSubElementButton()}
            </div>

        </div>
    </article>
    )
}
//<label htmlFor="checkbox">Checkers{props.id}</label>

export default FormElement