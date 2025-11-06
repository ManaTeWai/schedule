"use client";

import type { JSX } from "react";
import styles from "./Select_comp.module.css";
import Link from "next/link";
import { ToggleButton, ToggleButtonGroup, Box, Button } from "@mui/material";
import cn from "classnames";
import { useState, useEffect } from "react";
import { Htag } from "@/components";
import { usePathname } from "next/navigation";
import HouseOutlinedIcon from "@mui/icons-material/HouseOutlined";

export const Select_comp = (): JSX.Element => {
	const pathname = usePathname();
	const [scheduleType, setScheduleType] = useState<string | null>(null);

	useEffect(() => {
		if (pathname === "/groups") {
			setScheduleType("groups");
		} else if (pathname === "/teachers") {
			setScheduleType("teachers");
		} else {
			setScheduleType(null);
		}
	}, [pathname]);

	const handleChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
		if (newType !== null) {
			setScheduleType(newType);
		}
	};

	return (
		<div className={styles.top}>
			<div className={cn(styles.btns, "mb")}>
				<Htag tag="h2">Расписание</Htag>
				<ToggleButtonGroup value={scheduleType} exclusive onChange={handleChange} aria-label="Тип расписания">
					<Link href="/groups">
						<ToggleButton
							value="groups"
							aria-label="По группам"
							sx={{
								borderRight: "1px solid var(--text-color)",
								"&[aria-pressed='true'], &[aria-selected='true']": {
									backgroundColor: "rgba(0, 0, 0, 0.16)",
									color: "var(--text-color)",
									borderRight: "1px solid var(--text-color)",
								},
								"&:hover": {
									backgroundColor: "rgba(0, 0, 0, 0.1)",
								},
							}}
						>
							ПО ГРУППАМ
						</ToggleButton>
					</Link>

					<Link href="/teachers">
						<ToggleButton
							value="teachers"
							aria-label="По преподавателям"
							sx={{
								borderLeft: "1px solid var(--text-color)",
								"&[aria-pressed='true'], &[aria-selected='true']": {
									backgroundColor: "rgba(0, 0, 0, 0.16)",
									color: "var(--text-color)",
								},
								"&:hover": {
									backgroundColor: "rgba(0, 0, 0, 0.1)",
								},
							}}
						>
							ПО ПРЕПОДАВАТЕЛЯМ
						</ToggleButton>
					</Link>
				</ToggleButtonGroup>
			</div>
			{pathname !== "/" && (
				<Box className={"mb"} sx={{ minWidth: 120 }}>
					<Link href="/">
						<Button
							variant="outlined"
							startIcon={<HouseOutlinedIcon fontSize="small" />}
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
							Вернуться на главную
						</Button>
					</Link>
				</Box>
			)}
		</div>
	);
};
