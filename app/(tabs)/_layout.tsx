import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { Text, View } from "../../components/Themed";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          position: "absolute",
          bottom: 50,
          borderRadius: 30,
          height: 60,
          marginHorizontal: "16%",
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "red",
          height: 60,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "QR Wallet",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`flex flex-row items-center px-3 py-2 rounded-full gap-x-2 ${
                focused ? "bg-red-50 dark:bg-black" : "dark:bg-transparent"
              } `}
            >
              <TabBarIcon name="qrcode" color={color} />
              <Text
                className={`text-xl ${
                  focused
                    ? "font-semibold text-red-400 dark:text-white"
                    : "font-normal opacity-50"
                }`}
              >
                Home
              </Text>
            </View>
          ),
          headerRight: () => (
            <Link href="/about_modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan code",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`flex flex-row items-center px-3 py-2 rounded-full gap-x-2 ${
                focused ? "bg-red-50 dark:bg-black" : "dark:bg-transparent"
              } `}
            >
              <TabBarIcon name="camera-retro" color={color} />
              <Text
                className={`text-xl ${
                  focused
                    ? "font-semibold text-red-400 dark:text-white"
                    : "font-normal opacity-50"
                }`}
              >
                Scan
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
