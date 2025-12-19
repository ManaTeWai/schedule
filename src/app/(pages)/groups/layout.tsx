"use client";

import styles from "@/app/page.module.css";
import { useRouter, useParams } from "next/navigation";
import { Autocomplete, TextField, CircularProgress, createFilterOptions } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import type React from "react";

// helper type to satisfy createFilterOptions state param
type CreateFilterState = Parameters<ReturnType<typeof createFilterOptions<Group>>>[1];
import { Group, ClassSchedule } from "@/types";
import { Select_comp } from "@/components";
import localData from "@/data/parsed_data_tr1.json";
import { prepareOptions, makeSafeId } from "@/utils/prepareOptions";

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
	const [options, setOptions] = useState<Group[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const params = useParams();

	useEffect(() => {
		const prepared = prepareOptions(localData as RawItem[]).map((item) => ({
			id: item.id ?? item.url,
			name: item.name,
			schedule: [],
		}));
		setOptions(prepared);
		setLoading(false);
	}, []);

	// Синхронизируем выбранную опцию с параметром маршрута
	useEffect(() => {
		if (!options || options.length === 0) return;
		const rawParam = params?.groupId as string | string[] | undefined;
		if (!rawParam) {
			setSelectedOption(null);
			setInputValue("");
			return;
		}

		let rawGroupIdString = "";
		try {
			if (Array.isArray(rawParam)) {
				if (rawParam.length === 1) rawGroupIdString = decodeURIComponent(rawParam[0]);
				else rawGroupIdString = rawParam.join("_");
			} else {
				rawGroupIdString = decodeURIComponent(rawParam);
			}
		} catch {
			rawGroupIdString = Array.isArray(rawParam) ? rawParam.join("_") : String(rawParam);
		}

		const safeId = makeSafeId(rawGroupIdString);
		const match = options.find((o) => o.id === safeId);
		if (match) {
			setSelectedOption(match);
			setInputValue(match.name);
		} else {
			// если группа не найдена — очищаем
			setSelectedOption(null);
			setInputValue("");
		}
	}, [params?.groupId, options]);

	const [selectedOption, setSelectedOption] = useState<Group | null>(null);
	const [inputValue, setInputValue] = useState<string>("");

	const inputRef = useRef<HTMLInputElement | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleChange1 = (_: any, value: Group | null) => {
		if (value) {
			setSelectedOption(value);
			setInputValue(value.name);
			// blur to remove focus and virtual keyboard on mobile
			setTimeout(() => inputRef.current?.blur(), 0);
			router.push(`/groups/${encodeURIComponent(value.id)}`);
		} else {
			setSelectedOption(null);
			setInputValue("");
			setTimeout(() => inputRef.current?.blur(), 0);
			router.push("/groups"); // или другой маршрут по умолчанию
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
					// Если мы на странице группы и input совпадает с выбранной опцией, показываем все опции
					if (selectedOption && state.inputValue === selectedOption.name) return opts;
					const defaultFilter = createFilterOptions<Group>();
					return defaultFilter(opts, state as CreateFilterState);
				}}
				isOptionEqualToValue={(o, v) => o.id === v.id}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Выберите группу"
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
