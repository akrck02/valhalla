
const SECOND_STRING = 'second';
const SECONDS_STRING = 'seconds';

const MINUTE_STRING = 'minute';
const MINUTES_STRING = 'minutes';

const HOUR_STRING = 'hour';
const HOURS_STRING = 'hours';

const DAY_STRING = 'day';
const DAYS_STRING = 'days';

const WEEK_STRING = 'week';
const WEEKS_STRING = 'weeks';

const MONTH_STRING = 'month';
const MONTHS_STRING = 'months';

const YEAR_STRING = 'year';
const YEARS_STRING = 'years';

export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
export const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;


/**
 * Get month difference between two dates
 * @param d1 date 1 (older date)
 * @param d2 date 2 (newer date)
 * @description This method is useful for calculating the difference between two dates.
 * @example
 *      const d1 = new Date(2018, 0, 1);
 *      const d2 = new Date(2018, 1, 1);
 *      const diff = monthDiff(d1, d2);
 *      console.log(diff); // 1
 * @returns number of months between the two dates
 */
export function monthDiff(d1, d2) {
    if (d2 > d1) {
        return -monthDiff(d2, d1);
    }

    const months = (d2.getFullYear() - d1.getFullYear()) * 12;
    return months + d2.getMonth() - d1.getMonth();
}

/**
 * Get if a year is a leap year
 * @param year year to check
 * @description This method is useful for checking if a year is a leap year.
 * @example
 *     const isLeapYear = isLeapYear(2018);
 *     console.log(isLeapYear); // false 
 */
 export function isLeapYear (year) : boolean {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}

/**
 * Get if the given date is inside today's range 
 * @param date date to check
 * @description This method is useful for checking if a date is inside today's range.
 * @example
 *    const isToday = isToday(new Date());
 *    console.log(isToday); // true
 * 
 * @returns true if the date is inside today's range, false otherwise 
 */
export function isToday(date) : boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
} 


/**
 * Turn a number of seconds into a human readable string
 * @param seconds number of seconds
 * @description This method is useful for converting seconds into a human readable string.
 * @example  
 *    const seconds = 3600;
 *    const time = humanize(seconds);
 *    console.log(time); // 1 hour
 
 * @returns human readable string
 */
export function humanize(seconds) : string {
    if (seconds < SECONDS_PER_MINUTE) {
        if(seconds === 1) 
            return `${seconds} ${SECOND_STRING}`;
    
        return `${seconds} ${SECONDS_STRING}`;
    }
    
    if (seconds < SECONDS_PER_HOUR) {
        const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
        if(minutes === 1)
            return `${minutes} ${MINUTE_STRING}`;

        return `${minutes} ${MINUTES_STRING}`;
    } 
    
    if (seconds < SECONDS_PER_DAY) {
        const hours = Math.floor(seconds / SECONDS_PER_HOUR);

        if(hours === 1)
            return `${hours} ${HOUR_STRING}`;

        return `${hours} ${HOURS_STRING}`;
    } 
    
    if (seconds < SECONDS_PER_WEEK) {
        const days = Math.floor(seconds / SECONDS_PER_DAY);

        if(days === 1)
            return `${days} ${DAY_STRING}`;

        return `${days} ${DAYS_STRING}`;
    } 


    if (seconds < SECONDS_PER_DAY * 7) {
        const weeks = Math.floor(seconds / SECONDS_PER_WEEK);

        if(weeks === 1)
            return `${weeks} ${WEEK_STRING}`;

        return `${weeks} ${WEEKS_STRING}`;
    }


    if (seconds < SECONDS_PER_DAY * 30) {
        const months = Math.floor(seconds / SECONDS_PER_DAY / 7);

        if(months === 1)
            return `${months} ${MONTH_STRING}`;

        return `${months} ${MONTHS_STRING}`;
    }

    const years = Math.floor(seconds / SECONDS_PER_DAY / 30);

    if(years === 1)
        return `${years} ${YEAR_STRING}`;

    return `${years} ${YEARS_STRING}`;
};

