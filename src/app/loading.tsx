"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { P } from "@/components";


export default function Loading() {
	return (
		<main className={styles.loading}>
			<Image src="./loading.svg" alt="loading" width={100} height={100} />
			<P size="small">Initializing support systems…</P>
		</main>
	);
}
