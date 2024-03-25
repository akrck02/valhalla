import { Signal } from "../lib/gtdf/core/signals/signal";

export default class SignalBuffer {

    private static signals : Signal[] = [];

    public static add(signal : Signal) {
        this.signals.push(signal);
    }

    public static remove(signal : Signal) {
        this.signals = this.signals.filter((sig) => sig !== signal);
    }

    public static search(id : string) : Signal {
        return this.signals.find((sig) => sig.id === id);
    }

}