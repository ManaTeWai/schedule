"use client";

import styles from "@/app/page.module.css";
import { useRouter, useParams } from "next/navigation";
import { Autocomplete, TextField, CircularProgress, createFilterOptions } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import type React from "react";

// helper type to satisfy createFilterOptions state param
interface TeacherOption {
	id: string;
	name: string;
	url?: string;
	schedule?: ClassSchedule[];
}

type CreateFilterState = Parameters<ReturnType<typeof createFilterOptions<TeacherOption>>>[1];
import { ClassSchedule } from "@/types";
import { Select_comp } from "@/components";
import localData from "@/data/parsed_data_tr2.json";
import { prepareOptionsTR2, makeSafeId } from "@/utils/prepareOptions";

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

export default function GroupsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const router = useRouter();
	const [options, setOptions] = useState<TeacherOption[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const params = useParams();

	useEffect(() => {
		const prepared = prepareOptionsTR2(localData as RawItem[]).map(
			(item) =>
				({
					id: makeSafeId(String(item.id ?? item.url)),
					name: item.name,
					url: item.url,
					schedule: [],
				} as TeacherOption)
		);
		setOptions(prepared);
		setLoading(false);
	}, []);

	const [selectedOption, setSelectedOption] = useState<TeacherOption | null>(null);
	const [inputValue, setInputValue] = useState<string>("");

	// Синхронизируем выбранную опцию с параметром маршрута
	useEffect(() => {
		if (!options || options.length === 0) return;
		const rawParam = params?.teacherId as string | string[] | undefined;
		// Если параметр отсутствует — НЕ очищаем поле (сохраняем выбор при переходе на другие страницы)
		if (!rawParam) {
			return;
		}

		let rawTeacherIdString = "";
		try {
			if (Array.isArray(rawParam)) {
				if (rawParam.length === 1) rawTeacherIdString = decodeURIComponent(rawParam[0]);
				else rawTeacherIdString = rawParam.join("_");
			} else {
				rawTeacherIdString = decodeURIComponent(rawParam);
			}
		} catch {
			rawTeacherIdString = Array.isArray(rawParam) ? rawParam.join("_") : String(rawParam);
		}

		const safeId = makeSafeId(rawTeacherIdString);
		const match = options.find((o) => o.id === safeId);
		if (match) {
			setSelectedOption(match);
			setInputValue(match.name);
		} else {
			// если преподаватель не найден — очищаем
			setSelectedOption(null);
			setInputValue("");
		}
	}, [params?.teacherId, options]);

	const inputRef = useRef<HTMLInputElement | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: TeacherOption | null) => {
		if (value) {
			setSelectedOption(value);
			setInputValue(value.name);
			// blur after selection to mimic desktop behavior and hide mobile keyboard
			setTimeout(() => inputRef.current?.blur(), 0);
			router.push(`/teachers/${encodeURIComponent(value.id)}`);
		} else {
			setSelectedOption(null);
			setInputValue("");
			setTimeout(() => inputRef.current?.blur(), 0);
			router.push("/teachers"); // или другой маршрут по умолчанию
		}
	};

	return (
		<main className={styles.main}>
			<Select_comp />
			<Autocomplete
				options={options}
				getOptionLabel={(option) => option.name}
				value={selectedOption}
				onChange={handleChange1}
				inputValue={inputValue}
				onInputChange={(event: React.SyntheticEvent, v: string) => setInputValue(v)}
				className="mb"
				loading={loading}
				loadingText="Загрузка..."
				noOptionsText="Вариантов нет"
				openOnFocus
				filterOptions={(opts, state) => {
					// Если мы на странице преподавателя и input совпадает с выбранной опцией, показываем все опции
					if (selectedOption && state.inputValue === selectedOption.name) return opts;
					const defaultFilter = createFilterOptions<TeacherOption>();
					return defaultFilter(opts, state as CreateFilterState);
				}}
				isOptionEqualToValue={(o, v) => o.id === v.id}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите преподавателя"
						variant="outlined"
						inputRef={inputRef}
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
			{children}
		</main>
	);
}
