'use client'

import { Select_comp, Table_comp } from "@/components";
import styles from "./page.module.css";


export default function Home() {
	return (
		<main className={styles.main}>
			<Select_comp />
			<div className={styles.schedule}>
				<Table_comp />
			</div>
		</main>
	);
}
