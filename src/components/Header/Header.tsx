"use client";

import styles from "./Header.module.css";
import type { JSX } from "react";
import { Htag } from "@/components";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";

export const Header = (): JSX.Element => {
	return (
		<header className={styles.header}>
			<Htag tag="h1">Электронное расписание (Beta)</Htag>
			<IconButton aria-label="vbi">
				<VisibilityOutlinedIcon />
			</IconButton>
		</header>
	);
};
