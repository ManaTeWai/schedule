"use client";

import type { JSX } from "react";
import styles from "./Select.module.css";
import Link from "next/link";
import { ToggleButton, ToggleButtonGroup, Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { useState, useEffect } from "react";
import { Htag } from "@/components";
import { usePathname, useSearchParams } from "next/navigation";

export const Select_comp = (): JSX.Element => {
	const pathname = usePathname();
	const [scheduleType, setScheduleType] = useState<string | null>(null);
	const searchParams = useSearchParams();
	const mode = searchParams.get("mode");
	const isKiosk = searchParams.get("mode") === "kiosk";

	useEffect(() => {
		if (pathname === "/groups") {
			setScheduleType("groups");
		} else if (pathname === "/teachers") {
			setScheduleType("teachers");
		} else {
			setScheduleType(null);
		}
	}, [pathname]);

	const handleChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
		if (newType !== null) {
			setScheduleType(newType);
		}
	};

	const [year, setYear] = useState("2025");

	const handleYear = (event: SelectChangeEvent) => {
		setYear(event.target.value as string);
	};
	return (
		<div className={styles.top}>
			{isKiosk ? <p>🔹 Режим киоска включен</p> : <p>Режим киоска выключен</p>}
			<div className={styles.btns}>
				<Htag tag="h3">Расписание</Htag>
				<ToggleButtonGroup value={scheduleType} exclusive onChange={handleChange} aria-label="Тип расписания">
					<ToggleButton value="groups" aria-label="По группам">
						<Link href={{ pathname: "/groups", query: { mode } }}>ПО ГРУППАМ</Link>
					</ToggleButton>

					<ToggleButton value="teachers" aria-label="По преподавателям">
						<Link href={{ pathname: "/teachers", query: { mode } }}>ПО ПРЕПОДАВАТЕЛЯМ</Link>
					</ToggleButton>
				</ToggleButtonGroup>
			</div>
			<Box sx={{ minWidth: 120 }}>
				<FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Год</InputLabel>
					<Select labelId="demo-simple-select-label" id="demo-simple-select" value={year} label="Age" onChange={handleYear}>
						<MenuItem value={2023}>2023-2024</MenuItem>
						<MenuItem value={2024}>2024-2025</MenuItem>
						<MenuItem value={2025}>2025-2026</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</div>
	);
};
