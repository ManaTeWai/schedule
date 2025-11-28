"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, useMediaQuery, useTheme, Tabs, Tab } from "@mui/material";
import { ClassSchedule } from "@/types";
import { P, Htag } from "@/components";
import styles from "./ScheduleTable.module.css";
import { useState, useMemo } from "react";

interface ScheduleTableProps {
	schedule: ClassSchedule[];
}

// Вспомогательная функция для получения количества недель между двумя датами
const getWeeksBetweenDates = (startDate: Date, endDate: Date): number => {
	const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
	const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

	// Установим время на 00:00:00 для корректного расчёта
	start.setHours(0, 0, 0, 0);
	end.setHours(0, 0, 0, 0);

	// Определим день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
	// Сделаем поправку, чтобы неделя начиналась с понедельника
	const startDay = (start.getDay() + 6) % 7; // Понедельник = 0
	const endDay = (end.getDay() + 6) % 7;

	// Смещаем даты на ближайший понедельник
	const startMonday = new Date(start);
	startMonday.setDate(start.getDate() - startDay);

	const endMonday = new Date(end);
	endMonday.setDate(end.getDate() - endDay);

	// Вычисляем разницу в миллисекундах между понедельниками
	const diffInMs = endMonday.getTime() - startMonday.getTime();

	// Возвращаем количество полных недель
	return Math.floor(diffInMs / oneWeekInMs);
};

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
		case "Консультация перед экзаменом":
		case "Экзамен устно":
			return "exam";
		case "Курс":
			return "course";
		case "Зачет":
		case "ДЗач":
		case "Зач":
		case "Зачет с оценкой":
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

// Функция для получения времени по номеру пары и дню недели
const getLessonTime = (lessonNumber: string, day: string) => {
	const isWeekend = day === "Суббота";
	const times: Record<string, { weekday: string; weekend: string }> = {
		"1": { weekday: "08:30-10:05", weekend: "08:30-10:05" },
		"2": { weekday: "10:15-11:50", weekend: "10:15-11:50" },
		"3": { weekday: "12:25-14:00", weekend: "12:00-13:35" },
		"4": { weekday: "14:35-16:10", weekend: "14:10-15:45" },
		"5": { weekday: "16:20-17:55", weekend: "15:55-17:30" },
		"6": { weekday: "18:05-19:40", weekend: "17:40-19:15" },
		"7": { weekday: "19:50-21:25", weekend: "19:25-21:00" },
	};

	const time = times[lessonNumber];
	if (!time) return "";

	return isWeekend ? time.weekend : time.weekday;
};

export const ScheduleTable = ({ schedule }: ScheduleTableProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	// Дата начала отсчёта (например, 1 сентября 2025)
	const startOfSemester = useMemo(() => new Date(2025, 8, 1), []);

	// Определяем тип текущей недели (чётная/нечётная от startOfSemester)
	const currentWeeksFromStart = useMemo(() => getWeeksBetweenDates(startOfSemester, new Date()), [startOfSemester]);
	const currentWeekIsNum = currentWeeksFromStart % 2 === 0; // Чётное количество недель - числитель

	// Проверяем, все ли занятия имеют тип "both"
	const allAreBoth = useMemo(() => {
		return schedule.every((item) => item.week === "both");
	}, [schedule]);

	// Если все занятия "both", не показываем табы
	const showTabs = !allAreBoth;

	const [selectedWeek, setSelectedWeek] = useState<"current" | "next">("current");

	// Разделяем занятия по типу недели
	const numSchedule = useMemo(() => schedule.filter((item) => item.week === "num" || item.week === "both"), [schedule]);
	const denSchedule = useMemo(() => schedule.filter((item) => item.week === "den" || item.week === "both"), [schedule]);

	// Выбираем расписание для "Текущей недели" и "Следующей недели" в зависимости от текущего типа недели
	const currentWeekSchedule = useMemo(() => {
		return currentWeekIsNum ? denSchedule : numSchedule;
	}, [currentWeekIsNum, numSchedule, denSchedule]);

	const nextWeekSchedule = useMemo(() => {
		return currentWeekIsNum ? numSchedule : denSchedule;
	}, [currentWeekIsNum, numSchedule, denSchedule]);

	// Выбираем расписание в зависимости от состояния и типа текущей недели
	const filteredSchedule = selectedWeek === "current" ? currentWeekSchedule : nextWeekSchedule;

	// Используем расписание без фильтрации, если все "both"
	const finalSchedule = allAreBoth ? schedule : filteredSchedule;

	// Проверка на пустое расписание *после* всех вычислений
	if (!schedule || schedule.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: "center", mt: 2 }}>
				<Htag tag="h3" color="textSecondary">
					Расписание не найдено
				</Htag>
			</Paper>
		);
	}

	// Группируем выбранное расписание по дням недели для лучшего отображения
	const groupedByDay = finalSchedule.reduce((acc, classItem) => {
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
			{showTabs && (
				<Tabs value={selectedWeek} onChange={(_, val) => setSelectedWeek(val as "current" | "next")} centered textColor="primary" indicatorColor="primary" sx={{ mb: 2 }}>
					<Tab value="current" label="Текущая неделя" />
					<Tab value="next" label="Следующая неделя" />
				</Tabs>
			)}

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
											<P size="medium">Преподаватель</P>
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
											<P size="medium">Преподаватель</P>
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
								{groupedByDay[day].map((classItem) => {
									const fullTime = getLessonTime(classItem.lessonTime, classItem.day);
									return (
										<TableRow key={classItem.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
											{isMobile ? (
												// Мобильная версия
												<>
													<TableCell component="th" scope="row" sx={{ width: "20%", textAlign: "center" }}>
														<P size="medium">{classItem.lessonTime}</P>
														<P size="small">{fullTime}</P>
													</TableCell>
													<TableCell sx={{ width: "50%" }}>
														<P size="large">{classItem.subject}</P>
														<P size="medium">{classItem.teacher}</P>
														<P size="medium">{classItem.room}</P>
													</TableCell>
													<TableCell sx={{ width: "30%", textAlign: "center" }}>
														<Chip label={getTypeLabel(classItem.lessonType)} color={getTypeColor(classItem.lessonType)} size="medium" variant="outlined" />
													</TableCell>
												</>
											) : (
												// Десктопная версия
												<>
													<TableCell sx={{ width: "10%", textAlign: "center" }} component="th" scope="row">
														<P size="medium">{classItem.lessonTime}</P>
														<P size="small">{fullTime}</P>
													</TableCell>
													<TableCell sx={{ width: "55%" }}>
														<P size="large">{classItem.subject}</P>
													</TableCell>
													<TableCell sx={{ width: "15%" }}>
														<P size="medium">{classItem.teacher}</P>
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
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			))}
		</Box>
	);
};
