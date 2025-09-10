import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Расписание СтИК",
	description: "Расписание ставропольского института кооперации",
};

import { Header, Footer, Aside } from "@/components";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru">
			<body>
				<div className="header">
					<Header />
				</div>
				<div className="aside">
					<Aside />
				</div>
        <div className="main">{children}</div>
				<div className="footer">
					<Footer />
				</div>
			</body>
		</html>
	);
}
