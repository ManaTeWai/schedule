"use client";

import { Autocomplete, TextField, CircularProgress, Button, Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import { Select_comp, ScheduleTable } from "@/components";
import { Group, ClassSchedule } from "@/types";

// Импортируем локальный JSON
import localData from "@/app/all_data.json"; // путь к твоему JSON файлу

interface JsonDataItem {
	first_layer: {
		id: string;
		text: string;
		schedule: ClassSchedule[];
	};
}

export default function Groups() {
	const [options, setOptions] = useState<Group[]>([]);
	const [selected, setSelected] = useState<Group | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// Преобразуем данные из JSON в формат Group[]
		const parsedOptions: Group[] = (localData as JsonDataItem[]).map((item) => ({
			id: item.first_layer.id,
			name: item.first_layer.text,
			schedule: item.first_layer.schedule || [],
		}));

		setOptions(parsedOptions);
		setLoading(false);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: Group | null) => {
		setSelected(value);
		if (value) {
			console.log("Выбрана группа:", value.name);
		}
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
				<Paper sx={{ p: 3, textAlign: "center", mt: 2, width: "100%" }}>
					<Typography variant="h6" color="textSecondary">
						Выберите группу для отображения расписания
					</Typography>
				</Paper>
			)}
		</main>
	);
}
