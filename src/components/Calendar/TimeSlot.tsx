import React from "react";
import { CalendarUIClasses } from "./CalendarUIClasses";

interface TimeSlotProps {
  hour: number;
}

class TimeSlot extends React.Component<TimeSlotProps> {
  render() {
    const standardTime = convertHourToStandard(this.props.hour);
    const dynamicSize =
      this.props.hour >= 20 ? CalendarUIClasses.timeSlot : "";

    return (
      <div className={`${CalendarUIClasses.timeSlot} ${dynamicSize}`}>
        {standardTime}
      </div>
    );
  }
}

export default TimeSlot;

function convertHourToStandard(hour: number): string {
  if (hour === 0) {
    return `12 AM`;
  } else if (hour < 12) {
    return `${hour} AM`;
  } else if (hour === 12) {
    return `12 PM`;
  } else {
    return `${hour % 12} PM`;
  }
}
