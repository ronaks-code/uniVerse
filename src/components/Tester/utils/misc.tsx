import { Period } from '../types';
import { DAYS, PALETTE, PNG_SCALE_FACTOR } from '../constants';

export const periodToString = (period: Period | undefined): string =>
  period != null
    ? `${timeToString(period.start, false)} - ${timeToString(period.end)}`
    : 'TBA';

export const timeToString = (
  time: number,
  ampm = true,
  leadingZero = false
): string => {
  const hour = (time / 60) | 0;
  const minute = time % 60;
  const h = hour > 12 ? hour - 12 : hour;
  const hh = leadingZero ? `${hour}`.padStart(2, '0') : h;
  const mm = `${minute}`.padStart(2, '0');
  const A = `${hour < 12 ? 'a' : 'p'}m`;
  return ampm ? `${hh}:${mm} ${A}` : `${hh}:${mm}`;
};

export const abbreviateLocation = (location: string): string => {
  const LOCATION_ABBREVIATIONS: Record<string, string> = {
    '760 Spring St NW': '760 Spring St',
    '760 Spring Street': '760 Spring St',
    'Clough Commons': 'CULC',
    'Clough UG Learning Commons': 'CULC',
    'Coll of Computing': 'CCB',
    'College of Computing': 'CCB',
    'D. M. Smith': 'DM Smith',
    'D.M. Smith': 'DM Smith',
    'Engr Science & Mech': 'ESM',
    'Engineering Sci and Mechanics': 'ESM',
    'Ford Environmental Sci & Tech': 'ES&T',
    'Ford Environmental Sci &amp; Tech': 'ES&T',
    'Howey (Physics)': 'Howey',
    'Howey Physics': 'Howey',
    'Instr Center': 'IC',
    'Instructional Center': 'IC',
    'J. Erskine Love Manufacturing': 'Love (MRDC II)',
    'Klaus Advanced Computing': 'Klaus',
    'Manufacture Rel Discip Complex': 'MRDC',
    'Molecular Sciences & Engr': 'MoSE',
    'Molecular Sciences & Engineering': 'MoSE',
    'Paper Tricentennial': 'Paper',
    'Scheller College of Business': 'Scheller',
    'Sustainable Education': 'SEB',
    'U A Whitaker Biomedical Engr': 'Whitaker',
    'West Village Dining Commons': 'West Village',
    'Guggenheim Aerospace': 'Guggenheim',
  };

  for (const [full, abbrev] of Object.entries(LOCATION_ABBREVIATIONS)) {
    if (location.startsWith(full)) {
      const withoutFull = location.substring(full.length).trim();
      return `${abbrev} ${withoutFull}`;
    }
  }

  return location;
};

export const hasConflictBetweenMeetings = (
  meeting1: any,
  meeting2: any
): boolean | undefined =>
  meeting1.period &&
  meeting2.period &&
  DAYS.some(
    (day: string) => meeting1.days.includes(day) && meeting2.days.includes(day)
  ) &&
  meeting1.period.start < meeting2.period.end &&
  meeting2.period.start < meeting1.period.end;

export const classes = (
  ...classList: (string | boolean | null | undefined)[]
): string => classList.filter((c) => c).join(' ');

export const timeToShortString = (time: number): string => {
  const hour = (time / 60) | 0;
  return `${hour > 12 ? hour - 12 : hour}${hour < 12 ? 'a' : 'p'}m`;
};

export const stringToTime = (string: string): number => {
  if (
    string === 'null' ||
    string.length < 3 ||
    string.length > 4 ||
    Number.isNaN(parseInt(string, 10))
  ) {
    return 0;
  }

  const [hour, minute] = [
    string.substring(0, string.length - 2),
    string.substring(string.length - 2, string.length),
  ];
  return parseInt(hour, 10) * 60 + parseInt(minute, 10);
};

export const daysToString = (days: readonly string[] | string[]): string => {
  const set = new Set<string>(days);
  return DAYS.filter((day: string) => set.has(day)).join('');
};

export const getRandomColor = (): string => {
  const colors = PALETTE.flat();
  const index = (Math.random() * colors.length) | 0;
  return colors[index] ?? '#333333';
};
