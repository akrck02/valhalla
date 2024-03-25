export interface Error {
    code : number,
    message : string,
    friendly : string,
    description : string,
}

export const Errors : { [key : number] : Error } = {
    200: {
        code: 200,
        message: 'Success',
        friendly : 'Success',
        description : 'The operation succeded.'
    },
    400: {
        code: 400,
        message: 'Bad request',
        friendly : 'The request is not valid',
        description: 'The parameters may be wrong or missing.'
    },
    401: {
        code: 401,
        message: 'Unauthorized',   
        friendly: 'You have no permissions to access this content 🔐',
        description: 'The content is protected, contact the administrator to get access.'
    },
    404: {
        code: 404,
        message: 'Not found',
        friendly: 'We can\'t find the page you are looking for 😓',
        description: 'The page you\'re searching for is no longer available.'
    },
    500: {
        code: 500,
        message: 'Internal server error',
        friendly: 'Ups, something went wrong 😓',
        description: 'The server is experimenting an unexpected error, contact the administrator for more information.'
    },
}


/**
 * Returns the error corresponding to the given code
 * @param code The code of the error
 * @returns The corresponding error by code
 */
export function getErrorByCode(code : number){
    return Errors[code];
}