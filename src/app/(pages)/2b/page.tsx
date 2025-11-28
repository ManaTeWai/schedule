"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import { P } from "@/components";

export default function TestPage() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setReady(true), 5000); // 5 секунд
		return () => clearTimeout(timer);
	}, []);
	if (!ready) {
		return (
			<main className={styles.loading}>
				<Image src="./loading.svg" alt="loading" width={100} height={100} />
				<P size="small">Initializing support systems…</P>
			</main>
		);
	} else {
		return (
			<main className={styles.main}>
				<P size="large">System initialized. YoRHa protocols engaged.</P>
			</main>
		);
	}

	return null;
}
