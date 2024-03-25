
export interface ISingleton<T> {
    _instance: T;
    instance() :T;
}

export function Singleton<T extends ISingleton<T>>() {
    
    return function(target: any) {
        console.debug(`Singleton instanciated: ${target.name}`);
        
        target.instance = () =>{
            if(!target._instance){
                target._instance = new target();
            }
            
            return target._instance;
        }

        target.instance();
    };
    
}