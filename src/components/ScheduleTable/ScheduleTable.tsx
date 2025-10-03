import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Typography } from "@mui/material";
import { ClassSchedule } from "@/types";

interface ScheduleTableProps {
	schedule: ClassSchedule[];
}

const getTypeColor = (type: string) => {
	switch (type) {
		case "lecture":
			return "primary";
		case "practice":
			return "secondary";
		case "lab":
			return "success";
		default:
			return "default";
	}
};

const getTypeLabel = (type: string) => {
	switch (type) {
		case "lecture":
			return "Лекция";
		case "practice":
			return "Практика";
		case "lab":
			return "Лаб. работа";
		default:
			return type;
	}
};

export const ScheduleTable = ({ schedule }: ScheduleTableProps) => {
	if (!schedule || schedule.length === 0) {
		return (
			<Paper sx={{ p: 3, textAlign: "center", mt: 2 }}>
				<Typography variant="h6" color="textSecondary">
					Расписание не найдено
				</Typography>
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
						<Typography variant="h6" component="h3">
							{day}
						</Typography>
					</Box>
					<TableContainer>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ width: "20%" }}>Время</TableCell>
									<TableCell sx={{ width: "25%" }}>Дисциплина</TableCell>
									<TableCell sx={{ width: "25%" }}>Преподаватель</TableCell>
									<TableCell sx={{ width: "15%" }}>Аудитория</TableCell>
									<TableCell sx={{ width: "15%" }}>Тип занятия</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{groupedByDay[day].map((classItem) => (
									<TableRow key={classItem.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
										<TableCell component="th" scope="row">
											{classItem.time}
										</TableCell>
										<TableCell>{classItem.subject}</TableCell>
										<TableCell>{classItem.teacher}</TableCell>
										<TableCell>{classItem.room}</TableCell>
										<TableCell>
											<Chip label={getTypeLabel(classItem.type)} color={getTypeColor(classItem.type)} size="small" variant="outlined" />
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
