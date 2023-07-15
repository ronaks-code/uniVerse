import React from "react";
interface TimeSlotProps {
  hour: number;
}

class TimeSlot extends React.Component<TimeSlotProps> {
  render() {
    const standardTime = convertHourToStandard(this.props.hour);
    const dynamicSize =
      this.props.hour >= 20 ? "time-slot" : "";

    return (
      <div className={`${dynamicSize}`}>
        {standardTime}
      </div>
    );
  }
}

export default TimeSlot;

function convertHourToStandard(hour: number): string {
  if (hour === 0) {
    return `12 am`;
  } else if (hour < 12) {
    return `${hour} am`;
  } else if (hour === 12) {
    return `12 pm`;
  } else if (hour === 99) {
    return '';
  } else {
    return `${hour % 12} pm`;
  }
}


// import React from "react";
// import { CalendarUIClasses } from "./CalendarUIClasses";

// interface TimeSlotProps {
//   hour: number;
// }

// class TimeSlot extends React.Component<TimeSlotProps> {
//   render() {
//     const standardTime = convertHourToStandard(this.props.hour);
//     const dynamicSize =
//       this.props.hour >= 20 ? CalendarUIClasses.timeSlot : "";

//     return (
//       <div className={`${dynamicSize}`}>
//         {standardTime}
//       </div>
//     );
//   }
// }

// export default TimeSlot;

// function convertHourToStandard(hour: number): string {
//   if (hour === 0) {
//     return `12 am`;
//   } else if (hour < 12) {
//     return `${hour} am`;
//   } else if (hour === 12) {
//     return `12 pm`;
//   } else if (hour === 99) {
//     return '';
//   } else {
//     return `${hour % 12} pm`;
//   }
// }
