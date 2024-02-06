import React, {
    useCallback,
    useContext,
    useState,
    useRef,
    useEffect,
} from 'react';
import {
    BarChart,
    ChartChangeEvent,
    LineChart,
} from 'react-native-charts-wrapper';
import { AppContext } from '../App.provider';
import { LayoutChangeEvent, processColor, Text, View } from 'react-native';
import ChartStateManager from '../services/LineChartStateManager';

type LineChartData = {
    x: number;
    y: number;
}[];

export const MainChart: React.FC = () => {
    // const chart = useRef<LineChart>(null);
    // const [points, setPoints] = useState<LineChartData>([]);
    // const [stateManager, setStateManager] =
    //     useState<ChartStateManager | null>(null);
    // useEffect(() => {
    //     if (chart) {
    //         const stateManager = new ChartStateManager(chart);
    //         setStateManager(stateManager);
    //         setPoints(stateManager.loadData(50000, 80000, 0));
    //     }
    // }, [chart]);

    return (
        <BarChart
            style={{ flex: 1 }}
            legend={{
                enabled: false,
            }}
            data={{
                dataSets: [
                    {
                        values: [
                            { x: 0, y: 100 },
                            { x: 1, y: 200 },
                            { x: 3, y: 100 },
                            { x: 5, y: 200 },
                            { x: 6, y: 300 },
                        ],
                        label: 'Bar dataSet',
                        config: {
                            color: processColor('blue'),
                        },
                    },
                ],
                config: {
                    barWidth: 0.7,
                },
            }}
            xAxis={{
                valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                enabled: true,
                textColor: processColor('white'),
            }}
        />
    );
};
// <LineChart
//     style={{ flex: 1 }}
//     ref={chart}
//     data={{
//         dataSets: [
//             {
//                 label: 'Dataset 1',
//                 values: points,
//                 config: {
//                     color: processColor('cyan'),
//                     mode: 'STEPPED',
//                     drawCircles: false,
//                     drawValues: false,
//                     fillColor: processColor('cyan'),
//                     fillAlpha: 0xa0,
//                     drawFilled: true,
//                 },
//             },
//         ],
//     }}
//     legend={{
//         enabled: false,
//     }}
//     yAxis={{
//         left: {
//             textColor: processColor('white'),
//         },
//         // 28.0109 C/Kwh
//         right: {
//             textColor: processColor('white'),
//         },
//     }}
//     xAxis={{
//         textColor: processColor('white'),
//         position: 'BOTTOM',
//     }}
//     chartDescription={{
//         text: '',
//     }}
//     zoom={{
//         xValue: 65,
//         yValue: 0,
//         scaleX: 3,
//         scaleY: 1,
//     }}
//     dragEnabled={false}
//     scaleEnabled={false}
//     onChange={stateManager?.handleChange}
// />
