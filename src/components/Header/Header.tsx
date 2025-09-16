"use client";

import styles from "./Header.module.css";
import type { JSX } from "react";
import { Htag } from "@/components";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { IconButton, Divider, ListItemIcon, MenuList, MenuItem, ListItemText } from "@mui/material";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

const ThemeContext = createContext({
	isDarkMode: false,
	toggleTheme: () => {},
});

// Хук для использования темы
export const useTheme = () => useContext(ThemeContext);

export const Header = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isOpen]);

	const { isDarkMode, toggleTheme } = useTheme();
	return (
		<header className={styles.header} ref={menuRef}>
			<Link href="/">
				<Htag tag="h1">Электронное расписание (Beta)</Htag>
			</Link>
			<IconButton
				aria-label={isDarkMode ? "light_mode" : "dark_mode"}
				onClick={toggleTheme}
				sx={{
					color: "var(--text-color)",
				}}
			>
				{isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
			</IconButton>
			<div className={`${styles.burger} ${isOpen ? styles.open : ""}`} onClick={toggleMenu}>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<ul className={`${styles.mobile_nav} ${isOpen ? styles.open : ""}`}>
				<Image src="/logo_curcule.png" alt="лого" width={75} height={75} />

				<MenuList sx={{ width: 320, maxWidth: "100%" }}>
					<Divider />
					<Link href="/">
						<MenuItem>
							<ListItemIcon>
								<CalendarMonthOutlinedIcon
									fontSize="small"
									sx={{
										color: "var(--text-color)",
									}}
								/>
							</ListItemIcon>
							<ListItemText>Расписание</ListItemText>
						</MenuItem>
					</Link>
					<Divider />
					<Link href="https://stavik.ru/">
						<MenuItem>
							<ListItemIcon>
								<ExitToAppOutlinedIcon
									fontSize="small"
									sx={{
										color: "var(--text-color)",
									}}
								/>
							</ListItemIcon>
							<ListItemText>Основной сайт</ListItemText>
						</MenuItem>
					</Link>
				</MenuList>
			</ul>
		</header>
	);
};
