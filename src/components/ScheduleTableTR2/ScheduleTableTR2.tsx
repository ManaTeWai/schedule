"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Chip,
	Box,
	useMediaQuery,
	useTheme,
	Tabs,
	Tab,
} from "@mui/material";
import { useState } from "react";
import { ClassSchedule } from "@/types";
import { P, Htag } from "@/components";
import localData from "@/data/parsed_data_tr2.json";
import styles from "../ScheduleTable/ScheduleTable.module.css";

interface ScheduleTableProps {
	teacherUrl?: string;
}

const mapLessonTypeToKey = (lessonType?: string): string => {
	if (!lessonType) return "default";
	switch (lessonType) {
		case "Лекционное занятие":
		case "Лек":
		case "Лекционное занятие б":
		case "Лекционное занятие у":
		case "Лекционное занятие у у":
		case "Лекционное занятие б у":
			return "lecture";
		case "Практическое занятие":
		case "Практическое занятие б":
		case "Практическое занятие у":
		case "Практическое занятие у у":
		case "Практическое занятие б у":
		case "ПрЗ":
			return "practice";
		case "Физическая культура":
			return "physical";
		case "Лабораторное занятие":
		case "Лаб":
			return "lab";
		case "КонсЭкз":
		case "Экз у":
		case "КонсИтогЭкз":
		case "Экз квал":
			return "exam";
		case "Курс":
			return "course";
		case "ДЗач":
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
		case "lab":
			return "success";
		case "exam":
		case "pass":
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
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [selectedWeek, setSelectedWeek] = useState<"current" | "next">("current");

	// Извлекаем данные преподавателя из JSON
	let currentWeek: ClassSchedule[] = [];
	let nextWeek: ClassSchedule[] = [];

	if (teacherUrl) {
		const raw = localData as Array<{
			landedUrl?: string;
			schedule?: {
				currentWeek?: ClassSchedule[];
				nextWeek?: ClassSchedule[];
			};
			clickedText?: string;
		}>;

		const found = raw.find((r) => r.landedUrl === teacherUrl);
		currentWeek = found?.schedule?.currentWeek ?? [];
		nextWeek = found?.schedule?.nextWeek ?? [];
	}

	const activeSchedule = selectedWeek === "current" ? currentWeek : nextWeek;

	if (!activeSchedule || activeSchedule.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: "center", mt: 2 }}>
				<Htag tag="h3" color="textSecondary">
					Расписание не найдено
				</Htag>
			</Paper>
		);
	}

	// группировка по дням
	const groupedByDay = activeSchedule.reduce((acc, classItem) => {
		if (!acc[classItem.day]) acc[classItem.day] = [];
		acc[classItem.day].push(classItem);
		return acc;
	}, {} as Record<string, ClassSchedule[]>);

	const dayOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
	const sortedDays = Object.keys(groupedByDay).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getGroupsText = (classItem: any): string => {
		if (Array.isArray(classItem.groups) && classItem.groups.length > 0) return classItem.groups.join(", ");
		return "";
	};

	return (
		<Box sx={{ mt: 3 }}>
			{/* Переключатель недели */}
			<Tabs value={selectedWeek} onChange={(_, val) => setSelectedWeek(val)} centered textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
				<Tab value="current" label="Текущая неделя" />
				<Tab value="next" label="Следующая неделя" />
			</Tabs>

			{sortedDays.map((day) => (
				<Paper key={day} sx={{ mb: 3, overflow: "hidden" }}>
					<Box sx={{ p: 2, bgcolor: "var(--gray)", borderBottom: "1px solid var(--text-color)", borderColor: "divider" }}>
						<Htag tag="h2">{day}</Htag>
					</Box>
					<TableContainer className={styles.table}>
						<Table sx={!isMobile ? { tableLayout: "fixed" } : {}}>
							<TableHead sx={{ bgcolor: "var(--gray)" }}>
								<TableRow>
									<TableCell sx={{ width: "10%", textAlign: "center" }}>
										<P size="medium">Время</P>
									</TableCell>
									<TableCell sx={{ width: "45%" }}>
										<P size="medium">Дисциплина</P>
									</TableCell>
									<TableCell sx={{ width: "15%" }}>
										<P size="medium">Группа(ы)</P>
									</TableCell>
									<TableCell sx={{ width: "15%", textAlign: "center" }}>
										<P size="medium">Аудитория</P>
									</TableCell>
									<TableCell sx={{ width: "15%", textAlign: "center" }}>
										<P size="medium">Тип занятия</P>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{groupedByDay[day].map((classItem, idx) => (
									<TableRow key={idx}>
										<TableCell sx={{ textAlign: "center" }}>
											<P size="medium" html={classItem.lessonTime} />
										</TableCell>
										<TableCell>
											<P size="large">{classItem.subject}</P>
										</TableCell>
										<TableCell>
											<P size="medium">{getGroupsText(classItem)}</P>
										</TableCell>
										<TableCell sx={{ textAlign: "center" }}>
											<P size="medium">{classItem.room}</P>
										</TableCell>
										<TableCell sx={{ textAlign: "center" }}>
											<Chip label={getTypeLabel(classItem.lessonType)} color={getTypeColor(classItem.lessonType)} size="medium" variant="outlined" />
										</TableCell>
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
