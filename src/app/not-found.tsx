import styles from "./page.module.css";
import { Htag } from "@/components";
import Link from "next/link";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";
import Button from "@mui/material/Button";

export default function NotFound() {
	return (
		<main className={styles.not_found}>
			<div>
				<Htag tag="h1">404 - Страница не найдена</Htag>
				<Link href="/">
					<Button
						variant="outlined"
						startIcon={<HouseOutlinedIcon fontSize="small" />}
						sx={{
							border: "1px solid rgba(0, 0, 0, 0.12)",
							color: "var(--text-color)",
							backgroundColor: "transparent",
							"&:hover": {
								color: "rgba(0, 0, 0, 0.87)",
								backgroundColor: "rgba(0, 0, 0, 0.08)",
								border: "1px solid rgba(0, 0, 0, 0.12)",
							},
							"&.MuiButton-outlined": {
								border: "1px solid rgba(0, 0, 0, 0.12)",
							},
						}}
					>
						Вернуться на главную
					</Button>
				</Link>
			</div>
		</main>
	);
}
