"use client";

import { Htag, P } from "@/components";
import styles from "./page.module.css";
import Button from "@mui/material/Button";
import ReplayIcon from "@mui/icons-material/Replay";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<main className={styles.not_found}>
			<div>
				<Htag tag="h1" className="mb">
					500 - Ошибка сервера
				</Htag>
				<P className="mb">Что-то пошло не так. Пожалуйста, попробуйте позже. The End of YoRHa.</P>
				<Button
					onClick={() => reset()}
					variant="outlined"
					startIcon={<ReplayIcon fontSize="small" />}
					sx={{
						border: "1px solid var(--text-color)",
						color: "var(--text-color)",
						backgroundColor: "transparent",
						"&:hover": {
							backgroundColor: "rgba(0, 0, 0, 0.08)",
							border: "1px solid var(--text-color)",
						},
					}}
				>
					Попробовать снова
				</Button>
			</div>
		</main>
	);
}
