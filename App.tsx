/**
 * PlannerApp - React Native App
 * Hoàn thiện theo đề thi PlannerApp
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

enableScreens();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TaskProvider>
        <AppNavigator />
      </TaskProvider>
    </SafeAreaProvider>
  );
}

export default App;
