/**
 * Get parameters of a url by breakpoint
 * @param url url to get parameters from
 * @param breakpoint breakpoint to get parameters from
 * @description This method is useful for getting parameters of a url by breakpoint.
 * @returns parameters of a url
 * @example
 *     const url = "https://www.website.org/search/user/1/page/2";
 *     const breakpoint = "search";
 *     const parameters = getParametersByBreakPoint(url, breakpoint);
 *     console.log(parameters); // ["user","1","page","2"]
 */
export function getUrlParametersByBreakPoint(url: string, breakpoint: string): string[] {
    let params = url.split("/");
    const index = params.indexOf(breakpoint);

    if (-1 == index) 
      return [];
    
    return params.slice(index + 1, params.length);
}

/**
 * Get parameters of a url by index
 * @param url url to get parameters from
 * @param index index to get parameters from
 * @description This method is useful for getting parameters of a url by index.
 * @returns parameters of a url
 * @example
 *      const url = "search/user/1/page/2";
 *      const index = 2;
 *      const parameters = getParametersByIndex(url, index);
 *      console.log(parameters); // ["1","page","2"]
 */
export function getUrlParametersByIndex(url: string, index: number): string[] {
  let params = url.split("/");
  return params.slice(index, params.length);
}

/**
 * Download a file from a url on the client
 * @param url url of the file
 * @param filename name of the file
 * @description This method is useful for downloading a file from a url on the client.
 * @example
 *     const url = "https://www.website.org/search/files/17293.jpg";
 *     const filename = "cat.jpg";
 *     downloadFile(url, filename);
 */
export function downloadFile(uri: string, name: string) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get url GET parameters
 * @param url url to get parameters from
 * @description This method is useful for getting parameters of a url.
 * @returns parameters of a url
 * @example
 *    const url = "https://www.website.org?search=&user=akrck02&page=2";
 *    const parameters = getUrlGetParameters(url);
 *    console.log(parameters); // {search: "", user: "akrck02", page: "2"}
 */
export function getUrlGetParameters(url: string): object {
  
  let params = url.split("?")
  if (params.length < 2) 
    return {};

  params = params[1].split("&");
  
  let result = {};
  for (const param of params) {
    let paramArray = param.split("=");
    result[paramArray[0]] = paramArray[1];
  }
  
  return result;
}
