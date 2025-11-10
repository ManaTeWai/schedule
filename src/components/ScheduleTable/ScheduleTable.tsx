"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, useMediaQuery, useTheme } from "@mui/material";
import { ClassSchedule } from "@/types";
import { P, Htag } from "@/components";
import styles from "./ScheduleTable.module.css";

interface ScheduleTableProps {
	schedule: ClassSchedule[];
	// optional mode: when 'teachers', show 'группа(группы)' column instead of 'преподаватель'
	mode?: "teachers" | "groups";
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
		default:
			return "Другое";
	}
};

export const ScheduleTable = ({ schedule, mode = "groups" }: ScheduleTableProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
	const groupedByDay = schedule.reduce((acc, classItem) => {
		if (!acc[classItem.day]) {
			acc[classItem.day] = [];
		}
		acc[classItem.day].push(classItem);
		return acc;
	}, {} as Record<string, ClassSchedule[]>);

	// Порядок дней недели для корректного отображения
	const dayOrder = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

	// helper to extract group(s) info from lesson object (data from teachers JSON)
	const getGroupText = (ci: ClassSchedule): string => {
		const r = ci as unknown as Record<string, unknown>;
		// r.groups might be string[] or string, r.group or r.groupName might be present
		if (Array.isArray(r.groups)) return (r.groups as string[]).join(", ");
		if (typeof r.group === "string" && r.group.trim()) return r.group as string;
		if (typeof r.groupName === "string" && r.groupName.trim()) return r.groupName as string;
		if (typeof r.groups === "string" && (r.groups as string).trim()) return r.groups as string;

		// Fallback: try to extract group codes from lessonType suffixes. Many lessonType values look like
		// "Практическое занятие ЮРм С ГП" or "Лекционное занятие Ю С ПО" — we remove the leading
		// lesson-type phrase and return the remainder as group text.
		const lt = r.lessonType as unknown as string | undefined;
		if (lt && lt.trim()) {
			// remove common Russian lesson type prefixes
			const cleaned = lt
				.replace(
					/^\s*(Лекционное занятие|Практическое занятие|Лабораторное занятие|Консультация перед экзаменом|Экзамен устно|КонсЭкз|КонсИтогЭкз|Зачет с оценкой|Зачет|Лек|ПрЗ)\s*/i,
					""
				)
				.trim();
			// if remaining part contains letters/digits (group abbreviations), return it
			if (cleaned && /[A-Za-zА-Яа-я0-9Ёё]/.test(cleaned)) return cleaned;
		}

		// As a last resort, try to see if subject contains a trailing group in parentheses, e.g. "... (гр. 101)"
		const subj = r.subject as unknown as string | undefined;
		if (subj) {
			const m = subj.match(/\(([^)]+)\)\s*$/);
			if (m && m[1]) return m[1].trim();
		}

		return "";
	};

	const renderTableForDay = (day: string, classItems: ClassSchedule[]) => (
		<Paper key={`${day}-${classItems[0]?.id ?? Math.random()}`} sx={{ mb: 3, overflow: "hidden" }}>
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
									<P size="medium">{mode === "teachers" ? "Группа(группы)" : "Преподаватель"}</P>
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
									<P size="medium">{mode === "teachers" ? "Группа(группы)" : "Преподаватель"}</P>
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
						{classItems.map((classItem) => (
							<TableRow key={classItem.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
								{isMobile ? (
									<>
										<TableCell component="th" scope="row" sx={{ width: "20%", textAlign: "center" }}>
											<P size="medium" html={classItem.lessonTime} />
										</TableCell>
										<TableCell sx={{ width: "50%" }}>
											<P size="large">{classItem.subject}</P>
											{mode === "teachers" ? <P size="medium">{getGroupText(classItem)}</P> : <P size="medium">{classItem.teacher}</P>}
											<P size="medium">{classItem.room}</P>
										</TableCell>
										<TableCell sx={{ width: "30%", textAlign: "center" }}>
											<Chip label={getTypeLabel(classItem.lessonType)} color={getTypeColor(classItem.lessonType)} size="medium" variant="outlined" />
										</TableCell>
									</>
								) : (
									<>
										<TableCell sx={{ width: "10%", textAlign: "center" }} component="th" scope="row">
											<P size="medium" html={classItem.lessonTime} />
										</TableCell>
										<TableCell sx={{ width: "55%" }}>
											<P size="large">{classItem.subject}</P>
										</TableCell>
										<TableCell sx={{ width: "15%" }}>
											{mode === "teachers" ? <P size="medium">{getGroupText(classItem)}</P> : <P size="medium">{classItem.teacher}</P>}
										</TableCell>
										<TableCell sx={{ width: "10%", textAlign: "center" }}>
											<P size="medium">{classItem.room}</P>
										</TableCell>
										<TableCell sx={{ width: "10%", textAlign: "center" }}>
											<Chip label={getTypeLabel(classItem.lessonType)} color={getTypeColor(classItem.lessonType)} size="medium" variant="outlined" />
										</TableCell>
									</>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);

	return (
		<Box sx={{ mt: 3 }}>
			{dayOrder.map((day) => {
				const classItems = groupedByDay[day] || [];
				if (!classItems || classItems.length === 0) return null;
				return renderTableForDay(day, classItems);
			})}
		</Box>
	);
};
