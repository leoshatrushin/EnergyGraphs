import React from 'react';

import {AppProvider} from './App.provider';
import {Home} from './screens/Home';

export default function App() {
    return (
        <AppProvider>
            <Home />
        </AppProvider>
    );
}
