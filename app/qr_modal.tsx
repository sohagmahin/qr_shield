import { StatusBar } from "expo-status-bar";
import {
  Platform,
  TextInput,
  Button,
  Alert,
  Dimensions,
  useColorScheme,
} from "react-native";
import { Text, View } from "../components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import { useEffect, useState } from "react";
import { useBarCodeStore } from "../stores/useBarCodeStore";
import { SafeAreaView } from "react-native-safe-area-context";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "../constants/Haptics";

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
    Haptics.hapticWarning();
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this code?",
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
  }, [id, codes]);

  const AndroidAppBar = (
    <SafeAreaView>
      <View className="flex flex-row items-center justify-between h-16 p-3 shadow">
        <Ionicons
          name="arrow-back"
          size={24}
          color={useColorScheme() === "dark" ? "white" : "black"}
          onPress={() => {
            router.back();
          }}
        />
        <Text className="text-lg font-bold text-">Preview</Text>
        <View className="flex flex-row gap-4 bg-transparent">
          <Ionicons
            name="trash"
            size={24}
            color={useColorScheme() === "dark" ? "white" : "black"}
            onPress={() => {
              showDeleteAlret();
            }}
          />
          <Ionicons
            name="create"
            size={24}
            color={useColorScheme() === "dark" ? "white" : "black"}
            onPress={() => {
              router.push({
                pathname: "/modal",
                params: { id: item?.id || 0 },
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    // <SafeAreaView>
    <>
      {/* Custom app bar  only for android
          1. go back button
          2. title (center aligned)
          3. delete button on right side
          4. edit button on right side
      */}
      {Platform.OS === "android" && AndroidAppBar}
      <View className="flex items-center h-full">
        {item ? (
          <View className="flex flex-col">
            {Platform.OS === "ios" && (
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
            )}
            <View className="flex items-center justify-center flex-grow">
              <View className="p-2 bg-white">
                {item.type === "QRCode" ? (
                  <QRCode value={item.data.toString()} size={300} />
                ) : (
                  <Barcode
                    format="CODE128"
                    value={item.data}
                    text={item.data}
                    maxWidth={Dimensions.get("window").width / 1.2}
                  />
                )}
              </View>
              <Text className="mt-5 text-3xl font-bold">{item.name}</Text>
            </View>
          </View>
        ) : (
          <Text>loading</Text>
        )}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </>
  );
}
