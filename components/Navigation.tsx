import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { colors } from "../styles/colors";
export default function AppNavigation() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 60,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          paddingBottom: 10,
        },
        headerShown: false,
        tabBarIconStyle: { marginBottom: -5 },
        tabBarLabelStyle: { fontSize: 12, marginTop: -5 },
        tabBarActiveTintColor: colors.cta,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming Parties",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
