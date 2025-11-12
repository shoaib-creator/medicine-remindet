import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import PatientScreen from '../screens/PatientScreen';
import ClinicScreen from '../screens/ClinicScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Patient') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Clinic') {
              iconName = focused ? 'medkit' : 'medkit-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Patient" 
          component={PatientScreen}
          options={{ title: 'Medicine Reminder' }}
        />
        <Tab.Screen 
          name="Clinic" 
          component={ClinicScreen}
          options={{ title: 'Clinic Stock' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
