"use client";

import { Select_comp, ScheduleTable } from "@/components";
import { Autocomplete, TextField, CircularProgress, Box, Typography, Paper } from "@mui/material";
import styles from "@/app/page.module.css";
import localData from "@/data/parsed_data_tr2.json";
import { useState, useEffect } from "react";
import { ClassSchedule } from "@/types";
import { prepareOptionsTR2 } from "@/utils/prepareOptions";

interface RawItem {
	level: number;
	clickedText: string;
	landedUrl: string;
	from: string;
	schedule?: {
		hasSchedule: boolean;
		message?: string;
		lessons?: ClassSchedule[];
	};
}

interface Option {
	name: string;
	url: string;
}

export default function Teachers() {
	const [options, setOptions] = useState<Option[]>([]);
	const [selected, setSelected] = useState<Option | null>(null);
	const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		const raw = localData as RawItem[];
		const prepared = prepareOptionsTR2(raw);
		setOptions(prepared);
		setLoading(false);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: Option | null) => {
		if (!value) {
			setSelected(null);
			setSelectedSchedule(null);
			return;
		}

		setSelected(value);
		// Найдём в исходных данных расписание по landedUrl
		const raw = localData as RawItem[];
		const found = raw.find((r) => r.landedUrl === value.url);
		setSelectedSchedule(found?.schedule?.lessons ?? null);
		console.log("Выбран преподаватель:", value.name);
	};
	return (
		<main className={styles.main}>
			<Select_comp />
			<Autocomplete
				options={options}
				getOptionLabel={(option) => option.name}
				value={selected}
				onChange={handleChange1}
				className={"mb"}
				loading={loading}
				loadingText="Загрузка..."
				noOptionsText="Вариантов нет"
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите преподавателя"
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
				sx={{ width: { xs: "100%", sm: 500 } }}
			/>
			{selected && (
				<Box sx={{ width: "100%" }}>
					<Typography variant="h5" gutterBottom>
						Расписание преподавателя: {selected.name}
					</Typography>
					<ScheduleTable schedule={selectedSchedule ?? []} mode="teachers" />
				</Box>
			)}

			{!selected && (
				<Paper className={styles.paper} sx={{ textAlign: "center", mt: 2 }}>
					<Typography variant="h6" color="textSecondary">
						Выберите преподавателя для отображения расписания
					</Typography>
				</Paper>
			)}
		</main>
	);
}
