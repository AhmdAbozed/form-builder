"use client"
//import { useParams } from "react-router-dom"
import React, { SetStateAction, useEffect, useState, Dispatch, MutableRefObject } from "react"
import styles from '../css/formHead.module.css'
import { formObj } from "@/pages/index";
import cookieUtils from "@/util/AccessControl";
import { useRouter } from "next/navigation";
const cookieFuncs = new cookieUtils()
const FormHead = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    setForm: Dispatch<SetStateAction<formObj>>;
    formState: formObj;
    savedFormsState: Array<any>;
    deleteForm: any
}) => {
    console.log('inside formhead savedFroms', props.savedFormsState)
    const [isClient, setIsClient] = useState(false)

    const [showDeletePopup, setDeletePopup] = useState(false);

    useEffect(() => {
        //setIsClient(true)
    }, [])

    const router = useRouter();
    const pageSearchParams = new URLSearchParams(window.location.search);

    const renderSavedForms = () => {
        const options = props.savedFormsState.map((e) => {
            return <option value={e.title} key={e.title}>{e.title}</option>
        })
        return options
    }

    const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const selectedForm = props.savedFormsState.find((form: any) => e.target.value === form.title)
        if (selectedForm) {
            pageSearchParams.set("form", selectedForm.title)
            const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
            const newFormElements = JSON.parse(selectedForm.form)
            props.setForm({ id: selectedForm.id, title: selectedForm.title, form: [...newFormElements], live: selectedForm.live })

        }
    }

    const renderSelect = () => {
        if (pageSearchParams.get("form")) {
            return <select className={styles.headSelect} onChange={selectOnChange} value={pageSearchParams.get("form")!}>
                <option hidden>Choose form..</option>
                {renderSavedForms()}
            </select>
        }
        else return <select className={styles.headSelect} value={"empty"} onChange={selectOnChange} >
            <option value={"empty"} key={"empty"} hidden>Choose form..</option>
            {renderSavedForms()}
        </select>
    }
    const renderDeletePopup = () => {
        if (showDeletePopup && props.formState.id) {
            return <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <p className={styles.popupText}>Delete Form?</p>
                    <button className={styles.confirmButton} onClick={() => { setDeletePopup(false); props.deleteForm(); }}>Confirm</button>
                    <button className={styles.cancelButton} onClick={() => setDeletePopup(false)}>Cancel</button>
                </div>
            </div>
        }
    }
    return (
        <section className={styles.formHeadWrapper}>

            {renderSelect()}
            {renderDeletePopup()}
            <div className={styles.headBtnsWrapper}>
                <input type="button" value="DELETE FORM" className={styles.headButton} id={styles.deleteButton} onClick={() => setDeletePopup(true)} />
                <input type="button" value="FORM" className={styles.headButton} onClick={() => {
                    if (cookieFuncs.hasRefreshToken()) {
                        const searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("section", "build");
                        router.push('/?' + searchParams.toString())
                    }
                }} />
                <input type="button" value="RESPONSES" className={styles.headButton} onClick={() => {
                    if (cookieFuncs.hasRefreshToken()) {
                        const searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("section", "responses");
                        router.push('/?' + searchParams.toString())
                    }
                }
                } />
            </div>

        </section>
    )
}

export default FormHead