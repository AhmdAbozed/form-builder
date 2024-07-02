"use client"
import { useEffect, useState } from 'react'
import styles from '@/css/fillPage.module.css'
import { protocol } from '@/util/utilFuncs';
import { question } from '@/app/fill/[id]/page';
import { formElementObj, formObj } from '@/app/page';
import ResponseElement from '@/components/responseElement';
import { subElementObj } from '@/app/page';
const Responses = (props: { formState: formObj }) => {
  type responseElement = {
    id: string;
    question: string;
    type: 'checkbox' | 'text' | 'select'
    subElements: Array<subElementObj>;
    answer: string;
  }

  //index value to know where a currentResponse is in the responses Array
  type response = {
    submission: Array<question>;
  }
  const emptyResponse = { submission: [] }
  //const [formElements, setFormElements] = useState<Array<formElementObj>>([]);
  const [responsesState, setResponses] = useState<Array<response>>([]);
  const [currentResponseState, setCurrentResponse] = useState<response>(emptyResponse);
  useEffect(() => {
    const getResponses = async () => {

      const options = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const res = await fetch(protocol + "://" + window.location.hostname + ":3003/forms/" + props.formState.id + "/submissions"
        , options);
      console.log(res.status)


      if (res.status == 200) {


        const resArr = await res.json()
        console.log(resArr)
        console.log(resArr[0].submission)
        setResponses(resArr)
        if(resArr[0]){
          setCurrentResponse(resArr[0])
        }
      }
      return res;
    }
    if (props.formState.id) {
      getResponses()
    }

  }, [props.formState])


  const renderFormElements = () => {
    console.log(currentResponseState)
    const renderedElements = currentResponseState.submission.map((element: question, index: number) => {
      return <ResponseElement key={index} question={element.question as string} answer={element.answer} />
    })
    console.log(renderedElements)
    return renderedElements
  }

  //disable next if there are less than 2 responses
  const renderNextBtn = () => {
    const currentIndex = responsesState.findIndex(res=> res == currentResponseState)
    if (responsesState.length > 1 && currentIndex+1 != responsesState.length) {
      return <input type="button" value="Next Form" id={styles.resetBtn} className={styles.formBtn} onClick={(e) => responseNavOnClick(e, 1)} />
    }
    else {
      return <input type="button" value="Next Form" id={styles.resetBtn} className={styles.formBtn} onClick={(e) => responseNavOnClick(e, 1)} disabled />
    }
  }
  const renderPrevBtn = () => {
    const currentIndex = responsesState.findIndex(res=> res == currentResponseState)
    if (currentIndex > 0) {
      return <input type="button" value="Previous Form" id={styles.submitBtn} className={styles.formBtn} onClick={(e) => responseNavOnClick(e, -1)} />
    }
    else {
      return <input type="button" value="Previous Form" id={styles.submitBtn} className={styles.formBtn} onClick={(e) => responseNavOnClick(e, -1)} disabled />
    }
  }
  //browsing the reponses
  const responseNavOnClick = (e: React.MouseEvent<HTMLInputElement, MouseEvent>, indexChange: number) => {

    const currentIndex = responsesState.findIndex(res => res.submission == currentResponseState.submission)
    if (indexChange + currentIndex < responsesState.length && indexChange + currentIndex > -1) {
      const newIndex = currentIndex + indexChange
      const newSubmission = responsesState[newIndex]
      console.log(newSubmission)
      setCurrentResponse(newSubmission)
    }
  }
  const selectOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //if index is 0, Number(0) returns false, hence isinteger
    if (Number.isInteger(Number(e.target.value))) {
      console.log(Number(e.target.value))
      const newSubmission = responsesState[Number(e.target.value)]
      setCurrentResponse(newSubmission)
    }
  }


  const renderSelect = () => {
    console.log(currentResponseState)
    const options = responsesState.map((e, index) => {
      return <option value={index} key={index}>{"Response #" + (index + 1)}</option>
    })
    if (currentResponseState == emptyResponse) {
      return <select className={styles.headSelect} value={"empty"} onChange={selectOnChange}>
        <option value={"empty"} key={"empty"} hidden>No Responses yet..</option>
        {options}
      </select>
    } else {
      const currentIndex = responsesState.findIndex(res=> res == currentResponseState)
      console.log(currentIndex)
      console.log(responsesState)
      return <select className={styles.headSelect} value={currentIndex} onChange={selectOnChange}>
        {options}
      </select>

    }

  }


  return (
    <main className={styles.main}>
      <section className={styles.detailsWrapper}>
        <div className={styles.inputsWrapper}>
          <div>
            
          </div>
          {renderSelect()}

          <div className={styles.responseCount}>Responses Count: {responsesState.length}</div>
          {renderPrevBtn()}
          {renderNextBtn()}
        </div>

      </section>


      <form className={styles.formWrapper}>

        <section className={styles.inputsWrapper}>
          <div>
            {renderFormElements()}
          </div>
        </section>

        <section className={styles.submitWrapper}>
          {renderPrevBtn()}
          {renderNextBtn()}
        </section>

      </form>

    </main >
  )
}

export default Responses