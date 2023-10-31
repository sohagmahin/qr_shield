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
import {
  createTable,
  getItems,
  insertItem,
  openDatabase,
} from "../../services/db";
import { Link, router } from "expo-router";

type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
  data: string;
};

export default function CodesScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const db = openDatabase();
    createTable();

    // insertItem("sohag", "test description", "qr", "http://awesome.link.qr");

    getItems().then((items: any) => {
      console.log(items);
      setItems(items);
    });

    // delete all items
    // db.transaction((tx) => {
    //   tx.executeSql("DELETE FROM items");
    // });
  }, [refreshing]);

  const qrCodes = (item: Item) => (
    <View key={item.id} className="flex flex-row justify-between p-6 m-1">
      <View>
        <Text className="text-red-400">{item.name}</Text>
        <Text>{item.description}</Text>
      </View>
      <QRCode value={item.data} size={50} />
    </View>
  );

  const barCodes = (
    <View className="flex flex-col justify-between p-6 m-1">
      <View>
        <Text className="text-red-400">Name</Text>
        <Text>Description</Text>
      </View>
      <Barcode
        format="EAN13"
        value="0123456789012"
        text="0123456789012"
        maxWidth={Dimensions.get("window").width / 2}
      />
    </View>
  );
  return (
    <ScrollView
      className="m-4 bg-[#F2F2F2]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {items.map((item) => {
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
            {qrCodes(item)}
          </Pressable>
        );
      })}
      {items.length === 0 && (
        <View className="flex items-center justify-center bg-transparent">
          <Text className="text-3xl font-bold">No items found</Text>
        </View>
      )}
      {/* {barCodes} */}
    </ScrollView>
  );
}
