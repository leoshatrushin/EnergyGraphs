const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export enum chartZoomOptions {
    ONE_HOUR = HOUR,
    EIGHT_HOURS = 8 * HOUR,
    ONE_DAY = DAY,
    TWO_DAYS = 2 * DAY,
    ONE_WEEK = WEEK,
    TWO_WEEKS = 2 * WEEK,
    ONE_MONTH = 0,
    TWO_MONTHS = 1,
}

export const chartZoomLabels: { [key in chartZoomOptions]: string } = {
    [chartZoomOptions.ONE_HOUR]: '1h',
    [chartZoomOptions.EIGHT_HOURS]: '8h',
    [chartZoomOptions.ONE_DAY]: '1d',
    [chartZoomOptions.TWO_DAYS]: '2d',
    [chartZoomOptions.ONE_WEEK]: '1w',
    [chartZoomOptions.TWO_WEEKS]: '2w',
    [chartZoomOptions.ONE_MONTH]: '1m',
    [chartZoomOptions.TWO_MONTHS]: '2m',
};

export type Breakpoint = {
    barWidth: number;
    maxRange: number;
};

export const BREAKPOINTS: Breakpoint[] = [
    {
        barWidth: 0,
        maxRange: HOUR,
    },
    {
        barWidth: 5 * MINUTE,
        maxRange: DAY,
    },
    {
        barWidth: HOUR,
        maxRange: WEEK,
    },
    {
        barWidth: DAY,
        maxRange: 2 * MONTH,
    },
    {
        barWidth: WEEK,
        maxRange: 6 * MONTH,
    },
    {
        barWidth: MONTH,
        maxRange: Infinity,
    },
];

export function getBreakpointIndex(range: number): number {
    return BREAKPOINTS.findIndex(bp => range < bp.maxRange);
}

export const CHANGE_ENERGY_VALUE = (1 * 3600 * 1000) / 2;
