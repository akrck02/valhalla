import { APP } from "../../../app.js";
import { AppearenceListener } from "../../listeners/appearence.js";
import { ListenerSet } from "../../listenerset.js";
import Command from "../command.js";

export const WallpaperNextCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^-wn(.*)/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
        listeners.getAppearenceListener().nextWallpaper();
    }
    
}

export const WallpaperPreviousCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^-wp.*/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
        listeners.getAppearenceListener().previousWallpaper();
    }
    
}

export const WallpaperSetCommand : Command = {
    match(predicate : string) : boolean {
        return predicate.match(/^-ws\s[0-9]+.*/) ? true : false;
    },

    execute(predicate : string, listeners : ListenerSet) : void {    
        listeners.getAppearenceListener().setWallpaper(16);
    }
    
}

