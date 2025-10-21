export interface ClassSchedule {
	id: string;
	day: string;
	lessonTime: string;
	subject: string;
	teacher: string;
	room: string;
	lessonType?: string;
}

export interface Group {
	id: string;
	name: string;
	schedule: ClassSchedule[];
}

export interface GroupsData {
	groups: Group[];
}
