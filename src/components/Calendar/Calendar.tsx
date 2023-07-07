interface CalendarEvent {
    title: string;
    startTime: string;
    endTime: string;
  }
  
  class CalendarUI {
    private calendarContainer: HTMLElement;
  
    constructor(containerId: string) {
      this.calendarContainer = document.getElementById(containerId);
    }
  
    private createEventElement(event: CalendarEvent): HTMLElement {
      const eventElement = document.createElement('div');
      eventElement.className = 'event';
      eventElement.innerHTML = `
        <div class="event-title">${event.title}</div>
        <div class="event-time">${event.startTime} - ${event.endTime}</div>
      `;
      return eventElement;
    }
  
    private createHourlySection(day: string): HTMLElement {
      const section = document.createElement('div');
      section.className = 'hourly-section';
      section.innerHTML = `<div class="section-title">${day}</div>`;
      for (let hour = 7; hour <= 19; hour++) {
        const event = {
          title: '',
          startTime: `${hour}:00`,
          endTime: `${hour + 1}:00`,
        };
        const eventElement = this.createEventElement(event);
        section.appendChild(eventElement);
      }
      return section;
    }
  
    public render(): void {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
      for (const day of days) {
        const section = this.createHourlySection(day);
        this.calendarContainer.appendChild(section);
      }
    }
  }

  const calendar = new CalendarUI('calendar');
  calendar.render();
