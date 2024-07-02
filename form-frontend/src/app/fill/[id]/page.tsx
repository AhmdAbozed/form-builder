"use client"
import styles from '@/css/fillPage.module.css'
import { FormEvent, FormEventHandler, createContext, useContext, useEffect, useState } from 'react';
import { protocol } from '@/util/utilFuncs';
import InputFormElement from '@/components/inputFormElement';
//can also use useRouter() query to get params
export type question = { question: string, answer: string }
export default function FormDisplay({ params }: { params: { id: number } }) {

  const [formElements, setFormElements] = useState<Array<any>>([]);
  const [submitBtnDisabled, setSubmitDisabled] = useState(false);
  const [formLive, setFormLive] = useState(true)
  useEffect(() => {
    const getForm = async () => {
      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const res = await fetch(protocol + "://" + window.location.hostname + ":3003/forms/" + params.id
        , options);
      console.log(res.status)
      if (res.status == 200) {
        const resJSON = await res.json()
        console.log(JSON.parse(resJSON.form)[1])
        setFormElements(JSON.parse(resJSON.form))

      } else if (res.status == 401) {
        setFormLive(false)
      }
      return res;
    }

    getForm()
  }, [])
  useEffect(() => {
    console.log(submitBtnDisabled)
  }, [submitBtnDisabled])
  const renderFormElements = () => {
    const renderedElements = formElements.map((element) => {
      return <InputFormElement id={element.id as string} key={element.id as string} question={element.question as string} subElements={element.subElements} type={element.type} />
    })
    return renderedElements
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (document.getElementById(styles.submitBtn) as HTMLInputElement).disabled = true
    const target = e.target as HTMLFormElement
    const data = new FormData(target);
    const submission: Array<question> = []
    Array.from(data).forEach((element: any) => {
      submission.push({ question: element[0], answer: element[1] })
    })
    console.log(submission)
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission)
    }
    const res = await fetch(protocol + "://" + window.location.hostname + ":3003/forms/" + params.id + "/submissions"
      , options);
    if (res.status == 200) {
      setSubmitDisabled(true)
    } else {
      setSubmitDisabled(false)
      console.log("!!!200")
    }
  }
  const renderFormLiveStatus = () => {
    if (!formLive) {
      return <p>Form is not accepting responses.</p>
    }
  }
  const renderSubmitBtns = ()=>{}
  return (
    <main className={styles.main}>
      <form className={styles.formWrapper} onSubmit={submitForm}>
        <section className={styles.inputsWrapper}>
          <div>
            {renderFormElements()}
            {renderFormLiveStatus()}
          </div>
        </section>
        <section className={styles.submitWrapper}>
          <input type="submit" value={submitBtnDisabled ? "Submitted." : "Submit"} id={styles.submitBtn} className={styles.formBtn} hidden={!formLive} />
          <input type="reset" value="Reset Form" id={styles.resetBtn} className={styles.formBtn} onClick={() => { setSubmitDisabled(false) }} hidden={!formLive}/>
        </section>
      </form>

    </main>
  )
}