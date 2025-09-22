"use client";

import { Autocomplete, TextField, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import { Select_comp } from "@/components";

// Импортируем локальный JSON
import localData from "@/app/all_data.json"; // путь к твоему JSON файлу

interface ButtonOption {
	title: string;
}

export default function Groups() {
	const [options, setOptions] = useState<ButtonOption[]>([]);
	const [selected, setSelected] = useState<ButtonOption | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// Тут мы просто парсим JSON и вытаскиваем текст
		const parsedOptions: ButtonOption[] = [];

		localData.forEach((firstLayer) => {
			parsedOptions.push({ title: firstLayer.first_layer.text });
		});

		setOptions(parsedOptions);
		setLoading(false);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: ButtonOption | null) => {
		setSelected(value);
		if (value) {
			console.log("Выбрана кнопка:", value.title);
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
				getOptionLabel={(option) => option.title}
				value={selected}
				onChange={handleChange1}
				loading={loading}
				loadingText="Загрузка..."
				noOptionsText="Вариантов нет"
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите факультет"
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
		</main>
	);
}
