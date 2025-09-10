"use client";

import { Htag, Table_comp } from "@/components";
import styles from "./page.module.css";
import { ToggleButton, ToggleButtonGroup, Box, InputLabel, MenuItem, FormControl, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

export default function Home() {
	const [scheduleType, setScheduleType] = useState<string | null>("groups");

	const handleChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
		setScheduleType(newType);
	};

	const [year, setYear] = useState("2025");

	const handleYear = (event: SelectChangeEvent) => {
		setYear(event.target.value as string);
	};

	return (
		<main className={styles.main}>
			<div className={styles.top}>
				<div className={styles.btns}>
					<Htag tag="h3">Расписание</Htag>
					<ToggleButtonGroup value={scheduleType} exclusive onChange={handleChange} aria-label="Тип расписания">
						<ToggleButton value="groups" aria-label="По группам">
							ПО ГРУППАМ
						</ToggleButton>
						<ToggleButton value="classrooms" aria-label="По аудиториям">
							ПО АУДИТОРИЯМ
						</ToggleButton>
						<ToggleButton value="teachers" aria-label="По преподавателям">
							ПО ПРЕПОДАВАТЕЛЯМ
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
			<div className={styles.schedule}>
				<Table_comp />
			</div>
		</main>
	);
}
