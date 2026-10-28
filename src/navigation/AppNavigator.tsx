import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import colors from '../theme/colors';

export type RootStackParamList = {
  TaskList: undefined;
  TaskDetail: { taskId: string };
  TaskForm: { taskId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TaskList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primaryDark,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: colors.textPrimary,
          },
          headerShadowVisible: true,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{
            title: 'Danh sách công việc',
            headerShown: false, // We use custom header inside TaskListScreen
          }}
        />
        <Stack.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{
            title: 'Chi tiết công việc',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={{
            title: 'Thông tin công việc',
            headerBackTitle: 'Quay lại',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
