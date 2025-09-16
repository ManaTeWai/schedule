"use client";

import { Autocomplete, TextField, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Select_comp } from "@/components";
import styles from "@/app/page.module.css";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";

interface ButtonOption {
	title: string;
	eventTarget: string;
}

export default function Groups() {
	const [options, setOptions] = useState<ButtonOption[]>([]);
	const [selected, setSelected] = useState<ButtonOption | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchButtons = async () => {
			try {
				setLoading(true);

				const response = await fetch("/api/click"); // Замените на ваш API путь
				if (!response.ok) {
					throw new Error(`Ошибка HTTP: ${response.status}`);
				}

				const data = await response.json();
				setOptions(data.buttons);
			} catch (err) {
				console.error("Ошибка загрузки данных:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchButtons();
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
			<Select_comp />
			<Link href="/">
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
						"&.MuiButton-outlined": {
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
						label="Выберите кафедру"
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
				sx={{
					width: { xs: "100%", sm: 500 },
				}}
			/>
		</main>
	);
}
