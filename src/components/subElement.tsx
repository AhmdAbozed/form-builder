"use client"
import styles from '../css/formElement.module.css'
import React, { SetStateAction, useEffect, useState, Dispatch } from 'react';
const SubElement = (props: { id: number; value: string; subElements: Array<any>; setSubElements: Dispatch<SetStateAction<any[]>>; type: 'checkbox' | 'text' | 'select' }) => {
    const renderInput = () => {
        switch (props.type) {
            case 'text': return <input type='text'></input>
        }
    }
    return (
        <div className={styles.checkboxWrapper} key={props.id}>
            <input type='text' placeholder='Enter Option..' value={props.value} onChange={(e: any) => {
                const newSubs = props.subElements.map((sub) => {
                    console.log("CHANGED SUB NAME" + props.id + " " + sub.id)
                    if (sub.id == props.id) {
                        console.log("FOUND SUB")
                        return { id: props.id, name: e.target.value }
                    }
                    else return sub;
                })
                props.setSubElements(newSubs)
            }}></input>
        </div>
    )
}
export default SubElement