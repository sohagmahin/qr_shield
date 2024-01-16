import {
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Text, View } from "../../components/Themed";
import QRCode from "react-native-qrcode-svg";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useEffect, useState, useCallback } from "react";

import { Link, router } from "expo-router";

import { useBarCodeStore } from "../../stores/useBarCodeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
  date: string;
  data: string;
};

export default function CodesScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const codes = useBarCodeStore((state) => state.barCode);
  console.log("zustand codes");
  console.log(codes);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const clearStorage = async () => {
    await AsyncStorage.clear();
  };

  // clearStorage();

  const qrCodes = (item: Item) => (
    <View
      key={item.id}
      className="flex flex-row justify-between items-center p-6 m-1 dark:bg-[#121212] rounded-xl"
    >
      <View className="flex-1 bg-transparent">
        <Text className="text-lg font-semibold text-red-400">{item.name}</Text>
        <Text>{item.description}</Text>
        <Text className="font-medium">Expires on {item.date}</Text>
      </View>
      <View className="bg-transparent">
        <QRCode value={item.data} size={50} />
      </View>
    </View>
  );

  const barCodes = (item: Item) => (
    <View
      key={item.id}
      className="flex flex-row justify-between items-center p-6 m-1 dark:bg-[#121212] rounded-xl"
    >
      <View className="flex-1 bg-transparent">
        <Text className="text-lg font-semibold text-red-400">{item.name}</Text>
        <Text>{item.description}</Text>
        <Text className="font-medium">Expires on {item.date}</Text>
      </View>
      <View className="bg-transparent">
        <Barcode
          format="CODE128"
          value={item.data}
          width={0.6}
          height={50}
          maxWidth={Dimensions.get("window").width / 2}
        />
      </View>
    </View>
  );

  return (
    <ScrollView
      className="m-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {codes &&
        codes.map((item: any) => {
          console.log(item);
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                router.push({
                  pathname: "/qr_modal",
                  params: { id: item.id },
                });
              }}
            >
              {item.type === "QRCode" ? qrCodes(item) : barCodes(item)}
            </Pressable>
          );
        })}
      {codes && codes.length === 0 && (
        <View className="flex items-center justify-center bg-transparent">
          <Text className="text-3xl font-bold">No items found</Text>
        </View>
      )}
      {/* {barCodes} */}
    </ScrollView>
  );
}
