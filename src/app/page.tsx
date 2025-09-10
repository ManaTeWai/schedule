"use client";

import { Htag, Table_comp } from "@/components";
import styles from "./page.module.css";

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.schedule}>
				<Htag tag="h3">Расписание звонков</Htag>
				<Table_comp />
			</div>
		</main>
	);
}
