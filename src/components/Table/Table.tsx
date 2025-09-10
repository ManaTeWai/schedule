import { type JSX } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
							<TableCell>1</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">08:30-10:05</TableCell>
							<TableCell align="right">08:30-10:05</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>2</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">10:15-11:50</TableCell>
							<TableCell align="right">10:15-11:50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center" colSpan={3}>
								Перерыв (35 минут) 11:50-12:25
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>3</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">12:25-14:00</TableCell>
							<TableCell align="right">12:00-13:35</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="center" colSpan={2}>
								Перерыв (35 минут)
							</TableCell>
							<TableCell align="right">14:00-14:35</TableCell>
							<TableCell align="right">13:35-14:10</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>4</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">14:35-16:10</TableCell>
							<TableCell align="right">14:10-14:55</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>5</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">16:20-17:55</TableCell>
							<TableCell align="right">15:55-17:30</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>6</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">18:05-19:40</TableCell>
							<TableCell align="right">17:40-19:15</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>7</TableCell>
							<TableCell align="right">пара</TableCell>
							<TableCell align="right">19:50-21:25</TableCell>
							<TableCell align="right">19:25-21:00</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};
