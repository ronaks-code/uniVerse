import React from "react";
import DayColumn from "./DayColumn";
import { CalendarStyles } from "./CalendarUIClasses";
import "./stylesheet.scss";

const days = ["M", "T", "W", "R", "F"];

class Calendar extends React.Component {
  renderTimeSlots() {
    const timeSlots = ["7 am", "8 am", "9 am", "10 am", "11 am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm", "10 pm"];
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
      <div className={CalendarStyles.calendar}>
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
//     const timeSlots = ["8am", "9am", "10am", "11am", "12 pm", "1 pm", "2 pm", "3 pm", "4 pm", "5 pm", "6 pm", "7 pm", "8 pm", "9 pm"];
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
