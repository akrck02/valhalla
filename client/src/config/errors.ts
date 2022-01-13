export const ERRORS = {
    200: {
        message: 'Success',
        code: 200,
    },
    400: {
        message: 'Bad request',
        code: 400,
    },
    401: {
        message: 'Unauthorized',   
        friendly: 'You have no permissions to access this content 🔐',
        code: 401,
    },
    404: {
        message: 'Not found',
        friendly: 'We can\'t find the page you are looking for 😓',
        code: 404,
    },
    500: {
        message: 'Internal server error',
        friendly: 'Ups, something went wrong 😓',
        code: 500,
    },
};