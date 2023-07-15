import React from 'react';

import { classes } from '../utils/misc';
import { Period } from '../types';

import './stylesheet.scss';

export type TimeBlocksProps = {
  className?: string;
  period: Period;
  days: string[];
  sizeInfo: number;
};

export default function TimeBlocks({
  className,
  period,
  days,
  sizeInfo,
}: TimeBlocksProps): React.ReactElement {
  return (
    <div className={classes('TimeBlocks', className)}>
      {days.map((day) => (
        <div
          className="meeting"
          style={{
            top: '0%',
            left: '0%',
            height: '100%',
            width: '100%',
          }}
          key={`${day}-${period.start}-${period.end}`}
        />
      ))}
    </div>
  );
}
