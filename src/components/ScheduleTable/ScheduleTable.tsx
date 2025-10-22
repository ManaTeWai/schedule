"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, useMediaQuery, useTheme } from "@mui/material";
import { ClassSchedule } from "@/types";
import { P, Htag } from "@/components";
import styles from './ScheduleTable.module.css'

interface ScheduleTableProps {
	schedule: ClassSchedule[];
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
		default:
			return "Другое";
	}
};

export const ScheduleTable = ({ schedule }: ScheduleTableProps) => {
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

	const sortedDays = Object.keys(groupedByDay).sort((a, b) => {
		return dayOrder.indexOf(a) - dayOrder.indexOf(b);
	});

	return (
		<Box sx={{ mt: 3 }}>
			{sortedDays.map((day) => (
				<Paper key={day} sx={{ mb: 3, overflow: "hidden" }}>
					<Box sx={{ p: 2, bgcolor: "grey.100", borderBottom: "1px solid", borderColor: "divider" }}>
						<Htag tag="h3">{day}</Htag>
					</Box>
					<TableContainer className={styles.table}>
						<Table sx={!isMobile ? { tableLayout: "fixed" } : {}}>
							{isMobile ? (
								<TableHead sx={{ bgcolor: "grey.100" }}>
									<TableRow>
										<TableCell sx={{ width: "20%" }}>Время</TableCell>
										<TableCell sx={{ width: "50%" }}>
											<P size="medium">Дисциплина</P>
											<P size="small">Преподаватель</P>
											<P size="small">Аудитория</P>
										</TableCell>
										<TableCell sx={{ width: "30%", textAlign: "center" }}>Тип занятия</TableCell>
									</TableRow>
								</TableHead>
							) : (
								<TableHead sx={{ bgcolor: "grey.100" }}>
									<TableRow>
										<TableCell sx={{ width: "20%" }}>Время</TableCell>
										<TableCell sx={{ width: "25%" }}>Дисциплина</TableCell>
										<TableCell sx={{ width: "25%" }}>Преподаватель</TableCell>
										<TableCell sx={{ width: "15%", textAlign: "center" }}>Аудитория</TableCell>
										<TableCell sx={{ width: "15%", textAlign: "center" }}>Тип занятия</TableCell>
									</TableRow>
								</TableHead>
							)}
							<TableBody>
								{groupedByDay[day].map((classItem) => (
										<TableRow key={classItem.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
											{isMobile ? (
												// Мобильная версия
												<>
													<TableCell component="th" scope="row" sx={{ width: "20%" }}>
														{classItem.lessonTime}
													</TableCell>
													<TableCell sx={{ width: "50%" }}>
														<P size="medium">{classItem.subject}</P>
														<P size="small">{classItem.teacher}</P>
														<P size="small">{classItem.room}</P>
													</TableCell>
													<TableCell sx={{ width: "30%", textAlign: "center" }}>
														<Chip
															label={getTypeLabel(classItem.lessonType)}
															color={getTypeColor(classItem.lessonType)}
															size="small"
															variant="outlined"
														/>
													</TableCell>
												</>
											) : (
												// Десктопная версия
												<>
													<TableCell sx={{ width: "20%" }} component="th" scope="row">
														{classItem.lessonTime}
													</TableCell>
													<TableCell sx={{ width: "25%" }}>{classItem.subject}</TableCell>
													<TableCell sx={{ width: "25%" }}>{classItem.teacher}</TableCell>
													<TableCell sx={{ width: "15%", textAlign: "center" }}>{classItem.room}</TableCell>
													<TableCell sx={{ width: "15%", textAlign: "center" }}>
														<Chip
															label={getTypeLabel(classItem.lessonType)}
															color={getTypeColor(classItem.lessonType)}
															size="small"
															variant="outlined"
														/>
													</TableCell>
												</>
											)}
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			))}
		</Box>
	);
};
