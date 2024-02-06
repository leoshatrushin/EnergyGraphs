import React from 'react';

import { AppProvider } from './App.provider';
import { StatusBar } from 'react-native';
import { Home } from './screens/Home';
import { FileManager } from './services/FileManager';
FileManager.initializeFileSystem();

export default function App() {
    return (
        <AppProvider>
            <StatusBar hidden={true} />
            <Home />
        </AppProvider>
    );
}
