import { uuidv4 } from "./crypto.js";

export type Shortcut = {
	interaction: KeyInteraction;
	key: string;
	ctrlKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
	metaKey?: boolean;
	callback: () => void;
	omitEditableContent?: boolean;
	repeatable?: boolean;
	preventDefault?: boolean;
	stopPropagation?: boolean;
};

export enum KeyInteraction {
	keyUp = "keyup",
	keyDown = "keydown",
}

type KeyboardHandler = {
	addEventListener: (
		name: string,
		callback: (e: KeyboardEvent) => void,
	) => void;
};

/**
 *  Public class to register shortcuts by context
 */
export default class Shortcuts {
	private static readonly globalRegistry: Map<string, ShortcutRegistry> =
		new Map();

	static register(element: KeyboardHandler): string {
		const uuid = uuidv4();
		this.globalRegistry.set(uuid, new ShortcutRegistry(element));
		return uuid;
	}

	static set(key: string, shortcut: Shortcut) {
		this.globalRegistry.get(key)?.set(shortcut);
	}
}

/**
 * Shortcut registry from a given handler
 */
class ShortcutRegistry {
	private readonly registry: Map<string, Shortcut>;
	private readonly context: KeyboardHandler;

	constructor(context: KeyboardHandler) {
		this.registry = new Map();
		this.context = context;
		this.start();
	}

	/**
	 * Get event as key string
	 * @param event the keyboard event
	 * @returns event as key string
	 */
	private static getEventKeys(event: KeyboardEvent): string {
		const parts: string[] = [];
		if (event.ctrlKey) parts.push("Ctrl");
		if (event.shiftKey) parts.push("Shift");
		if (event.altKey) parts.push("Alt");
		if (event.metaKey) parts.push("Meta"); // Para Cmd en Mac

		if (!["Control", "Shift", "Alt", "Meta"].includes(event.key)) {
			parts.push(event.key.toUpperCase());
		}
		return parts.join("+");
	}

	/**
	 * Get shortcut as key string
	 * @param shortcut the shortcut
	 * @returns shortcut as key string
	 */
	private static getShortcutKeys(shortcut: Shortcut): string {
		const parts: string[] = [];
		if (shortcut.ctrlKey) parts.push("Ctrl");
		if (shortcut.shiftKey) parts.push("Shift");
		if (shortcut.altKey) parts.push("Alt");
		if (shortcut.metaKey) parts.push("Meta");
		parts.push(shortcut.key.toUpperCase());
		return parts.join("+");
	}

	/**
	 * Execute a shotcut action
	 * @param action the action
	 */
	private static execute(action: Shortcut) {
		if (undefined == action || undefined == action.callback) return;

		action.callback();
	}

	/**
	 * Set a new action for a shortcut
	 * @param shortcut the shortcut
	 */
	set(shortcut: Shortcut) {
		this.registry.set(ShortcutRegistry.getShortcutKeys(shortcut), shortcut);
	}

	/**
	 * Start keyboard service
	 */
	start() {
		const registry = this.registry;
		this.context.addEventListener(KeyInteraction.keyUp, (e) =>
			ShortcutRegistry.handleEvent(KeyInteraction.keyUp, registry, e),
		);
		this.context.addEventListener(KeyInteraction.keyDown, (e) =>
			ShortcutRegistry.handleEvent(KeyInteraction.keyDown, registry, e),
		);
	}

	/**
	 * Handle a key event
	 * @param event the key event
	 */
	private static handleEvent(
		context: KeyInteraction,
		registry: Map<string, Shortcut>,
		event: KeyboardEvent,
	) {
		// get action, if no one is present return
		const action = registry?.get(ShortcutRegistry.getEventKeys(event));
		if (undefined == action || context != action.interaction) return;

		// if prevent default active, prevent
		if (true == action.preventDefault) {
			event.preventDefault();
		}

		// if stop stop propagation active, prevent
		if (true == action.stopPropagation) {
			event.stopPropagation();
		}

		if (!action.repeatable && event.repeat)
			// handle not repeatable events
			return;

		// if omit editable content is set check if editable
		const target = event.target as HTMLElement;
		if (
			action.omitEditableContent == true &&
			ShortcutRegistry.isEditableContent(target)
		) {
			return;
		}

		this.execute(action);
	}

	/**
	 * Get if target is editable
	 * @param target the element to inspect
	 * @returns if target is editable
	 */
	private static isEditableContent(target: HTMLElement): boolean {
		return (
			target.tagName === "INPUT" ||
			target.tagName === "TEXTAREA" ||
			target.isContentEditable
		);
	}
}
