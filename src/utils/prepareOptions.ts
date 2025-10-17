// utils/prepareOptions.ts
import data from "@/app/parsed_data_tr1.json";

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
  const levelMap = new Map<number, RawItem[]>();

  // группируем по level
  items.forEach((item) => {
    if (!levelMap.has(item.level)) levelMap.set(item.level, []);
    levelMap.get(item.level)!.push(item);
  });

  const result: Option[] = [];

  // ищем пути от 0 → 1 → 2 → 3
  items
    .filter((i) => i.level === 3)
    .forEach((group) => {
      const course = items.find((i) => i.landedUrl === group.from);
      const specialty = items.find((i) => i.landedUrl === course?.from);
      const faculty = items.find((i) => i.landedUrl === specialty?.from);

      const nameParts = [
        group.clickedText,
        course?.clickedText,
        specialty?.clickedText,
        faculty?.clickedText,
      ].filter(Boolean);

      result.push({
        name: nameParts.join(", "),
        url: group.landedUrl,
      });
    });

  return result;
};