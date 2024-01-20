"use client"
import styles from '@/css/fillPage.module.css'
import React, { SetStateAction, useEffect, useState, Dispatch } from 'react';
const ResponseElement = (props: { question: string, answer: string }) => {

    return (
        <article className={styles.inputElement}>
            <p className={styles.inputTitle}>{props.question}</p>
            <input type="text" className={styles.inputText} name={props.question} value={props.answer} readOnly/>
        </article>
    )
}
export default ResponseElement