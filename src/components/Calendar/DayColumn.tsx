import React from "react";
import TimeSlot from "./TimeSlot";
import { CalendarUIClasses } from "./CalendarUIClasses";

interface DayColumnProps {
  day: string;
}

class DayColumn extends React.Component<DayColumnProps> {
  render() {
    const hours = [];
    for (let hour = 7; hour < 22; hour++) {
      hours.push(<TimeSlot key={hour} hour={99} />);
    }

    return (
      <div className={CalendarUIClasses.dayColumn}>
        <div className={CalendarUIClasses.dayHeader}>{this.props.day}</div>
        <div className="grid grid-rows-16 min-w-max">
          {hours}
        </div>
      </div>
    );
  }
}

export default DayColumn;