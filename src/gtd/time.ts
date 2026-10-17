export function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleepIf(ms : number, condition : boolean) {

		if(false === condition || undefined === condition || null === condition ) {
			 return new Promise(resolve => setTimeout(resolve, 0));
		}

    return new Promise(resolve => setTimeout(resolve, ms));
}
