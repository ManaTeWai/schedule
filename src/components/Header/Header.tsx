"use client";

import styles from "./Header.module.css";
import type { JSX } from "react";
import { Htag, P } from "@/components";
import { Divider, ListItemIcon, MenuList, MenuItem, ListItemText } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "next-themes";

export const Header = (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const { theme, resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [isOpen]);

	if (!mounted) {
		return <></>;
	}

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const CloseMenu = () => {
		setIsOpen(false);
	};

	return (
		<header className={styles.header} ref={menuRef}>
			<Link href="/" onClick={CloseMenu}>
				<Htag tag="h1">Электронное расписание (Beta)</Htag>
			</Link>
			<div className={styles.theme_switcher}>
				<button
					onClick={() => {
						const current = resolvedTheme ?? theme;
						setTheme(current === "dark" ? "light" : "dark");
					}}
				>
					{(resolvedTheme ?? theme) === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
				</button>
			</div>
			<div className={`${styles.burger} ${isOpen ? styles.open : ""}`} onClick={toggleMenu}>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<ul className={`${styles.mobile_nav} ${isOpen ? styles.open : ""}`}>
				<Link href="/" onClick={CloseMenu}>
					<Image src="/logo_curcule.png" alt="лого" width={75} height={75} />
				</Link>

				<MenuList sx={{ width: 320, maxWidth: "100%" }}>
					<Divider />
					<Link href="/" onClick={CloseMenu}>
						<MenuItem>
							<button
								onClick={() => {
									const current = resolvedTheme ?? theme;
									setTheme(current === "dark" ? "light" : "dark");
								}}
							>
								{(resolvedTheme ?? theme) === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
							</button>
						</MenuItem>
						<Divider />
						<MenuItem>
							<ListItemIcon>
								<CalendarMonthOutlinedIcon
									fontSize="small"
									sx={{
										color: "var(--text-color)",
									}}
								/>
							</ListItemIcon>
							<ListItemText>
								<P>Расписание</P>
							</ListItemText>
						</MenuItem>
					</Link>
					<Divider />
					<Link href="https://stavik.ru/" onClick={CloseMenu}>
						<MenuItem>
							<ListItemIcon>
								<ExitToAppOutlinedIcon
									fontSize="small"
									sx={{
										color: "var(--text-color)",
									}}
								/>
							</ListItemIcon>
							<ListItemText>
								<P>Основной сайт</P>
							</ListItemText>
						</MenuItem>
					</Link>
					<Divider />
					<Link href="https://t.me/ManaTeWai?text=Здравствуйте,%20хочу%20сообщить%20об%20ошибке%20в%20электронном%20расписании.">
						<MenuItem>
							<ListItemIcon>
								<ReportProblemIcon
									fontSize="small"
									sx={{
										color: "var(--text-color)",
									}}
								/>
							</ListItemIcon>
							<ListItemText>
								<P>Сообщение об ошибке</P>
							</ListItemText>
						</MenuItem>
					</Link>
				</MenuList>
			</ul>
		</header>
	);
};
