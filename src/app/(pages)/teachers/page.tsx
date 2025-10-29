"use client";

import { Select_comp, ScheduleTable } from "@/components";
import { Autocomplete, TextField, CircularProgress, Box, Typography, Paper } from "@mui/material";
import styles from "@/app/page.module.css";
import { prepareOptions } from "@/utils/prepareOptions";
import localData from "@/data/parsed_data_tr2.json";
import { useState, useEffect } from "react";
import { Group, ClassSchedule } from "@/types";

interface RawItem {
	level: number;
	clickedText: string;
	from: string;
	landedUrl: string;
	title: string;
	schedule?: {
		hasSchedule: boolean;
		message: string;
		lessons: ClassSchedule[];
	};
}

export default function Groups() {
	const [options, setOptions] = useState<Group[]>([]);
	const [selected, setSelected] = useState<Group | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		// Преобразуем JSON в список для Autocomplete
		const prepared = prepareOptions(localData as RawItem[]).map((item) => ({
			id: item.url,
			name: item.name,
			schedule: [],
		}));

		setOptions(prepared);
		setLoading(false);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: Group | null) => {
		if (!value) {
			setSelected(null);
			return;
		}

		// Находим объект с расписанием по URL
		const fullData = localData as RawItem[];
		const match = fullData.find((item) => item.landedUrl === value.id && item.schedule?.hasSchedule);

		if (match?.schedule?.lessons) {
			setSelected({
				...value,
				schedule: match.schedule.lessons.map((lesson, index) => ({
					id: index.toString(),
					day: lesson.day,
					lessonTime: lesson.lessonTime,
					lessonType: lesson.lessonType,
					subject: lesson.subject,
					room: lesson.room,
					teacher: lesson.teacher,
				})),
			});
		} else {
			setSelected({ ...value, schedule: [] });
		}

		console.log("Выбрана группа:", value.name);
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
					<ScheduleTable schedule={selected.schedule} />
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
