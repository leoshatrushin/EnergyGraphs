import { RefObject } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
    BarChart,
    ChartChangeEvent,
    LineChart,
} from 'react-native-charts-wrapper';
import { BREAKPOINTS, getBreakpointIndex, CHANGE_ENERGY_VALUE } from '../constants';

type DataState = {
    min: number;
    max: number;
    breakpointIndex: number;
};

const dummyMessages = [
    4892473, 4899503, 4906563, 4913393, 4920073, 4927113, 4934173, 4941213,
    4948283, 4955303, 4962363, 4969393, 4976073, 4982894, 4989934, 4996964,
    5002514, 5003244, 5003984, 5004704, 5005444, 5006174, 5006914, 5007644,
    5008384, 5009114, 5009864, 5010594, 5011344, 5012074, 5012824, 5013554,
    5014304, 5015024, 5015774, 5016504, 5017254, 5017984, 5018734, 5019464,
    5020214, 5020944, 5021694, 5022424, 5023174, 5023904, 5024654, 5025384,
    5026134, 5026864, 5027614, 5028344, 5029094, 5029824, 5030574, 5031294,
    5032044, 5032774, 5033514, 5034244, 5035014, 5040324, 5047354, 5054254,
    5059164, 5060754, 5067344, 5074324, 5081324, 5088304, 5094725, 5100985,
    5107515, 5114036, 5120576, 5127076, 5133616, 5140136, 5146676, 5152996,
    5159196, 5165706, 5172476, 5179456, 5186116,
];

type LineChartData = {
    x: number;
    y: number;
}[];

function closeEnds(
    data: LineChartData,
    from: number,
    to: number,
): LineChartData {
    const first = data[0];
    const last = data[data.length - 1];
    if (first.x > from / 1000) {
        data.unshift({ x: from / 1000, y: first.y });
    }
    if (last.x < to / 1000) {
        data.push({ x: to / 1000, y: last.y });
    }
    return data;
}

let startTime = dummyMessages[0];

function convertMessagesToGradientPoints(
    messages: number[],
): { x: number; y: number }[] {
    if (messages.length < 2) {
        return [];
    }
    let points = new Array(messages.length - 1);
    let gradient;
    for (let i = 1; i < messages.length; i++) {
        gradient = CHANGE_ENERGY_VALUE / (messages[i] - messages[i - 1]);
        points[i - 1] = {
            x: (messages[i - 1] - startTime) / 1000,
            y: gradient,
        };
    }
    return points;
}

export default class ChartStateManager {
    #lineChart: RefObject<LineChart>;
    #barChart: RefObject<BarChart>;
    #isLoading: boolean = false;
    #dataState: DataState = {
        min: 0,
        max: 0,
        breakpointIndex: 0,
    };

    constructor(
        lineChart: RefObject<LineChart>,
        barChart: RefObject<BarChart>,
    ) {
        this.#lineChart = lineChart;
        this.#barChart = barChart;
    }

    handleChange = (event: ChartChangeEvent): void => {
        if (this.#isLoading) return;

        const nativeEvent = event.nativeEvent;
        const { left, right } = nativeEvent;
        if (left == null || right == null) return;

        const chartRange = right - left;
        const newBreakpointIndex =
            getBreakpointIndex(chartRange);
        if (newBreakpointIndex !== this.#dataState.breakpointIndex) {
            this.#loadData(left, right);
        }
        // if (this.#isLoading) return;
        // const nativeEvent = event.nativeEvent;
        // const { left, right } = nativeEvent;

        // const dataInterval = this.#dataState.max - this.#dataState.min;
        // if (nativeEvent.action === 'chartTranslated') {
        //     if (left * 1000 - this.#dataState.min < dataInterval / 6) {
        //         this.#isLoading = true;
        //         const newData = this.loadData(
        //             this.#dataState.min - dataInterval / 6,
        //             this.#dataState.max - dataInterval / 6,
        //             this.#dataState.averageInterval,
        //         );
        //         console.log('loading left');
        //         // @ts-ignore
        //         this.#lineChart.current.setDataAndLockIndex(newData);
        //         this.#isLoading = false;
        //     }
        //     if (this.#dataState.max - right * 1000 < dataInterval / 6) {
        //         this.#isLoading = true;
        //         const newData = this.loadData(
        //             this.#dataState.min + dataInterval / 6,
        //             this.#dataState.max + dataInterval / 6,
        //             this.#dataState.averageInterval,
        //         );
        //         console.log('loading right');
        //         console.log(newData);
        //         // @ts-ignore
        //         this.#lineChart.current.setDataAndLockIndex(newData);
        //         this.#isLoading = false;
        //     }
        // }

        // if (nativeEvent.action === 'chartScaled') {
        //     this.#isLoading = true;
        //     let newMin = this.#dataState.min;
        //     let newMax = this.#dataState.max;
        //     if (left - this.#dataState.min < dataInterval / 6) {
        //         newMin = this.#dataState.min - dataInterval / 6;
        //     }
        //     if (this.#dataState.max - right < dataInterval / 6) {
        //         newMax = this.#dataState.max + dataInterval / 6;
        //     }
        //     if (
        //         newMin === this.#dataState.min &&
        //         newMax === this.#dataState.max
        //     )
        //         return;
        //     this.loadData(newMin, newMax, this.#dataState.averageInterval);
        // }
    };

    showVisibleRange = (from: number, to: number): void => { };

    #loadData = async (from: number, to: number): Promise<void> => {
        this.#isLoading = true;
        this.#dataState.min = from;
        this.#dataState.max = to;
        for (let i = )
        //     return closeEnds(
        //         convertMessagesToGradientPoints(
        //             dummyMessages.filter(function inBounds(value) {
        //                 return value - startTime >= from && value - startTime <= to;
        //             }),
        //         ),
        //         from,
        //         to,
        //     );
    };
}
