interface RawItem {
	level: number;
	clickedText: string;
	from: string;
	landedUrl: string;
}

interface Option {
	name: string;
	url: string;
}

export const prepareOptions = (items: RawItem[]): Option[] => {
	// Нормализуем URL: удаляем параметр k и лишние завершающие слеши, декодируем
	const normalize = (u?: string) => {
		if (!u) return "";
		try {
			const url = new URL(u);
			url.searchParams.delete("k");
			const pathname = url.pathname.replace(/\/+$/, "");
			const search = url.search ? url.search : "";
			return decodeURIComponent(url.origin + pathname + search);
		} catch {
			return (u || "")
				.replace(/([?&])k=\d+/g, "")
				.trim()
				.replace(/\/+$/, "");
		}
	};

	const findByLandedAndLevel = (target?: string, level?: number) => {
		if (!target) return undefined;
		const t = normalize(target);
		const exact = items.find((i) => (level === undefined || i.level === level) && normalize(i.landedUrl) === t);
		if (exact) return exact;
		const included = items.find(
			(i) => (level === undefined || i.level === level) && (t.includes(normalize(i.landedUrl)) || normalize(i.landedUrl).includes(t))
		);
		return included;
	};

	const result: Option[] = [];

	// Берём элементы уровня 3 (группы) и ищем их родителей строго по уровням: 2 -> 1 -> 0
	items
		.filter((i) => i.level === 3)
		.forEach((group) => {
			const course = findByLandedAndLevel(group.from, 2);
			const specialty = findByLandedAndLevel(course?.from, 1);
			const faculty = findByLandedAndLevel(specialty?.from, 0);

			// Формируем имя в порядке: Группа / Курс / Направление / Факультет
			const nameParts = [group.clickedText, course?.clickedText, specialty?.clickedText, faculty?.clickedText].filter(Boolean);

			result.push({
				name: nameParts.join(", "),
				url: group.landedUrl,
			});
		});

	return result;
};
