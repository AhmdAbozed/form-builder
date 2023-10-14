"use client"
import styles from '@/css/formPage.module.css'
import { FormEvent, FormEventHandler, createContext, useContext, useEffect, useState } from 'react';
import { protocol } from '@/util/utilFuncs';
import InputFormElement from '@/components/inputFormElement';
import { formElementObj, subElementObj } from '@/app/page';
export default function FormDisplay({ params }: { params: { id: number } }) {

  const [formElements, setFormElements] = useState<Array<any>>([]);
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

        console.log("resJSON" + JSON.parse(resJSON.form)[0].id)
        setFormElements(JSON.parse(resJSON.form))

      }
      return res;
    }

    getForm()
  }, [])
  const renderFormElements = () => {
    const renderedElements = formElements.map((element) => {
      return <InputFormElement id={element.id as string} key={element.id as string} title={element.title as string} subElements={element.subElements} type={element.type} />
    })
    return renderedElements
  }

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as any
    console.log(Array.from(target.elements))
    /*const submission = Array.from(target.elements).map((element: any) => {
      if (element.name) {
        console.log(element.checked)
        if (typeof (element.checked)) {
          return { id: element.name, value: element.checked }
        }
        else return { id: element.name, value: element.value }
      }
    })*/
    const submission: Array<any> = []

    const sub = Array.from(target.elements).forEach((element: any) => {
      if (element.name) {
        if (element.checked || element.checked === false) {
          submission.push({ id: element.name, value: element.checked })
        }
        else {
          submission.push({ id: element.name, value: element.value })
        }
      }
    })
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const res = await fetch(protocol + "://" + window.location.hostname + ":3003/forms/" + params.id
      , options);

    if (res.status == 200) {

      const resJSON = await res.json()

      console.log("resJSON ", resJSON)

    } else {
      console.log("!!!200")
    }
  }
  return (
    <main className={styles.main}>
      <form className={styles.formWrapper} onSubmit={submitForm}>
        <section className={styles.inputsWrapper}>
          <div>
            {renderFormElements()}
          </div>
        </section>
        <section className={styles.submitWrapper}>
          <input type="submit" value="Submit" id={styles.submitBtn} className={styles.formBtn} />
          <input type="reset" value="Reset Form" id={styles.resetBtn} className={styles.formBtn} />
        </section>
      </form>

    </main>
  )
}