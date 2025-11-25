import type { JSX } from "react";
import styles from "./Aside.module.css";
import Image from "next/image";
import Link from "next/link";
import { Divider, ListItemIcon, MenuList, MenuItem, ListItemText } from "@mui/material";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { P } from "@/components";

export const Aside = (): JSX.Element => {
	return (
		<aside className={styles.aside}>
			<Link href="/">
				<Image src="/logo_curcule.png" alt="лого" width={75} height={75} />
			</Link>

			<MenuList sx={{ width: 320, maxWidth: "100%" }}>
				<Divider />
				<Link href="https://rasp.bukep.ru/Default.aspx?idFil=10006">
					<MenuItem>
						<ListItemIcon>
							<CalendarMonthOutlinedIcon
								fontSize="small"
								sx={{
									color: "var(--text-color)",
								}}
							/>
						</ListItemIcon>
						<ListItemText>
							<P>Старое расписание</P>
						</ListItemText>
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
						<ListItemText>
							<P>Сайт института</P>
						</ListItemText>
					</MenuItem>
				</Link>
				<Divider />
				<Link href="https://t.me/ManaTeWai?text=Здравствуйте,%20хочу%20сообщить%20об%20ошибке%20в%20электронном%20расписании.">
					<MenuItem>
						<ListItemIcon>
							<ReportProblemIcon
								fontSize="small"
								sx={{
									color: "var(--text-color)",
								}}
							/>
						</ListItemIcon>
						<ListItemText>
							<P>Сообщение об ошибке</P>
						</ListItemText>
					</MenuItem>
				</Link>
			</MenuList>
		</aside>
	);
};
