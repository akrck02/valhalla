import { APP, App } from "../../../app.js";
import { Configurations } from "../../../config/config.js";
import { DateText } from "../../../core/data/integrity/dateText.js";
import { setEvents, UIComponent } from "../../../lib/gtd-ts/web/uicomponent.js";

export class Calendar extends UIComponent {
  constructor() {
    super({
      type: "div",
      id: "calendar-wrapper",
      classes: ["box-column"],
      styles: {
        width: "100%",
        height: "100%",
      },
    });
  }

  public draw(current: Date, tasks: any) {
    const today = new Date();
    const isThisMonth =
      today.getFullYear() == current.getFullYear() &&
      today.getMonth() == current.getMonth();

    const year = current.getFullYear();
    const month = current.getMonth();

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    let dayOfWeek = new Date(year, month, 1).getDay() - 1;

    if (dayOfWeek == -1) {
      dayOfWeek = 7;
    }

    const rows = [];
    const title = new UIComponent({
      type: "h1",
      id: "title",
      classes: ["box-x-between", "box-y-center"],
      text: DateText.month(month) + " " + year,
      styles: {
        padding: "0 .5rem 2rem .5rem",
      },
    });

    if (isThisMonth) {
      const dayName = new UIComponent({
        type: "div",
        id: "day-name",
        classes: ["box-row"],
        text: DateText.weekDay(today.getDay()) + ", " + today.getDate(),
      });

      title.appendChild(dayName);
    }
    const calendar = new UIComponent({
      type: "div",
      id: "calendar",
      classes: ["box-column"],
      styles: {},
    });

    let row = new UIComponent({
      classes: ["calendar-row", "box-row", "box-x-start", "box-y-center"],
    });

    let realday = 1;
    if (dayOfWeek != 7)
      for (let i = 0; i < dayOfWeek; i++) {
        const day = new UIComponent({
          text: "",
          classes: ["day", "empty"],
        });

        row.appendChild(day);
        rows.push(row);
        calendar.appendChild(row);
      }

    for (let i = dayOfWeek; i < lastDayOfMonth + dayOfWeek; i++) {
      if ((i + 7) % 7 == 0) {
        row = new UIComponent({
          classes: ["calendar-row", "box-row", "box-x-start", "box-y-center"],
        });
        calendar.appendChild(row);
        rows.push(row);
      }

      //if year is this year and month is this month and day is today
      const isToday =
        today.getFullYear() == year &&
        today.getMonth() == month &&
        realday == today.getDate();

      const day = new UIComponent({
        classes: isToday ? ["day", "today"] : ["day"],
        styles: {
          overflow: "hidden",
        },
      });

      const dayText = new UIComponent({
        text: "" + realday,
        styles: {
          marginBottom: ".5rem",
        },
      });

      dayText.appendTo(day);

      const events =
        tasks[
          DateText.normalize(year, 4) +
            "-" +
            DateText.normalize(month + 1, 2) +
            "-" +
            DateText.normalize(realday, 2)
        ];

      if (events) {
        setEvents(day.element, {
          click: () => {
            const tasks = new UIComponent({
              classes: ["box-column"],
            });

            const dayTitle = new UIComponent({
              type: "h1",
              text: "Day :",
              styles: {
                marginBottom: "2rem",
              },
            });
            tasks.appendChild(dayTitle);

            events.forEach((event) => {
              const eventbox = new UIComponent({
                type: "p",
                text: event.name,
                classes: ["box-row", "box-y-center"],
                styles: {
                  fontSize: ".75rem",
                  opacity: ".75",
                  borderLeft: ".2rem solid rgba(255,255,255,.75)",
                  marginBottom: ".5rem",
                  marginLeft: "-.35rem",
                  paddingLeft: ".5rem",
                  height: "2rem",
                  overflow: "hidden",
                  //whiteSpace : "nowrap",
                  //textOverflow : "ellipsis"
                },
              });
              eventbox.appendTo(tasks);
            });

            APP.router.modal.setContent(tasks);
            APP.router.modal.show();
          },
        });

        let index = 0;
        events.forEach((event: any) => {
          if (index > 2) {
            return;
          }

          const eventbox = new UIComponent({
            type: "p",
            text: event.name,
            styles: {
              fontSize: ".75rem",
              opacity: ".75",
              borderLeft: ".15rem solid rgba(255,255,255,.75)",
              marginBottom: ".2rem",
              marginLeft: "-.35rem",
              paddingLeft: ".25rem",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            },
          });
          eventbox.appendTo(day);
          index++;
        });

        if (events.length > 3) {
          const more = new UIComponent({
            type: "p",
            text: "...",
          });
          more.appendTo(day);
        }
      }

      row.appendChild(day);
      realday++;
    }

    let index = lastDayOfMonth + dayOfWeek;
    while (index % 7 != 0) {
      const day = new UIComponent({
        text: "",
        classes: ["day", "empty"],
      });

      row.appendChild(day);
      calendar.appendChild(row);
      index++;
    }

    this.appendChild(title);
    this.appendChild(calendar);

    let even = true;
    rows.forEach((row) => {
      even = !even;

      let time = even ? 100 : 200;
      time += Math.random() * 50;

      if (Configurations.areAnimationsEnabled() == false) {
        time = 0;
      }

      setTimeout(() => {
        row.element.classList.add("visible");
      }, time);
    });
  }
}
