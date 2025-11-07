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

// Аналогичная функция для данных tr2: формирует список преподавателей в формате
// "Преподаватель, кафедра" (parent через поле `from`). Возвращает [{ name, url }]
export const prepareOptionsTR2 = (items: RawItem[]): Option[] => {
	const normalize = (u?: string) => {
		if (!u) return "";
		const trimmed = (u || "").trim();
		try {
			const url = new URL(trimmed);
			url.searchParams.delete("k");
			const pathname = url.pathname.replace(/\/+$/, "");
			const search = url.search ? url.search : "";
			return decodeURIComponent(url.origin + pathname + search);
		} catch {
			return trimmed.replace(/([?&])k=\d+/g, "").replace(/\/+$/, "");
		}
	};

	// карта нормализованного landedUrl -> элемент только для уровня 1 (кафедры)
	const deptMap = new Map<string, RawItem>();
	items.filter((it) => it.level === 1).forEach((it) => deptMap.set(normalize(it.landedUrl), it));

	const result: Option[] = [];

	// Берём элементы уровня 2 (преподаватели) и для каждого добавляем parent.clickedText если есть
	items
		.filter((i) => i.level === 2)
		.forEach((t) => {
			const target = normalize(t.from);
			// сначала пробуем точное совпадение среди кафедр
			let parent = deptMap.get(target);
			if (!parent) {
				// резервный поиск по включению — только среди кафедр
				parent = items.find((it) => it.level === 1 && (target.includes(normalize(it.landedUrl)) || normalize(it.landedUrl).includes(target)));
			}

			const nameParts = [t.clickedText, parent?.clickedText].filter(Boolean);
			result.push({ name: nameParts.join(", "), url: t.landedUrl });
		});

	return result;
};
