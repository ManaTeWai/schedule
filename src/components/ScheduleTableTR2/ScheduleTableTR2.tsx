"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, useMediaQuery, useTheme } from "@mui/material";
import { ClassSchedule } from "@/types";
import { P, Htag } from "@/components";
import styles from "../ScheduleTable/ScheduleTable.module.css";
import { useState, useEffect } from "react";

interface ScheduleTableProps {
	teacherUrl?: string;
}

const mapLessonTypeToKey = (lessonType?: string): string => {
	if (!lessonType) return "default";

	switch (lessonType) {
		case "Лекционное занятие":
			return "lecture";
		case "Лек":
			return "lecture";
		case "Практическое занятие":
			return "practice";
		case "ПрЗ":
			return "practice";
		case "Физическая культура":
			return "physical";
		case "Лабораторное занятие":
			return "lab";
		case "Лаб":
			return "lab";
		case "КонсЭкз":
			return "exam";
		case "Экз у":
			return "exam";
		case "КонсИтогЭкз":
			return "exam";
		case "Экз квал":
			return "exam";
		case "Курс":
			return "course";
		case "ДЗач":
			return "pass";
		case "Зач":
			return "pass";
		default:
			return "default";
	}
};

const getTypeColor = (lessonType?: string) => {
	const type = mapLessonTypeToKey(lessonType);
	switch (type) {
		case "lecture":
			return "primary";
		case "practice":
			return "secondary";
		case "physical":
			return "success";
		case "lab":
			return "success";
		case "exam":
			return "warning";
		case "pass":
			return "warning";
		case "course":
			return "warning";
		default:
			return "default";
	}
};

const getTypeLabel = (lessonType?: string) => {
	const type = mapLessonTypeToKey(lessonType);
	switch (type) {
		case "lecture":
			return "Лекция";
		case "practice":
			return "Практика";
		case "physical":
			return "Физкультура";
		case "lab":
			return "Лаб. работа";
		case "exam":
			return "Экзамен";
		case "pass":
			return "Зачет";
		case "course":
			return "Курсовая";
		default:
			return "Другое";
	}
};

export const ScheduleTableTR2 = ({ teacherUrl }: ScheduleTableProps) => {
	const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	useEffect(() => {
		// Загружаем JSON из public/data — чтобы изменения в JSON были видны без пересборки
		fetch("/data/parsed_data_tr2.json")
			.then((res) => res.json())
			.then((data) => {
				if (teacherUrl) {
					const found = (data as Array<{ landedUrl?: string; schedule?: { lessons?: ClassSchedule[] } }>).find((r) => r.landedUrl === teacherUrl);
					setSchedule(found?.schedule?.lessons ?? []);
				} else {
					setSchedule([]);
				}
			})
			.catch(() => {
				setSchedule([]);
			});
	}, [teacherUrl]);

	if (!schedule || schedule.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: "center", mt: 2 }}>
				<Htag tag="h3" color="textSecondary">
					Расписание не найдено
				</Htag>
			</Paper>
		);
	}

	// Группируем занятия по дням недели для лучшего отображения

	// helper: извлекает текст групп из записи занятия
	const getGroupsText = (classItem: unknown): string => {
		const ci = classItem as Record<string, unknown>;
		// 1) если явно есть массив groups
		const groupsField = ci.groups;
		if (Array.isArray(groupsField) && groupsField.length > 0) {
			const parts: string[] = [];
			for (const g of groupsField) {
				if (typeof g === "string") parts.push(g);
				else if (typeof g === "object" && g !== null) {
					const obj = g as Record<string, unknown>;
					if (typeof obj.groupName === "string") parts.push(obj.groupName);
					else if (typeof obj.name === "string") parts.push(obj.name);
				}
			}
			return parts.filter(Boolean).join(", ");
		}

		// 2) единичное поле group
		const groupSingle = ci.group;
		if (groupSingle) {
			if (typeof groupSingle === "string") return groupSingle;
			if (typeof groupSingle === "object" && groupSingle !== null) {
				const obj = groupSingle as Record<string, unknown>;
				if (typeof obj.groupName === "string") return obj.groupName;
				if (typeof obj.name === "string") return obj.name;
			}
		}

		// 3) попробуем извлечь из lessonType — часто там после типа через дефис/тире идут группы
		const lessonType = ci.lessonType;
		if (typeof lessonType === "string") {
			let cleaned = lessonType.replace(/^\s*-+\s*/g, "");
			// убрать распространённые префиксы типов
			cleaned = cleaned.replace(
				/^(Лекционное занятие|Лек|Практическое занятие|ПрЗ|Лабораторное занятие|Лаб|Физическая культура|КонсЭкз|КонсИтогЭкз|Экз квал|Экз у|Курс|ДЗач|Зач)\b\s*/i,
				""
			);
			// если есть разделитель — взять часть справа
			const parts = cleaned
				.split(/[-—:–]/)
				.map((s: string) => s.trim())
				.filter(Boolean);
			if (parts.length > 1) return parts.slice(1).join(" — ");
			// если осталась строка — вернуть её
			if (cleaned.length > 0) return cleaned;
		}

		// 4) попробовать из subject: содержимое в скобках
		const subject = ci.subject;
		if (typeof subject === "string") {
			const m = subject.match(/\(([^)]+)\)/);
			if (m) return m[1];
		}

		return "";
	};

	// Группируем занятия по дням недели для лучшего отображения
	const groupedByDay = schedule.reduce((acc, classItem) => {
		if (!acc[classItem.day]) {
			acc[classItem.day] = [];
		}
		acc[classItem.day].push(classItem);
		return acc;
	}, {} as Record<string, ClassSchedule[]>);

	// Порядок дней недели для корректного отображения
	const dayOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

	const sortedDays = Object.keys(groupedByDay).sort((a, b) => {
		return dayOrder.indexOf(a) - dayOrder.indexOf(b);
	});

	return (
		<Box sx={{ mt: 3 }}>
			{sortedDays.map((day) => (
				<Paper key={day} sx={{ mb: 3, overflow: "hidden" }}>
					<Box sx={{ p: 2, bgcolor: "var(--gray)", borderBottom: "1px solid var(--text-color)", borderColor: "divider" }}>
						<Htag tag="h2">{day}</Htag>
					</Box>
					<TableContainer className={styles.table}>
						<Table sx={!isMobile ? { tableLayout: "fixed" } : {}}>
							{isMobile ? (
								<TableHead sx={{ bgcolor: "var(--gray)" }}>
									<TableRow>
										<TableCell sx={{ width: "20%", textAlign: "center" }}>
											<P size="medium">Время</P>
										</TableCell>
										<TableCell sx={{ width: "50%" }}>
											<P size="medium">Дисциплина</P>
											<P size="medium">Группа (группы)</P>
											<P size="medium">Аудитория</P>
										</TableCell>
										<TableCell sx={{ width: "30%", textAlign: "center" }}>
											<P>Тип занятия</P>
										</TableCell>
									</TableRow>
								</TableHead>
							) : (
								<TableHead sx={{ bgcolor: "var(--gray)" }}>
									<TableRow>
										<TableCell sx={{ width: "10%", textAlign: "center" }}>
											<P size="medium">Время</P>
										</TableCell>
										<TableCell sx={{ width: "45%" }}>
											<P size="medium">Дисциплина</P>
										</TableCell>
										<TableCell sx={{ width: "15%" }}>
											<P size="medium">Группа (группы)</P>
										</TableCell>
										<TableCell sx={{ width: "15%", textAlign: "center" }}>
											<P size="medium">Аудитория</P>
										</TableCell>
										<TableCell sx={{ width: "15%", textAlign: "center" }}>
											<P size="medium">Тип занятия</P>
										</TableCell>
									</TableRow>
								</TableHead>
							)}
							<TableBody>
								{groupedByDay[day].map((classItem) => (
									<TableRow key={classItem.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										{isMobile ? (
											// Мобильная версия
											<>
												<TableCell component="th" scope="row" sx={{ width: "20%", textAlign: "center" }}>
													<P size="medium" html={classItem.lessonTime} />
												</TableCell>
												<TableCell sx={{ width: "50%" }}>
													<P size="large">{classItem.subject}</P>
													<P size="medium">{getGroupsText(classItem)}</P>
													<P size="medium">{classItem.room}</P>
												</TableCell>
												<TableCell sx={{ width: "30%", textAlign: "center" }}>
													<Chip
														label={getTypeLabel(classItem.lessonType)}
														color={getTypeColor(classItem.lessonType)}
														size="medium"
														variant="outlined"
													/>
												</TableCell>
											</>
										) : (
											// Десктопная версия
											<>
												<TableCell sx={{ width: "10%", textAlign: "center" }} component="th" scope="row">
													<P size="medium" html={classItem.lessonTime} />
												</TableCell>
												<TableCell sx={{ width: "55%" }}>
													<P size="large">{classItem.subject}</P>
												</TableCell>
												<TableCell sx={{ width: "15%" }}>
													<P size="medium">{getGroupsText(classItem)}</P>
												</TableCell>
												<TableCell sx={{ width: "10%", textAlign: "center" }}>
													<P size="medium">{classItem.room}</P>
												</TableCell>
												<TableCell sx={{ width: "10%", textAlign: "center" }}>
													<Chip
														label={getTypeLabel(classItem.lessonType)}
														color={getTypeColor(classItem.lessonType)}
														size="medium"
														variant="outlined"
													/>
												</TableCell>
											</>
										)}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			))}
		</Box>
	);
};
