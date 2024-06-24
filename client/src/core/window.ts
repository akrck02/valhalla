export class Window {
    
    public static FULLHD_WIDTH = 1920;
    public static FULLHD_HEIGHT = 1080;

    public static DEFAULT_ZOOM = 1.5;//1.28;


    public static setEvents() {
        window.onresize = () => this.setZoomLevel();
    }


    public static setZoomLevel() {
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if(width < this.FULLHD_WIDTH * this.DEFAULT_ZOOM  / 2 + 100){
            document.body.style['zoom'] = this.DEFAULT_ZOOM  * ((width / this.FULLHD_WIDTH) * this.DEFAULT_ZOOM)
        } else {
            document.body.style['zoom'] = this.DEFAULT_ZOOM;
            console.log("[Window] Zoom level set to default " + this.DEFAULT_ZOOM);
            
        }
    } 


}