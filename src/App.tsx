import React from 'react';

import { AppProvider } from './App.provider';
import { StatusBar } from 'react-native';
import { Home } from './screens/Home';

export default function App() {
    return (
        <AppProvider>
            <StatusBar hidden={true} />
            <Home />
        </AppProvider>
    );
}
