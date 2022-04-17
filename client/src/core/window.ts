export class Window {
    
    public static FULLHD_WIDTH = 1920;
    public static FULLHD_HEIGHT = 1080;

    public static DEFAULT_ZOOM = 1;


    public static setEvents() {
        window.onresize = () => this.setZoomLevel();
    }


    public static setZoomLevel() {
        const width = window.innerWidth;

        if(width < this.FULLHD_WIDTH / 2 + 100){
            document.body.style['zoom'] = this.DEFAULT_ZOOM  * ((width / this.FULLHD_WIDTH) * 1.8)
        } else {
            document.body.style['zoom'] = this.DEFAULT_ZOOM;
        }
    } 


}