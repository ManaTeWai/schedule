import type { JSX } from "react";
import styles from "./Aside.module.css";
import Image from "next/image";
import Link from "next/link";
import { Divider, ListItemIcon, MenuList, MenuItem, ListItemText } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

export const Aside = (): JSX.Element => {
	return (
		<aside className={styles.aside}>
			<Image src="/logo_curcule.png" alt="лого" width={75} height={75} />

			<MenuList sx={{ width: 320, maxWidth: "100%" }}>
				<Divider />
				<Link href="/">
					<MenuItem>
						<ListItemIcon>
							<CalendarMonthOutlinedIcon
								fontSize="small"
								sx={{
									color: "var(--text-color)",
								}}
							/>
						</ListItemIcon>
						<ListItemText>Расписание</ListItemText>
					</MenuItem>
				</Link>
				<Divider />
				<Link href="https://stavik.ru/">
					<MenuItem>
						<ListItemIcon>
							<ExitToAppOutlinedIcon
								fontSize="small"
								sx={{
									color: "var(--text-color)",
								}}
							/>
						</ListItemIcon>
						<ListItemText>Основной сайт</ListItemText>
					</MenuItem>
				</Link>
			</MenuList>
		</aside>
	);
};
