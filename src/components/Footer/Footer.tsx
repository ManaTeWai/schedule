import { Htag, P } from '@/components'
import styles from './Footer.module.css'
import { type JSX } from 'react'
import { format } from "date-fns"

export const Footer = (): JSX.Element => {
   return (
    <footer className={styles.footer}>
        <Htag tag='h1'>Подвал</Htag>
        <P size='small'> © 2025 - {format(new Date(), "yyyy")} Ставропольский институт кооперации. Все права защищены.</P>
    </footer>
   ) 
}