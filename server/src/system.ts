import { env } from "process";

export function getLang() : string  {
    const  env1 = env || process.env;
    return env1.LC_ALL || env1.LC_MESSAGES || env1.LANG || env1.LANGUAGE || "en";    
}