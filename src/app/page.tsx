"use client";

import { Htag, Table_comp } from "@/components";
import styles from "./page.module.css";
import {
	ToggleButton,
	ToggleButtonGroup,
	Box,
	InputLabel,
	MenuItem,
	FormControl,
	Select,
	SelectChangeEvent,
	Autocomplete,
	TextField,
	CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";

interface ButtonOption {
	title: string;
	eventTarget: string;
}

export default function Home() {
	const [scheduleType, setScheduleType] = useState<string | null>("groups");

	const handleChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
		setScheduleType(newType);
	};

	const [year, setYear] = useState("2025");

	const handleYear = (event: SelectChangeEvent) => {
		setYear(event.target.value as string);
	};

	const [options, setOptions] = useState<ButtonOption[]>([]);
	const [selected, setSelected] = useState<ButtonOption | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);
		fetch("/api/btns") // вызываем твой API, который парсит кнопки верхнего уровня
			.then((res) => res.json())
			.then((data: { buttons: ButtonOption[] }) => {
				setOptions(data.buttons);
			})
			.finally(() => setLoading(false));
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: ButtonOption | null) => {
		setSelected(value);
		if (value) {
			console.log("Выбрана кнопка:", value.title, "eventTarget:", value.eventTarget);
			// здесь можно вызывать /api/click с value.eventTarget для следующего уровня
		}
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
				<Autocomplete
					options={options}
					getOptionLabel={(option) => option.title}
					value={selected}
					onChange={handleChange1}
					loading={loading}
					loadingText="Загрузка..."
					noOptionsText="Вариантов нет"
					renderInput={(params) => (
						<TextField
							{...params}
							label="Выберите дисциплину"
							variant="outlined"
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<>
										{loading ? <CircularProgress color="inherit" size={20} /> : null}
										{params.InputProps.endAdornment}
									</>
								),
							}}
						/>
					)}
					sx={{ width: 500 }}
				/>
				{/* <Table_comp /> */}
			</div>
		</main>
	);
}
