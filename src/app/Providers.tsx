"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme";
import { useMemo, useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
			<MuiThemeWrapper>{children}</MuiThemeWrapper>
		</NextThemesProvider>
	);
}

function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const theme = useMemo(
		() => (resolvedTheme === "dark" ? darkTheme : lightTheme),
		[resolvedTheme]
	);

	// 🚫 пока не смонтировано — ничего не рендерим
	if (!mounted) return null;

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}