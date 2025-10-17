"use client";

import { Autocomplete, TextField, CircularProgress, Button, Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import { Select_comp, ScheduleTable } from "@/components";
import { Group, ClassSchedule } from "@/types";
import { prepareOptions } from "@/utils/prepareOptions";
import localData from "@/data/parsed_data_tr1.json";

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
					time: lesson.lessonTime || lesson.time || "",
					subject: lesson.subject,
					type: (["lecture", "practice", "lab"].includes((lesson.lessonType || lesson.type)?.toLowerCase?.())
						? (lesson.lessonType || lesson.type)?.toLowerCase?.()
						: "lecture") as "lecture" | "practice" | "lab",
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

			<Link href="/" className={styles.mb}>
				<Button
					variant="outlined"
					startIcon={<HouseOutlinedIcon fontSize="small" />}
					sx={{
						border: "1px solid rgba(0, 0, 0, 0.12)",
						color: "var(--text-color)",
						backgroundColor: "transparent",
						"&:hover": {
							color: "rgba(0, 0, 0, 0.87)",
							backgroundColor: "rgba(0, 0, 0, 0.08)",
							border: "1px solid rgba(0, 0, 0, 0.12)",
						},
					}}
				>
					Вернуться на главную
				</Button>
			</Link>

			<Autocomplete
				options={options}
				getOptionLabel={(option) => option.name}
				value={selected}
				onChange={handleChange1}
				className={styles.mb}
				loading={loading}
				loadingText="Загрузка..."
				noOptionsText="Вариантов нет"
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите группу"
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
						Расписание группы: {selected.name}
					</Typography>
					<ScheduleTable schedule={selected.schedule} />
				</Box>
			)}

			{!selected && (
				<Paper className={styles.paper} sx={{ textAlign: "center", mt: 2 }}>
					<Typography variant="h6" color="textSecondary">
						Выберите группу для отображения расписания
					</Typography>
				</Paper>
			)}
		</main>
	);
}
