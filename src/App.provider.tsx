import React, { createContext, useEffect, useState } from 'react';
import Orientation from 'react-native-orientation-locker';

export type AppContextType = {
    orientation: string;
    messages: number[];
    setMessages: React.Dispatch<React.SetStateAction<number[]>>;
};

export const AppContext = createContext<AppContextType>({
    orientation: 'PORTRAIT',
    messages: [],
    setMessages: () => {},
});

type AppProviderProps = {
    children: React.ReactNode;
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

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [orientation, setOrientation] = useState('PORTRAIT');
    const [messages, setMessages] = useState<number[]>(
        [],
        // Array.from({ length: 20 }, () => Math.random() * 100),
    );

    useEffect(() => {
        Orientation.unlockAllOrientations();
        const initialOrientation = Orientation.getInitialOrientation();
        setOrientation(initialOrientation);

        const onOrientationChange = (newOrientation: string) => {
            console.log('Orientation changed to ', newOrientation);
            setOrientation(newOrientation);
        };

        Orientation.addOrientationListener(onOrientationChange);
        setMessages(dummyMessages);

        return () => {
            Orientation.removeOrientationListener(onOrientationChange);
        };
    }, []);

    return (
        <AppContext.Provider
            value={{ orientation: orientation, messages, setMessages }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => React.useContext(AppContext);
