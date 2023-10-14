"use client"
import styles from '../css/formPage.module.css'
import React, { SetStateAction, useState, Dispatch, useEffect } from 'react';
import SubElement from './subElement'
import { formElementObj, subElementObj } from '@/app/page';
const InputFormElement = (props: { id: string; title: string; subElements: Array<any>; type: 'checkbox' | 'text' | 'select' }) => {


    const [subElements, setSubElements] = useState<Array<any>>(props.subElements);
    const [titleState, setTitleState] = useState<string>(props.title);
    const renderInputs = () => {
        if (props.type === "text") {
            return <input type="text" className={styles.inputText} />
        }
        else if (props.type === "checkbox") {
            const renderedSubElements = props.subElements.map((element) => {
                return (
                    <div className={styles.inputRadioWrapper} key={element.id}>
                        <input type="radio" name={props.id} className={styles.inputRadio} value={element.name}></input>
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
                <select name={props.id} className={styles.inputSelect}>
                    {renderedSubElements}
                </select>
            )
        }
    }
    return (
        <article className={styles.inputElement} key={props.id}>
            <p className={styles.inputTitle}>{props.title}</p>
            {renderInputs()}
        </article>
    )
}

export default InputFormElement