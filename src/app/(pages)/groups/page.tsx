import { Htag } from "@/components";
import { Paper } from "@mui/material";
import styles from "./page.module.css";

export default function Groups() {
	return (
		<main className={styles.main}>
			<Paper className={styles.paper} sx={{ textAlign: "center", mt: 2 }}>
				<Htag tag="h2">Выберите группу для отоброжения расписания.</Htag>
			</Paper>
		</main>
	);
}
