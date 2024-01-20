"use client"
//import { useParams } from "react-router-dom"
import React, { SetStateAction, useEffect, useState, Dispatch, MutableRefObject } from "react"
import styles from '../css/formHead.module.css'
import { formObj } from "@/app/page";
import cookieUtils from "@/util/AccessControl";
import { useRouter } from "next/navigation";
const cookieFuncs = new cookieUtils()
const FormHead = (props: {
    toggleLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
    setForm: Dispatch<SetStateAction<formObj>>;
    formState: formObj;
    savedForms: Array<any>;
}) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const router = useRouter();
    const pageSearchParams = new URLSearchParams(window.location.search);

    const renderSavedForms = () => {
        const options = props.savedForms.map((e) => {
            return <option value={e.title} key={e.title}>{e.title}</option>
        })
        return options
    }

    const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const form = props.savedForms.find((form: any) => e.target.value === form.title)
        if (form) {
            pageSearchParams.set("form", form.title)
            const newRelativePathQuery = window.location.pathname + '?' + pageSearchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
            const newFormElements = JSON.parse(form.form)
            props.setForm({ id: form.id, title: form.title, formElements: [...newFormElements] })

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
    renderSavedForms()
    return (
        <section className={styles.formHeadWrapper}>

            {renderSelect()}
            <div className={styles.headBtnsWrapper}>
                <input type="button" value="Make a copy" className={styles.headButton} />
                <input type="button" value="Form" className={styles.headButton} onClick={() => {
                    if (cookieFuncs.hasRefreshToken()) {
                        const searchParams = new URLSearchParams(window.location.search);
                        searchParams.set("section", "build");
                        router.push('/?' + searchParams.toString())
                    }
                }} />
                <input type="button" value="Responses" className={styles.headButton} onClick={() => {
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