import { BREAKPOINTS, CHANGE_ENERGY_VALUE } from '../constants';
import ReactNativeBlobUtil from 'react-native-blob-util';
const fs = ReactNativeBlobUtil.fs;
const DocumentDir = ReactNativeBlobUtil.fs.dirs.DocumentDir;

type ChartPoints = {
    x: number;
    y: number;
}[];

type AppState = {
    fileSystemInitialized: boolean;
    latestValues: {
        value: number;
        lastUpdated: number;
        endTime: number;
    }[];
};

type latestValue = {
    value: number;
    lastUpdated: number;
    endTime: number;
};

type DataBuffer = {
    values: number[];
    endTime: number;
};

let latestValues: latestValue[] | Promise<latestValue[]> = (async function getLatestValues() {
    const res = await fs.readFile(DocumentDir + '/latest', 'utf8');
    return JSON.parse(res);
})();

let buffers: DataBuffer[] | Promise<DataBuffer[]> = (async function getBuffers() {
    await latestValues;
    return (latestValues as unknown as latestValue[]).map((latestValue, breakpointIndex) => ({
        values: [],
        endTime: getRangeEnd(latestValue.endTime, breakpointIndex),
    }));
})();

function write(value: number, timestamp: number, breakpointIndex: number) {
    const { barWidth, maxRange } = BREAKPOINTS[breakpointIndex];

    // const buffer = buffers[breakpointIndex];
    // buffer.push(value);

    // let { entries, dataView } = buffer;
    // dataView.setFloat32(entries++ * 4, value, true);
    // if (entries * 4 == dataView.byteLength) {
    //     const base64string = Buffer.from(arrayBuffer).toString('base64');
    //     // const fileNo = getFileNo();
    // }
}

function getRangeEnd(timestamp: number, breakpointIndex: number): number {
    let { maxRange } = BREAKPOINTS[breakpointIndex];

    return ((timestamp % maxRange) + 1) * maxRange;
}

function getFileNo(timestamp: number, breakpointIndex: number): number {
    let { maxRange } = BREAKPOINTS[breakpointIndex];

    return timestamp % maxRange;
}

function getFiles(from: number, to: number, breakpointIndex: number): string[] {
    let { barWidth, maxRange } = BREAKPOINTS[breakpointIndex];

    let files = [];
    let fileno = getFileNo(from, breakpointIndex);
    while (fileno < to) {
        files.push(`${DocumentDir}/${barWidth}/${fileno}`);
        fileno += maxRange;
    }

    return files;
}

export const FileManager = {
    async initializeFileSystem() {
        for (let breakpoint of BREAKPOINTS) {
            fs.mkdir(`${DocumentDir}/${breakpoint.barWidth}`);
        }
        fs.createFile(DocumentDir + '/latest', '', 'base64');
    },
    loadData(from: number, to: number, breakpointIndex: number) {
        let files = getFiles(from, to, breakpointIndex);

        let points: ChartPoints = [];
        let x = from % BREAKPOINTS[breakpointIndex].maxRange;

        files.forEach(async file => {
            const data = await fs.readFile(file, 'base64');
            const buffer = Buffer.from(data, 'base64');
            for (let i = 0; i < buffer.length; i += 4) {
                points.push({ x, y: buffer.readFloatLE(i) });
            }
        });
    },
    updateLatestValues(timestamp: number) {
        if (latestValues instanceof Promise) {
            throw new Error(`latestValues must be resolved before calling FileManager.updateLatestValues`);
        }

        latestValues.forEach(function updateValue(latestValue, breakpointIndex) {
            if (timestamp < latestValue.endTime) {
                latestValue.value += CHANGE_ENERGY_VALUE;
            } else {
                // const overlapLeft = latestValue.endTime - latestValue.lastUpdated;
                const overlapRight = timestamp - latestValue.endTime;
                const deltaT = timestamp - latestValue.lastUpdated;
                // const deltaE = (overlapLeft / deltaT) * CHANGE_ENERGY_VALUE;
                // const finalValue = latestValue.value + deltaE;
                latestValue = {
                    value: (overlapRight / deltaT) * CHANGE_ENERGY_VALUE,
                    lastUpdated: timestamp,
                    endTime: latestValue.endTime + BREAKPOINTS[breakpointIndex].barWidth,
                };
            }
        });
    },
    writeData(data: number[], breakpointIndex: number) {
        const arrayBuffer = new ArrayBuffer(data.length * 4);
        const view = new DataView(arrayBuffer);

        if (breakpointIndex === 0) {
            data.forEach((value, index) => view.setUint32(index * 4, value, true));
        } else {
            data.forEach((value, index) => view.setFloat32(index * 4, value, true));
        }

        // const base64string = Buffer.from(arrayBuffer).toString('base64');
    },
};
