import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Расписание СтИК",
  description: "Расписание Ставропольского института кооперации (филиала БУКЭП)",
  openGraph: {
    title: "Расписание СтИК — БУКЭП",
    description: "Удобное расписание занятий для студентов и преподавателей СтИКа",
    url: "https://stavikschedule.tw1.su",
    siteName: "Расписание СтИК",
    images: [
      {
        url: "https://stavikschedule.tw1.su/preview.png", // ссылка на картинку предпросмотра
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
    description: "Быстрый доступ к актуальному расписанию занятий.",
    images: ["https://stavikschedule.tw1.su/preview.png"],
    creator: "@stavikschedule",
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
