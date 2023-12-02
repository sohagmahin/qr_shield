import { StatusBar } from "expo-status-bar";
import { Platform, TextInput, Button, Alert } from "react-native";
import { Text, View } from "../components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";
import { useBarCodeStore } from "../stores/useBarCodeStore";

type Item = {
  id: number;
  name: string;
  description: string;
  type: string;
  data: string;
};

export default function QRModalScreen() {
  const [item, setItem] = useState<Item>();
  // const [item, setItem] = useState();
  const local = useLocalSearchParams();
  const { id } = local;
  const codes = useBarCodeStore((state) => state.barCode);
  const removeBarCode = useBarCodeStore((state) => state.removeBarCode);

  const removeItem = (id: number) => {
    // deleteItem(id);
    console.log(id);
    removeBarCode(id);
  };

  const showDeleteAlret = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },

        {
          text: "OK",
          onPress: () => {
            removeItem(item?.id as number);
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!id) return;
    // getItem(parseInt(id.toString()));
    // getItem(parseInt(id.toString())).then((item: any) => {
    //   console.log("itemss ========>>>>");
    //   console.log(item);
    //   setItem(item);
    // });

    codes.forEach((code: any) => {
      if (code.id === id) {
        console.log("inside qr view");
        console.log(code);
        setItem(code);
      }
    });
  }, [id]);
  return (
    <View className="flex items-center h-full">
      {item ? (
        <View className="flex flex-col">
          <View className="flex flex-row justify-between w-screen px-5 py-2">
            <Text
              onPress={() => showDeleteAlret()}
              className="text-lg font-normal"
            >
              Delete
            </Text>
            <Text
              onPress={() =>
                router.push({
                  pathname: "/modal",
                  params: { id: item?.id },
                })
              }
              className="text-lg font-normal"
            >
              Edit
            </Text>
          </View>
          <View className="flex items-center justify-center flex-grow">
            <QRCode value={item.data.toString()} size={300} />
            <Text className="mt-5 text-3xl font-bold">{item.name}</Text>
          </View>
        </View>
      ) : (
        <Text>loading</Text>
      )}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
