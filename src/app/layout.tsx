import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/app/Providers";

export const metadata: Metadata = {
	title: "Расписание СтИК",
	description: "Расписание Ставропольского института кооперации (филиала БУКЭП)",
	openGraph: {
		title: "Расписание СтИК — БУКЭП",
		description: "Удобное расписание занятий для студентов и преподавателей СтИК",
		url: "https://stavikschedule.tw1.su",
		siteName: "Расписание СтИК",
		images: [
			{
				url: "https://stavikschedule.tw1.su/preview.png",
				width: 3360,
				height: 1936,
				alt: "Расписание Ставропольского института кооперации",
			},
		],
		locale: "ru_RU",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Расписание СтИК — БУКЭП",
		description: "Быстрый доступ к актуальному расписанию занятий",
		images: ["https://stavikschedule.tw1.su/preview.png"],
		creator: "@manatewai",
	},
	alternates: {
		canonical: "https://stavikschedule.tw1.su",
	},
	metadataBase: new URL("https://stavikschedule.tw1.su"),
};

import { Header, Footer, Aside } from "@/components";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body>
				<Providers>
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
				</Providers>
			</body>
		</html>
	);
}
