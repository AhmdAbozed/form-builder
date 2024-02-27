"use client"
import { subElementObj } from '@/app/page';
import styles from '../css/fillPage.module.css'
import React from 'react';
const InputFormElement = (props: { id: string; question: string; subElements: Array<subElementObj>; type: 'checkbox' | 'text' | 'select' }) => {

    const renderInputs = () => {
        if (props.type === "text") {
            return <input type="text" className={styles.inputText} name={props.question}/>
        }
        else if (props.type === "checkbox") {
            const renderedSubElements = props.subElements.map((element) => {
                return (
                    <div className={styles.inputRadioWrapper} key={element.id}>
                        <input type="radio" name={props.question} className={styles.inputRadio} value={element.name}></input>
                        <label htmlFor={props.id} className={styles.inputLabel}>{element.name}</label>
                    </div>
                )
            })
            return renderedSubElements
        }
        else if (props.type === "select") {
            const renderedSubElements = props.subElements.map((element) => {
                return (
                    <option value={element.name} className={styles.inputOption} key={element.id}>{element.name}</option>
                )
            })
            return (
                <select name={props.question} className={styles.inputSelect}>
                    {renderedSubElements}
                </select>
            )
        }
    }
    return (
        <article className={styles.inputElement} key={props.id}>
            <p className={styles.inputTitle}>{props.question}</p>
            {renderInputs()}
        </article>
    )
}

export default InputFormElement