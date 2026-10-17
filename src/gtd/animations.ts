import { Html } from "./html.js";
import { sleepIf } from "./time.js"

export default class Animations {
		public static enabled: boolean = false;
		private static readonly CHARACTERS_PER_MILLISECOND_MIN = 0.916666667 / 5 * 100; // average programmer typing speed

		private static readonly TEXT_ANIMATION_TAGS : string[] = [
			Html.A,
			Html.P,
			Html.H1,
			Html.H2,
			Html.H3,
			Html.H4,
			Html.H5,
			Html.H6,
			Html.Pre,
			Html.Code,
			Html.Span,
			Html.Div
		]

		/**
		 * typing animation
		 * @param element the element to animate
		 */
		static async typing(element : HTMLElement) {

			if (false == Animations.enabled) return;

					// if children detected, animate children
					// (and keep them: typing the parent too would flatten them into text)
					if(0 < element.children.length) {
						for(const child of element.children) await this.typing(child as HTMLElement)
						return
					}

					// if the element is not a text element, do not animate
					if(!Animations.TEXT_ANIMATION_TAGS.includes(element.tagName.toLocaleLowerCase())) {
						return
					}

					const text = element.innerText
					element.innerText = ""

					for (const char of text) {
						element.innerHTML += char
						await sleepIf(Animations.CHARACTERS_PER_MILLISECOND_MIN * (1 + Math.random() * .5), Animations.enabled)
					}
		}

		/**
		 * animate appearing
		 * @param output
		 */
		static async show(output : HTMLElement) {
			await sleepIf(1, Animations.enabled)
			output.classList.add("show")
			await sleepIf(1, Animations.enabled)
		}


}
