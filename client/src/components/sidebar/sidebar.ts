import { APP } from "../../app.js";
import { Configurations } from "../../config/config.js";
import { getMaterialIcon } from "../../lib/gtd-ts/material/materialicons.js";
import {
  isMobile,
  isSmallDevice,
} from "../../lib/gtd-ts/web/responsivetools.js";
import { setStyles, UIComponent } from "../../lib/gtd-ts/web/uicomponent.js";
import { SideModal } from "./sidemodal.js";

export class Sidebar extends UIComponent {
  private buttonBar: UIComponent;
  private userImage: UIComponent;
  private modal: SideModal;
  private elements: UIComponent[];

  public constructor() {
    super({
      type: "div",
      id: "sidebar",
      classes: ["box-column", "box-y-center"],
    });

    this.buttonBar = new UIComponent({
      type: "div",
      styles: {},
    });
    this.appendChild(this.buttonBar);

    this.modal = new SideModal();
    if (!isMobile() && !isSmallDevice()) {
      setStyles(this.buttonBar.element, {
        height: "calc(100% - 2.5rem)",
      });

      this.userImage = new UIComponent({
        type: "img",
        attributes: {
          src: Configurations.PATHS.ICONS + "/default-user.png",
        },
        styles: {
          width: "1.7rem",
          height: "1.7rem",
          borderRadius: "20rem",
          cursor: "pointer",
        },
        events: {
          click: () => {
            if (this.modal.isOpened()) this.modal.close();
            else this.modal.open();
          },
        },
      });

      this.appendChild(this.userImage);
      this.appendChild(this.modal);
    }

    this.build();
  }

  public build() {
    const tasks = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "tasks" },
      text: getMaterialIcon("task_alt", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.TASKS,
      },
    });

    const calendar = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "calendar" },
      text: getMaterialIcon("calendar_today", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.CALENDAR,
      },
    });

    const notes = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "notes" },
      text: getMaterialIcon("sticky_note_2", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.NOTES,
      },
    });

    const search = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "search" },
      text: getMaterialIcon("search", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.SEARCH,
      },
    });

    const configuration = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "configuration" },
      text: getMaterialIcon("tune", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.CONFIGURATION,
      },
    });

    const about = new UIComponent({
      type: "a",
      classes: ["sidebar-item", "box-center"],
      data: { name: "about" },
      text: getMaterialIcon("info", {
        size: "1.25rem",
        fill: "#404040",
      }).toHTML(),
      attributes: {
        href: Configurations.VIEWS.ABOUT,
      },
    });

    this.elements =
      isMobile() && !isSmallDevice()
        ? [tasks, calendar, notes, search, configuration, about]
        : [tasks, calendar, notes, search, configuration];

    this.elements.forEach((element) => {
      this.buttonBar.appendChild(element);
    });
  }

  public setSelected(selected: string = undefined) {
    this.elements.forEach((element) =>
      element.element.classList.remove("selected"),
    );

    if (selected == undefined) return;

    const tab = this.findSelected(selected);
    tab?.element.classList.add("selected");
  }

  public show(): void {}

  public clickTab(selected: string) {
    this.findSelected(selected)?.element?.click();
  }

  private findSelected(selected: string) {
    return this.elements.find((f) => f.data.name == selected);
  }
}
