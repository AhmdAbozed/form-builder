"use client"
import styles from '../css/formElement.module.css'
import React, { SetStateAction, useEffect, useState, Dispatch } from 'react';
const SubElement = (props: { id: number; value: string; subElements: Array<any>; setSubElements: Dispatch<SetStateAction<any[]>>; type: 'checkbox' | 'text' | 'select' }) => {
    const renderCheckbox = () => {
        if(props.type == "checkbox"){
            return <input type='checkbox' disabled></input>
        }
    }
    return (
        <li className={styles.subElement} key={props.id}>
            {renderCheckbox()}
            <input className={styles.subElementInput} type='text' placeholder='Enter Option..' value={props.value} onChange={(e: any) => {
                const newSubs = props.subElements.map((sub) => {
                    console.log("CHANGED SUBELEMENT NAME" + props.id + " " + sub.id)
                    if (sub.id == props.id) {
                        
                        console.log("FOUND SUBELEMENT OLD" + sub.name)
                        console.log("FOUND SUBELEMENT" + e.target.value)

                        return { id: props.id, name: e.target.value }
                    }
                    else return sub;
                })
                props.setSubElements(newSubs)
            }} onKeyUp={(e)=>{if(e.key === "Enter")(e.target as HTMLElement).blur()}}></input>
        </li>
    )
}
export default SubElement