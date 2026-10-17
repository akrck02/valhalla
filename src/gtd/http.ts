/**
 * This enum represents the available HTTP methods
 * @author akrck02
 */
export enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
  Update = "UPDATE",
  Patch = "PATCH",
  Head = "HEAD",
  Options = "OPTIONS",
  Connect = "CONNECT",
  Trace = "TRACE",
  All = "ALL",
}

/**
 * This enum represents the available mime types
 * @author akrck02
 */
export enum MimeType {
  Json = "application/json",
  Xml = "application/xml",
  Html = "text/html",
  Text = "text/plain",
  Form = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Blob = "application/octet-stream",
  Pdf = "application/pdf",
  Zip = "application/zip",
  Mp3 = "audio/mpeg",
  Mp4 = "video/mp4",
  Png = "image/png",
  Jpeg = "image/jpeg",
  Gif = "image/gif",
  Svg = "image/svg+xml",
  Ico = "image/x-icon",
  Csv = "text/csv",
  Css = "text/css",
  Javascript = "text/javascript",
  Typescript = "text/typescript",
  Webm = "video/webm",
  Ogg = "video/ogg",
  Ogv = "video/ogv",
  Wav = "audio/wav",
  Webp = "image/webp",
  Woff = "font/woff",
  Woff2 = "font/woff2",
  Ttf = "font/ttf",
  Eot = "application/vnd.ms-fontobject",
  Otf = "font/otf",
  Xls = "application/vnd.ms-excel",
  Xlsx = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  Doc = "application/msword",
  Docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  Ppt = "application/vnd.ms-powerpoint",
  Pptx = "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  Msg = "application/vnd.ms-outlook",
  Rtf = "application/rtf",
  Psd = "application/photoshop",
  Ai = "application/postscript",
  Eps = "application/postscript",
  Xps = "application/vnd.ms-xpsdocument",
  Swf = "application/x-shockwave-flash",
  Flv = "video/x-flv",
  Midi = "audio/midi",
  Wma = "audio/x-ms-wma",
  Wax = "audio/x-ms-wax",
  Mka = "audio/x-matroska",
  Mkv = "video/x-matroska",
  Avi = "video/x-msvideo",
  Mov = "video/quicktime",
  Wmv = "video/x-ms-wmv",
  M4a = "audio/mp4",
  M4v = "video/mp4",
  F4v = "video/mp4",
  F4a = "audio/mp4",
  F4b = "audio/mp4",
  M4b = "audio/mp4",
  M4r = "audio/mp4",
  Mpga = "audio/mpeg",
  Mp2 = "audio/mpeg",
  Mp2A = "audio/mpeg",
  M2a = "audio/mpeg",
  M3a = "audio/mpeg",
  Oga = "audio/ogg",
}

/**
 * This enum represents the available text encodings
 * @author akrck02
 */
export enum TextEncoding {
  Utf8 = "UTF-8",
  Utf16 = "UTF-16",
  Utf16be = "UTF-16BE",
  Utf16le = "UTF-16LE",
  Iso88591 = "ISO-8859-1",
  Iso88592 = "ISO-8859-2",
  Iso88593 = "ISO-8859-3",
  Iso88594 = "ISO-8859-4",
  Iso88595 = "ISO-8859-5",
  Iso88596 = "ISO-8859-6",
  Iso88597 = "ISO-8859-7",
  Iso88598 = "ISO-8859-8",
  Iso88599 = "ISO-8859-9",
  Iso885910 = "ISO-8859-10",
  Iso885913 = "ISO-8859-13",
  Iso885914 = "ISO-8859-14",
  Iso885915 = "ISO-8859-15",
  Iso885916 = "ISO-8859-16",
  Koi8R = "KOI8-R",
  Koi8U = "KOI8-U",
  Macintosh = "macintosh",
  Windows1250 = "windows-1250",
  Windows1251 = "windows-1251",
  Windows1252 = "windows-1252",
  Windows1253 = "windows-1253",
  Windows1254 = "windows-1254",
  Windows1255 = "windows-1255",
  Windows1256 = "windows-1256",
  Windows1257 = "windows-1257",
  Windows1258 = "windows-1258",
  Xmaccyrillic = "x-mac-cyrillic",
  Gb18030 = "GB18030",
  Big5 = "Big5",
  Shiftjis = "Shift_JIS",
  Eucjp = "EUC-JP",
  Iso2022jp = "ISO-2022-JP",
  Euckr = "EUC-KR",
  Iso2022kr = "ISO-2022-KR",
  Ibm866 = "IBM866",
  Ibm775 = "IBM775",
  Iso885911 = "ISO-8859-11",
  Windows874 = "windows-874",
  Tis620 = "TIS-620",
}

/**
* This interface represents the properties 
* to make an HTTP request.
*/
export interface HttpRequest {
  method?: HttpMethod
  parameters: object | FormData
  url: string
  charset?: string
  contentType?: string
  headers?: object
}

/**
 * Make a HTTP GET request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpGet(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Get
  return httpRequest(request)
}

/**
 * Make a HTTP POST request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpPost(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Post
  return httpRequest(request)
}

/**
 * Make a HTTP PUT request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpPut(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Put
  return httpRequest(request)
}

/**
 * Make a HTTP PATCH request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpPatch(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Patch
  return httpRequest(request)
}

/**
 * Make a HTTP DELETE request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpDelete(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Delete
  return httpRequest(request)
}

/**
 * Make a HTTP HEAD request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpHead(request : HttpRequest) : Promise<Response>{
  request.method = HttpMethod.Head
  return httpRequest(request)
}

/**
 * Make a HTTP OPTIONS request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
export async function httpOptions(request : HttpRequest) : Promise<Response> {
  request.method = HttpMethod.Options
  return httpRequest(request)
}

/**
 * Make a HTTP request.
 * @param request The request parameters.
 * @returns The promise of a response.
 */
function httpRequest(request: HttpRequest): Promise<Response> {

  let options = {
    method: request.method || HttpMethod.Get,
    headers: {
      "Content-type": `${request.contentType || "application/json"};charset=${request.charset || "UTF-8"}`,
      "mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    },
  }

  request.headers && Object.assign(options.headers, request.headers);

  if (HttpMethod.Get !== request.method) {
    if (request.parameters instanceof FormData) {
      options["body"] = request.parameters
      // The browser writes the multipart boundary itself
      delete options.headers["Content-type"]
    } else {
      options["body"] = JSON.stringify(request.parameters)
    }
  }

  return fetch(request.url, options)
}

/**
 * Handle response status.
 * @param response The response to Handle.
 * @param statusHandlers The map of status codes with handlers. 
 * @param defaultStatusHandler The default status handler.
 */
export async function handleResponseStatus(
  response : Response,
  statusHandlers : Map<number, (res : Response) => any>, 
  defaultStatusHandler : (res : Response) => any 
){

  if(true == statusHandlers.has(response.status)) {
    await statusHandlers.get(response.status)(response)
    return
  }

  if(undefined != defaultStatusHandler)
    await defaultStatusHandler(response)
  else 
    console.error(`unhandled status code ${response.status} for ${response.url}`)

}

