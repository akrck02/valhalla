export const Routes = []

export function Route(value : string | string[]) {    
    return function(target: any) {

        if(typeof value == "string") {
            target.instance().routes = [value];
        } else {
            target.instance().routes = value;
        }

        console.debug(`Route registered /${value}`);
        Routes.push(target.instance());
    };
}