import React from "react";

import SectionBlocks from "../SectionBlocks";

import "./stylesheet.scss";

export type CalendarProps = {
  className?: string;
  overlayCrns?: string[];
};

export default function Calendar({
  className,
  overlayCrns,
}: CalendarProps): React.ReactElement {
  const crns = overlayCrns;

  const hiddenSections: any[] = [];

  return (
    // <div className={className}>
    //   <div className="meetings">
    //     {crns.map((crn) => (
    //       <SectionBlocks
    //         key={crn}
    //         crn={crn}
    //         sizeInfo={5}
    //       />
    //     ))}
    //   </div>
    //   {hiddenSections.length > 0 && (
    //     <div className="hidden-sections">
    //       *Sections not shown in view:{' '}
    //       {hiddenSections
    //         .map((section) => `${section.course.id} (${section.id})`)
    //         .join(', ')
    //         .trim()}
    //     </div>
    //   )}
    // </div>

    <div className="">
      <div className="Calendar calendar">
        <div className="times">
          <div className="time">
            <span className="label">8am</span>
          </div>
          <div className="time">
            <span className="label">9am</span>
          </div>
          <div className="time">
            <span className="label">10am</span>
          </div>
          <div className="time">
            <span className="label">11am</span>
          </div>
          <div className="time">
            <span className="label">12pm</span>
          </div>
          <div className="time">
            <span className="label">1pm</span>
          </div>
          <div className="time">
            <span className="label">2pm</span>
          </div>
          <div className="time">
            <span className="label">3pm</span>
          </div>
          <div className="time">
            <span className="label">4pm</span>
          </div>
          <div className="time">
            <span className="label">5pm</span>
          </div>
          <div className="time">
            <span className="label">6pm</span>
          </div>
          <div className="time">
            <span className="label">7pm</span>
          </div>
          <div className="time">
            <span className="label">8pm</span>
          </div>
          <div className="time">
            <span className="label">9pm</span>
          </div>
        </div>
        <div className="days">
          <div className="day">
            <span className="label">M</span>
          </div>
          <div className="day">
            <span className="label">T</span>
          </div>
          <div className="day">
            <span className="label">W</span>
          </div>
          <div className="day">
            <span className="label">R</span>
          </div>
          <div className="day">
            <span className="label">F</span>
          </div>
        </div>
        <div className="meetings">
          <div>
            <div className="TimeBlocks">
              <div>
                <button
                  className="meeting dark-content default"
                  id=":rpo:"
                  tabIndex={0}
                  style={{
                    top: "21.4286%",
                    left: "0%",
                    height: "5.95238%",
                    width: "20%",
                    // "--meeting-color": "#808080",
                  }}
                >
                  <div className="meeting-wrapper">
                    <div className="ids">
                      <span className="course-id">CS 1100&nbsp;</span>
                      <span className="section-id">A1&nbsp;</span>
                    </div>
                    <span className="period">11:00 - 11:50 am</span>
                    <span className="where">IC 103</span>
                    <span className="instructors">Troy Peace</span>
                  </div>
                </button>
                <div
                  role="tooltip"
                  className="react-tooltip styles-module_tooltip__mnnfp styles-module_dark__xNqje tooltip styles-module_clickable__Bv9o7"
                  style={{
                    left: "-43px",
                    top: "65.9219px",
                  }}
                >
                  <table className="popover">
                    <tbody>
                      <tr>
                        <td>
                          <b>Course Name</b>
                        </td>
                        <td>Freshman Leap Seminar</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Instructors</b>
                        </td>
                        <td>Troy Peace</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Location</b>
                        </td>
                        <td>Instructional Center 103</td>
                      </tr>
                      <tr>
                        <td>
                          <b>CRN</b>
                        </td>
                        <td>86356</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Credit Hours</b>
                        </td>
                        <td>1</td>
                      </tr>
                    </tbody>
                  </table>
                  <div
                    className="react-tooltip-arrow styles-module_arrow__K0L3T"
                    style={{
                      left: "-43px",
                      top: "65.9219px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
