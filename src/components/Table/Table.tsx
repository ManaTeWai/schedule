import type { JSX } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export const Table_comp = (): JSX.Element => {
	return (
		<Paper sx={{ width: "100%" }}>
			<TableContainer>
				<Table stickyHeader aria-label="table">
					<TableHead>
						<TableRow>
							<TableCell align="center" colSpan={3}>
								Понедельник-пятница
							</TableCell>
							<TableCell align="center">Суббота</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell width={15}>1</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>08:30-10:05</TableCell>
							<TableCell align="right">08:30-10:05</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>2</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>10:15-11:50</TableCell>
							<TableCell align="right">10:15-11:50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center" colSpan={2}>
								Перерыв (35 минут)
							</TableCell>
							<TableCell>11:50-12:25</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>3</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>12:25-14:00</TableCell>
							<TableCell align="right">12:00-13:35</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center" colSpan={2}>
								Перерыв (35 минут)
							</TableCell>
							<TableCell>14:00-14:35</TableCell>
							<TableCell>13:35-14:10</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>4</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>14:35-16:10</TableCell>
							<TableCell align="right">14:10-14:55</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>5</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>16:20-17:55</TableCell>
							<TableCell align="right">15:55-17:30</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>6</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>18:05-19:40</TableCell>
							<TableCell align="right">17:40-19:15</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={15}>7</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>19:50-21:25</TableCell>
							<TableCell align="right">19:25-21:00</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};
