import styles from './Button.module.css'
export default function Button({children,type,OnClick}) {
  return (
    <button onClick={OnClick} className={`${styles.btn} ${type ==='back'?styles.back:styles.primary}` }>
        {children}
    </button>
  )
}
