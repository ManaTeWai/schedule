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
	// Нормализуем URL для сопоставления — убираем параметр k, конечные пробелы и т.п.
	const normalize = (u?: string) => (u || "").trim().replace(/([?&])k=\d+$/, "");

	const findByLanded = (target?: string) => {
		if (!target) return undefined;
		const t = normalize(target);
		// 1) точное совпадение нормализованных URL
		const exact = items.find((i) => normalize(i.landedUrl) === t);
		if (exact) return exact;
		// 2) если точного нет — поиск по включению одного в другой (защитный матч)
		const included = items.find((i) => t.includes(normalize(i.landedUrl)) || normalize(i.landedUrl).includes(t));
		return included;
	};

	const result: Option[] = [];

	// Берём элементы уровня 3 (группы) и ищем их родителей по цепочке
	items
		.filter((i) => i.level === 3)
		.forEach((group) => {
			const course = findByLanded(group.from);
			const specialty = findByLanded(course?.from);
			const faculty = findByLanded(specialty?.from);

			// Формируем читаемое имя от верхнего уровня к нижнему
			const nameParts = [faculty?.clickedText, specialty?.clickedText, course?.clickedText, group.clickedText].filter(Boolean);

			result.push({
				name: nameParts.join(" / "),
				url: group.landedUrl,
			});
		});

	return result;
};
