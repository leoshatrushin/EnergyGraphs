import React, { useContext } from 'react';
import { LineChart } from 'react-native-charts-wrapper';
import { AppContext } from '../App.provider';
import { processColor } from 'react-native';

const CHANGE_ENERGY_VALUE = (1 * 3600 * 1000) / 2;

function convertMessagesToGradientPoints(
    messages: number[],
): { x: number; y: number }[] {
    if (messages.length < 2) {
        return [];
    }
    let points = new Array(messages.length - 1);
    let gradient;
    let endTime = messages[messages.length - 2];
    let startTime = endTime - 60000;
    for (let i = 1; i < messages.length; i++) {
        gradient = CHANGE_ENERGY_VALUE / (messages[i] - messages[i - 1]);
        points[i - 1] = {
            x: (messages[i - 1] - startTime) / 1000,
            y: gradient,
        };
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
                        config: {
                            color: processColor('cyan'),
                            mode: 'STEPPED',
                            drawCircles: false,
                            drawValues: false,
                            fillColor: processColor('cyan'),
                            fillAlpha: 0xa0,
                            drawFilled: true,
                        },
                    },
                ],
            }}
            legend={{
                enabled: false,
            }}
            yAxis={{
                left: {
                    axisMinimum: 0,
                    axisMaximum: 8000,
                    textColor: processColor('white'),
                },
                right: {
                    axisMinimum: 0,
                    axisMaximum: 8000,
                    textColor: processColor('white'),
                },
            }}
            xAxis={{
                axisMinimum: 0,
                axisMaximum: 60,
                textColor: processColor('white'),
                position: 'BOTTOM',
            }}
            chartDescription={{
                text: '',
            }}
        />
    );
};
