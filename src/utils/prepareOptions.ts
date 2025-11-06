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

	// Построим карту нормализованного landedUrl -> элемент для быстрого подъёма по цепочке
	const urlMap = new Map<string, RawItem>();
	items.forEach((it) => urlMap.set(normalize(it.landedUrl), it));

	const result: Option[] = [];

	// Для каждой группы (level === 3) поднимаемся по цепочке from -> parent.from -> ...
	items
		.filter((i) => i.level === 3)
		.forEach((group) => {
			const parents: RawItem[] = [];
			let cur = group.from;
			let safety = 0;
			while (cur && safety < 10) {
				const p = urlMap.get(normalize(cur));
				if (!p) break;
				parents.push(p);
				cur = p.from;
				safety++;
			}

			// parents[0] — immediate parent (обычно курс), [1] — направление, [2] — факультет
			const course = parents[0];
			const specialty = parents[1];
			const faculty = parents[2];

			// Формируем имя в порядке: Группа / Курс / Направление / Факультет
			const nameParts = [group.clickedText, course?.clickedText, specialty?.clickedText, faculty?.clickedText].filter(Boolean);

			result.push({
				name: nameParts.join(", "),
				url: group.landedUrl,
			});
		});

	return result;
};
