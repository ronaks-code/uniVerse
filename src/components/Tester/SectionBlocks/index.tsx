import React from 'react';

import { abbreviateLocation, periodToString } from '../utils/misc';
import TimeBlocks from '../TimeBlocks';

import './stylesheet.scss';

export type SectionBlocksProps = {
  className?: string;
  crn: string;
  sizeInfo: number;
};

export default function SectionBlocks({
  className,
  crn,
  sizeInfo,
}: SectionBlocksProps): React.ReactElement | null {
  const section = {
    id: '123',
    course: {
      id: 'CS101',
      title: 'Introduction to Computer Science',
    },
    meetings: [
      {
        period: {
          start: 540,
          end: 600,
        },
        days: ['M', 'W', 'F'],
        where: 'Building A',
        instructors: ['John Doe'],
      },
      {
        period: {
          start: 660,
          end: 720,
        },
        days: ['T', 'R'],
        where: 'Building B',
        instructors: ['Jane Smith'],
      },
    ],
  };

  return (
    <div>
      {section.meetings.map((meeting, i) => {
        const { period } = meeting;
        if (period == null) return null;

        const contentHeader = [
          {
            className: 'course-id',
            content: section.course.id,
          },
          {
            className: 'section-id',
            content: section.id,
          },
        ];

        const contentBody = [
          {
            className: 'period',
            content: periodToString(period),
          },
          {
            className: 'where',
            content: abbreviateLocation(meeting.where),
          },
          {
            className: 'instructors',
            content: meeting.instructors.join(', '),
          },
        ];

        return (
          <TimeBlocks
            className={className}
            period={period}
            days={meeting.days}
            // contentHeader={contentHeader}
            // contentBody={contentBody}
            sizeInfo={sizeInfo}
            key={`${crn}-${i}`}
          />
        );
      })}
    </div>
  );
}
