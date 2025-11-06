"use client";

import { Htag, P } from "@/components";
import styles from "./page.module.css";
import Button from "@mui/material/Button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<main className={styles.not_found}>
			<div>
				<Htag tag="h1" className={"mb"}>500 - Ошибка сервера</Htag>
				<P>Что-то пошло не так. Пожалуйста, попробуйте позже.</P>
				<Button
					onClick={() => reset()}
					variant="outlined"
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
					Попробовать снова
				</Button>
			</div>
		</main>
	);
}
