import slugify from "slugify";

interface RawItem {
	level: number;
	clickedText: string;
	from: string;
	landedUrl: string;
}

interface Option {
	name: string;
	url: string;
	id: string; // optional id (clickedText / original identifier)
}

export function makeSafeId(str: string): string {
  return slugify(str, {
    lower: true,
    strict: true,   // убирает всё, кроме [a-z0-9-]
    locale: "ru",   // корректная транслитерация кириллицы
  });
}

export const prepareOptions = (items: RawItem[]): Option[] => {
	// Нормализуем URL: удаляем параметр k и лишние завершающие слеши, декодируем
	const normalize = (u?: string) => {
		// Для tr2 важно сохранять параметр k (идентификатор кафедры/преподавателя),
		// иначе разные кафедры будут нормализованы в один и тот же ключ.
		if (!u) return "";
		const trimmed = (u || "").trim();
		try {
			const url = new URL(trimmed);
			// Не удаляем k — он нужен для уникальности кафедр/преподавателей
			const pathname = url.pathname.replace(/\/+$/, "");
			const search = url.search ? url.search : "";
			return decodeURIComponent(url.origin + pathname + search);
		} catch {
			return trimmed.replace(/\/+$/, "");
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
				id: makeSafeId(group.clickedText),
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
			// Для tr2 сохраняем параметр k — он важен для уникальности
			const pathname = url.pathname.replace(/\/+$/, "");
			const search = url.search ? url.search : "";
			return decodeURIComponent(url.origin + pathname + search);
		} catch {
			return trimmed.replace(/\/+$/, "");
		}
	};

	// Определим элементы-преподаватели по наличию schedule (более надёжно чем жёсткий номер уровня)
	const teacherItems = items.filter((it) => Boolean((it as unknown as Record<string, unknown>).schedule));
	// Вычислим уровень преподавателя (если он присутствует в данных)
	const teacherLevel = teacherItems.length > 0 ? teacherItems[0].level : 1;

	// карта нормализованного landedUrl -> элемент для возможных кафедр/родительских узлов
	// Берём элементы с уровнем меньше уровня преподавателя (fallback — level === 0)
	const deptMap = new Map<string, RawItem>();
	items.filter((it) => (typeof it.level === "number" ? it.level < teacherLevel : it.level === 0)).forEach((it) => deptMap.set(normalize(it.landedUrl), it));

	const result: Option[] = [];

	// helper: try extract k param from a url-like string
	const tryGetK = (s?: string) => {
		if (!s) return null;
		try {
			const u = new URL(s.trim());
			return u.searchParams.get("k");
		} catch {
			const m = String(s).match(/[?&]k=(\d+)/);
			return m ? m[1] : null;
		}
	};

	// pattern to detect teacher titles so we don't accidentally treat a teacher as department
	const teacherTitleRe = /\b(проф\.|доц\.|преп\.|ст\. преп\.|мастер пр\.об\.|ассистент)\b/i;

	// Берём элементы, у которых есть schedule (преподаватели) и для каждого добавляем parent.clickedText если есть
	// ПЛЮС элементы с level === 1 и title преподавателя (даже без расписания)
	const teachersWithSchedule = items.filter((i) => Boolean((i as unknown as Record<string, unknown>).schedule));
	const teachersWithoutSchedule = items.filter((i) => i.level === 1 && teacherTitleRe.test(i.clickedText) && !Boolean((i as unknown as Record<string, unknown>).schedule));
	const allTeachers = [...teachersWithSchedule, ...teachersWithoutSchedule];

	allTeachers.forEach((t) => {
		const target = normalize(t.from);
		// сначала пробуем точное совпадение среди кафедр
		let parent = deptMap.get(target);
		if (!parent) {
			// попытаемся найти по параметру k в from или в landedUrl (если присутствует)
			const kFrom = tryGetK(t.from) || tryGetK(t.landedUrl);
			if (kFrom) {
				parent = items.find((it) => it.level < teacherLevel && String(it.landedUrl).includes("k=" + kFrom));
			}

			// резервный поиск по включению — среди элементов меньшего уровня
			if (!parent) {
				parent = items.find((it) => it.level < teacherLevel && (target.includes(normalize(it.landedUrl)) || normalize(it.landedUrl).includes(target)));
			}
		}

		// защитный фильтр: если parent выглядит как преподаватель по title, отбросим
		if (parent && teacherTitleRe.test(parent.clickedText)) {
			parent = undefined as unknown as RawItem;
		}

		const nameParts = [t.clickedText, parent?.clickedText].filter(Boolean);
		result.push({ name: nameParts.join(", кафедра "), url: t.landedUrl, id: t.clickedText });
	});

	return result;
};