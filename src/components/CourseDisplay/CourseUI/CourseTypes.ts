export type Instructor = {
  name: string;
};

export type MeetingTime = {
  meetDays: string[];
  meetTimeBegin: string;
  meetTimeEnd: string;
  meetBuilding: string;
  meetRoom: string | number;
};

export type Section = {
  number: string;
  display: string;
  credits: number;
  deptName: string;
  instructors: Instructor[];
  meetTimes: MeetingTime[];
  // openSeats: number;
  finalExam: string;
};

export type Course = {
  code: string;
  name: string;
  courseId: string;
  termInd: string;
  description: string;
  prerequisites: string;
  sections: Section[];
};

export type SectionWithCourse = Section & Course;
