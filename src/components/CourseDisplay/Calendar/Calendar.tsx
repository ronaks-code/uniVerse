import React from "react";
import DayColumn from "./DayColumn";
import { CalendarStyles } from "./CalendarUIClasses";
import "./stylesheet.scss";

const days = ["M", "T", "W", "R", "F"];

class Calendar extends React.Component {
  renderTimeSlots() {
    const timeSlots = ["7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm"];
    return timeSlots.map((time) => (
      <div className={CalendarStyles.time} key={time}>
        <span className={CalendarStyles.label}>{time}</span>
      </div>
    ));
  }

  renderDayColumns() {
    return days.map((day) => (
      <DayColumn key={day} day={day} />
    ));
  }

  render() {
    return (
      <div className={`${CalendarStyles.calendar}`}>
        <div className={CalendarStyles.times}>
          {this.renderTimeSlots()}
        </div>
        <div className={CalendarStyles.days}>
          {this.renderDayColumns()}
        </div>
        <div className={CalendarStyles.meetings}></div>
      </div>
    );
  }
}

export default Calendar;


// import React from "react";
// import DayColumn from "./DayColumn";
// import TimeSlot from "./TimeSlot";
// import { CalendarUIClasses } from "./CalendarUIClasses";
// import "./stylesheet.scss";

// const days = ["M", "T", "W", "R", "F"];

// class Calendar extends React.Component {
//   renderTimeSlots() {
//     const timeSlots = ["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm"];
//     return timeSlots.map((time) => (
//       <div className={CalendarUIClasses.time} key={time}>
//         <span className={CalendarUIClasses.label}>{time}</span>
//       </div>
//     ));
//   }

//   renderDayColumns() {
//     return days.map((day) => (
//       <DayColumn key={day} day={day} />
//     ));
//   }

//   render() {
//     return (
//       <div className={`${CalendarUIClasses.calendar}`}>
//         <div className={`${CalendarUIClasses.times}`}>
//           {this.renderTimeSlots()}
//         </div>
//         <div className={`${CalendarUIClasses.days}`}>
//           {this.renderDayColumns()}
//         </div>
//         <div className="meetings"></div>
//       </div>
//     );
//   }
// }

// export default Calendar;
