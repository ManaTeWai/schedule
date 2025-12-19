"use client";

import { Box, Paper, CircularProgress } from "@mui/material";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import styles from "@/app/page.module.css";
import { ScheduleTableTR2, Htag, P } from "@/components";
import { Group, ClassSchedule } from "@/types";
import { makeSafeId, prepareOptionsTR2 } from "@/utils/prepareOptions"; // use TR2 options for teachers
import localData from "@/data/parsed_data_tr2.json";

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

export default function GroupPage() {
	const params = useParams();

	// Нормализуем возможные типы params.groupId: string | string[] | undefined
	const rawGroupIdParam = params?.teacherId as string | string[] | undefined;

	console.log("useParams() вернул:", params); // ВАЖНО: проверь консоль браузера!

	// Hooks + memoized values must run before any early returns.
	const [teacherData, setTeacherData] = useState<Group | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const rawGroupIdArray = useMemo(() => {
		if (!rawGroupIdParam) return undefined;
		return Array.isArray(rawGroupIdParam) ? rawGroupIdParam : [rawGroupIdParam];
	}, [rawGroupIdParam]);

	// We always return a string (possibly empty) from this memo.
	const rawGroupIdString = useMemo(() => {
		if (!rawGroupIdArray || rawGroupIdArray.length === 0) return "";
		try {
			if (rawGroupIdArray.length === 1) {
				const decoded = decodeURIComponent(rawGroupIdArray[0]);
				console.log("Декодированный rawGroupIdString из catch-all:", decoded);
				return decoded;
			}
			console.warn("params.groupId неожиданно длинный:", rawGroupIdArray);
			const joined = rawGroupIdArray.join("_");
			console.log("Склеенный rawGroupIdString:", joined);
			return joined;
		} catch (err) {
			console.error("Ошибка декодирования groupId:", err);
			return rawGroupIdArray.join("_");
		}
	}, [rawGroupIdArray]);

	const safeGroupId = useMemo(() => (rawGroupIdString ? makeSafeId(rawGroupIdString) : ""), [rawGroupIdString]);
	console.log("Финальный safeGroupId для поиска:", safeGroupId);

	useEffect(() => {
		// Логика поиска выполняется один раз при монтировании с найденным safeGroupId
		let mounted = true;
		const search = () => {
			if (!safeGroupId) {
				console.error("safeGroupId пустой после обработки!");
				setError("Внутренняя ошибка: некорректный идентификатор.");
				setLoading(false);
				setTeacherData(null);
				return;
			}

			setLoading(true);
			setError(null);
			const fullData = localData as RawItem[];
			const match = fullData.find((item) => makeSafeId(item.clickedText) === safeGroupId);
			console.log("Поиск match для safeGroupId:", safeGroupId, "Результат:", !!match);
			if (!mounted) return;

			if (match) {
				const options = prepareOptionsTR2(fullData);
				const optionMatch = options.find((o) => makeSafeId(String(o.id)) === makeSafeId(match.clickedText));
				const displayName = optionMatch?.name ?? match.clickedText;

				const preparedTeacher: Group = {
					id: makeSafeId(match.clickedText),
					name: match.clickedText, // short name
					fullName: displayName, // full display name with course/кафедра
					url: match.landedUrl,
					schedule: [],
				};
				setTeacherData(preparedTeacher);
				console.log("Найдены данные для преподавателя:", preparedTeacher.name);
			} else {
				console.warn(`Данные для преподавателя с ID ${safeGroupId} не найдены.`);
				setTeacherData(null);
				setError("Преподаватель не найден.");
			}
			setLoading(false);
		};

		search();
		return () => {
			mounted = false;
		};
	}, [safeGroupId]); // Зависимость теперь от вычисленного safeGroupId, а не от params.groupId напрямую

	// Обновляем title, meta description и Open Graph теги когда есть данные о преподавателе
	useEffect(() => {
		if (!teacherData) return;

		const prevTitle = document.title;
		const prevMeta = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? null;
		const prevOgTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content") ?? null;
		const prevOgDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content") ?? null;

		document.title = `Расписание преподавателя: ${teacherData.name}`;

		// description
		let metaEl = document.querySelector('meta[name="description"]');
		if (!metaEl) {
			metaEl = document.createElement("meta");
			metaEl.setAttribute("name", "description");
			document.head.appendChild(metaEl);
		}
		metaEl.setAttribute("content", teacherData.fullName ?? teacherData.name);

		// og:title
		let ogTitleEl = document.querySelector('meta[property="og:title"]');
		if (!ogTitleEl) {
			ogTitleEl = document.createElement("meta");
			ogTitleEl.setAttribute("property", "og:title");
			document.head.appendChild(ogTitleEl);
		}
		ogTitleEl.setAttribute("content", `Расписание преподавателя: ${teacherData.name}`);

		// og:description
		let ogDescEl = document.querySelector('meta[property="og:description"]');
		if (!ogDescEl) {
			ogDescEl = document.createElement("meta");
			ogDescEl.setAttribute("property", "og:description");
			document.head.appendChild(ogDescEl);
		}
		ogDescEl.setAttribute("content", teacherData.fullName ?? teacherData.name);

		return () => {
			// Восстанавливаем прежние значения
			document.title = prevTitle;

			// description
			if (prevMeta === null) {
				const el = document.querySelector('meta[name="description"]');
				if (el && el.getAttribute("content") === (teacherData.fullName ?? teacherData.name)) el.remove();
			} else {
				const el = document.querySelector('meta[name="description"]');
				if (el) el.setAttribute("content", prevMeta);
			}

			// og:title
			if (prevOgTitle === null) {
				const el = document.querySelector('meta[property="og:title"]');
				if (el && el.getAttribute("content") === `Расписание преподавателя: ${teacherData.name}`) el.remove();
			} else {
				const el = document.querySelector('meta[property="og:title"]');
				if (el) el.setAttribute("content", prevOgTitle);
			}

			// og:description
			if (prevOgDesc === null) {
				const el = document.querySelector('meta[property="og:description"]');
				if (el && el.getAttribute("content") === (teacherData.fullName ?? teacherData.name)) el.remove();
			} else {
				const el = document.querySelector('meta[property="og:description"]');
				if (el) el.setAttribute("content", prevOgDesc);
			}
		};
	}, [teacherData]);

	if (loading) {
		return (
			<div className={styles.main}>
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
					<CircularProgress />
				</Box>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.main}>
				<Paper className={styles.paper} sx={{ textAlign: "center", mt: 2 }}>
					<Htag tag="h2">{error}</Htag>
					<P>Убедитесь, что вы перешли по корректной ссылке.</P>
				</Paper>
			</div>
		);
	}

	if (!teacherData) {
		return (
			<>
				<Paper className={styles.paper} sx={{ textAlign: "center", mt: 2 }}>
					<Htag tag="h2">Преподаватель не найден</Htag>
					<P>Проверьте выбранный элемент и повторите попытку.</P>
				</Paper>
			</>
		);
	}

	return (
		<>
			<Box sx={{ width: "100%" }}>
				<Htag tag="h2">Расписание преподавателя: {teacherData.fullName ?? teacherData.name}</Htag>
				<ScheduleTableTR2 key={teacherData.url} teacherUrl={teacherData?.url} />
			</Box>
		</>
	);
}
