import type { JSX } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import styles from "./Table.module.css";

export const Table_comp = (): JSX.Element => {
	return (
		<Paper sx={{ width: "100%" }}>
			<TableContainer>
				<Table stickyHeader aria-label="table" className={styles.main_table}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ bgcolor: "grey.100" }} colSpan={2}></TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }} align="left">Понедельник-пятница</TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }} align="right">Суббота</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell width={1}>1</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>08:30-10:05</TableCell>
							<TableCell align="right">08:30-10:05</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>2</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>10:15-11:50</TableCell>
							<TableCell align="right">10:15-11:50</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ bgcolor: "grey.100" }} align="left" colSpan={2}>
								Перерыв (35 минут)
							</TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }}>11:50-12:25</TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }}></TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>3</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>12:25-14:00</TableCell>
							<TableCell align="right">12:00-13:35</TableCell>
						</TableRow>
						<TableRow>
							<TableCell sx={{ bgcolor: "grey.100" }} align="left" colSpan={2}>
								Перерыв (35 минут)
							</TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }}>14:00-14:35</TableCell>
							<TableCell sx={{ bgcolor: "grey.100" }} align="right">13:35-14:10</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>4</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>14:35-16:10</TableCell>
							<TableCell align="right">14:10-14:55</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>5</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>16:20-17:55</TableCell>
							<TableCell align="right">15:55-17:30</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>6</TableCell>
							<TableCell>пара</TableCell>
							<TableCell>18:05-19:40</TableCell>
							<TableCell align="right">17:40-19:15</TableCell>
						</TableRow>
						<TableRow>
							<TableCell width={1}>7</TableCell>
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
