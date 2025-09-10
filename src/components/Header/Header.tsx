"use client";

import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";
import { type JSX } from "react";
import { Htag } from "@/components";

export const Header = (): JSX.Element => {
	return (
		<header className={styles.header}>
			<Link href="/"><Image src="/logo_curcule.png" alt="лого" width={75} height={75}/></Link>
            <Htag tag="h1">Электронное расписание ставропольского института кооперации</Htag>
		</header>
	);
};
