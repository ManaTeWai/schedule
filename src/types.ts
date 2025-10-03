export interface ClassSchedule {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'lecture' | 'practice' | 'lab';
}

export interface Group {
  id: string;
  name: string;
  schedule: ClassSchedule[];
}

export interface GroupsData {
  groups: Group[];
}