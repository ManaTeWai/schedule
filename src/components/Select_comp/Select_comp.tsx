"use client";

import type { JSX } from "react";
import styles from "./Select.module.css";
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
				<Htag tag="h3">Расписание</Htag>
				<ToggleButtonGroup value={scheduleType} exclusive onChange={handleChange} aria-label="Тип расписания">
					<Link href="/groups">
						<ToggleButton value="groups" aria-label="По группам">
							ПО ГРУППАМ
						</ToggleButton>
					</Link>

					<Link href="/teachers">
						<ToggleButton value="teachers" aria-label="По преподавателям">
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
								border: "1px solid rgba(0, 0, 0, 0.12)",
								color: "var(--text-color)",
								backgroundColor: "transparent",
								"&:hover": {
									color: "rgba(0, 0, 0, 0.87)",
									backgroundColor: "rgba(0, 0, 0, 0.08)",
									border: "1px solid rgba(0, 0, 0, 0.12)",
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
