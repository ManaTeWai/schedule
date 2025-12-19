export interface ClassSchedule {
	id: string;
	day: string;
	week: "num" | "den" | "both";
	lessonTime: string;
	subject: string;
	teacher: string;
	room: string;
	lessonType?: string;
}

export interface Group {
	id: string;
	name: string; // short name (clickedText)
	fullName?: string; // optional full display name (e.g. "Группа, Курс, Направление, Факультет")
	url?: string; // optional original URL/landedUrl for teacher pages
	schedule: ClassSchedule[];
}

export interface Teachers_d {
	id: string;
	name: string;
}

export interface GroupsData {
	groups: Group[];
}

export interface TeachersData {
	teachers: Teachers_d[];
}
