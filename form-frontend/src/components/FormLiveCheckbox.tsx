"use client"
import { formObj } from '@/pages/index'
import styles from '../css/sidebar.module.css'
import style from '../css/util/customCheckbox.module.css'
import { useEffect, useState } from 'react'
const FormLiveCheckbox = (props: { isLive: boolean, changeLive: any, mobile: boolean, formState: formObj }) => {

    const [renderLive, setRenderLive] = useState(false);
    useEffect(()=>{
        setRenderLive(true)
    }, [])
    const renderLiveLink=()=>{
        //only render after page load to fix window undefined error
        if(renderLive){
            return   <div className={`${styles.liveLink} ${props.mobile ? styles.mobileDisplay : ''}`} hidden={!props.isLive} >Form is now live at: <a href={window.location.protocol + '/fill/' + props.formState.id} target='_top'>{window.location.protocol + window.location.host + '/fill/' + props.formState.id}</a></div>
        }
    }
    return (
        <section>
            <div className={`${styles.liveCheckWrapper} ${props.mobile ? styles.mobileDisplay : ''} `}>
                <input type="checkbox" id='liveCheckbox'  className={`${style.ikxBAC}`} checked={props.isLive || false} onChange={(e) => {props.changeLive(e.target.checked) }} />
                <label htmlFor="liveCheckbox" className={styles.checkboxLabel}>Form Live</label>
            </div>
            {renderLiveLink()}
        </section>
    )
}

export default FormLiveCheckbox