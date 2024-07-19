export class Window {
  public static FULLHD_WIDTH = 1920;
  public static FULLHD_HEIGHT = 1080;

  public static DEFAULT_ZOOM = 0; //1.28;

  public static setEvents() {
    window.onresize = () => this.setZoomLevel();
  }

  public static setZoomLevel() {
    let width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    document.body.style["zoom"] = `${this.DEFAULT_ZOOM}`;
  }
}
