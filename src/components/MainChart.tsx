import React, { useContext } from 'react';
import { LineChart } from 'react-native-charts-wrapper';
import { AppContext } from '../App.provider';

const CHANGE_ENERGY_VALUE = (1 * 3600 * 1000) / 2;

function convertMessagesToGradientPoints(
    messages: number[],
): { x: number; y: number }[] {
    if (messages.length < 2) {
        return [];
    }
    let points = new Array(2 * messages.length - 2);
    let gradient;
    for (let i = 1; i < messages.length; i++) {
        gradient = CHANGE_ENERGY_VALUE / (messages[i] - messages[i - 1]);
        points[2 * i - 2] = {x: messages[i - 1] + 0.0001, y: gradient};
        points[2 * i - 1] = {x: messages[i], y: gradient};
    }
    return points;
}

export const MainChart: React.FC = () => {
    const appContext = useContext(AppContext);
    const { messages } = appContext;

    return (
        <LineChart
            style={{ flex: 1 }}
            data={{
                dataSets: [
                    {
                        label: 'demo',
                        values: convertMessagesToGradientPoints(messages),
                    },
                ],
            }}
            legend={{
                enabled: false,
            }}
            yAxis={{
                left: {
                    axisMinimum: 0,
                },
            }}
        />
    );
};
