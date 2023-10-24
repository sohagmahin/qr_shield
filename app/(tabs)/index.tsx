import { StyleSheet, Dimensions } from "react-native";
import { Text, View } from "../../components/Themed";
import QRCode from "react-native-qrcode-svg";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useEffect, useState } from "react";
import {
  createTable,
  getItems,
  insertItem,
  openDatabase,
} from "../../services/db";

type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
  data: string;
};

export default function CodesScreen() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    const db = openDatabase();
    createTable();

    insertItem("sohag", "test description", "qr", "http://awesome.link.qr");

    getItems().then((items: any) => {
      console.log(items);
      setItems(items);
    });

    // delete all items
    // db.transaction((tx) => {
    //   tx.executeSql("DELETE FROM items");
    // });
  }, []);

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
    <View className="m-4 bg-[#F2F2F2]">
      {items.map((item) => {
        return qrCodes(item);
      })}
      {/* {barCodes} */}
    </View>
  );
}
