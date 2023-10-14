"use client"
import styles from '../css/sidebar.module.css'

const Sidebar = (props: {saveForm: any}) => {
  function dragFunc(e: any, type: 'checkbox' | 'select' | 'text') {
    e.dataTransfer.setData("text/plain", JSON.stringify([]));
    e.dataTransfer.setData("type", type);
    e.dataTransfer.dropEffect = "copy";
  }
  return (
    <section id={styles.wrapper}>
      <div id={styles.sidebarBody}>
        <div id={styles.draggablesBody}>
          <div id={styles.sidebarHead}>Drag From Here</div>
          <div id={styles.sidebarContent}>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'text')} onTouchStart={(e) => dragFunc(e, 'text')}>Text Question</div>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'checkbox')} onTouchStart={(e) => dragFunc(e, 'checkbox')}>Multiple Choices</div>
            <div className={styles.sidebar_element} draggable="true" onDragStart={(e) => dragFunc(e, 'select')} onTouchStart={(e) => dragFunc(e, 'select')}>Dropdown</div>
          </div>

        </div>
        <div id={styles.saveContainer}>
          <input type="button" value="Save Form" className={styles.sidebarButton} id={styles.saveBtn} onClick={props.saveForm} />
          <input type="button" value="Delete Form" className={styles.sidebarButton} id={styles.deleteBtn} />

        </div>

      </div>

    </section>
  )
}

export default Sidebar