import React from 'react';
import TimeSlot from './TimeSlot';
import { CalendarUIClasses } from './CalendarUIClasses';

interface DayColumnProps {
  day: string;
}

class DayColumn extends React.Component<DayColumnProps> {
  render() {
    const hours = [];
    for (let hour = 8; hour < 22; hour++) {
      hours.push(<TimeSlot key={hour} hour={hour} />);
    }

    return (
      <div className={CalendarUIClasses.dayColumn}>
        <div className={CalendarUIClasses.dayHeader}>{this.props.day}</div>
        {hours}
      </div>
    );
  }
}

export default DayColumn;
