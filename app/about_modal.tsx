import { Platform } from "react-native";
import { Text, View } from "../components/Themed";
import React from "react";
import packageJson from "../package.json";

const AboutModal = () => {
  let androidList = [
    "aztec",
    "codabar",
    "code39",
    "code93",
    "code128",
    "datamatrix",
    "ean13",
    "ean8",
    "itf14",
    "maxicode",
    "pdf417",
    "rss14",
    "rssexpanded",
    "upc_a",
    "upc_e",
    "upc_ean",
    "qr",
  ];

  const iosList = [
    "aztec",
    "codabar",
    "code39",
    "code93",
    "code128",
    "code39mod43",
    "datamatrix",
    "ean13",
    "ean8",
    "interleaved2of5",
    "itf14",
    "pdf417",
    "upc_e",
    "qr",
  ];

  return (
    <View className="flex items-center h-full m-4 bg-transparent gap-y-2">
      <Text className="pt-1 text-lg font-semibold"> Supported types: </Text>

      {Platform.OS === "android" && (
        <View className="flex flex-row flex-wrap justify-center gap-1 bg-transparent">
          {androidList.map((item: any) => {
            return (
              <Text
                key={item}
                className="p-1 bg-white opacity-75 dark:bg-[#121212]"
              >
                {item}
              </Text>
            );
          })}
        </View>
      )}

      {Platform.OS === "ios" && (
        <View className="flex flex-row flex-wrap justify-center gap-1 bg-transparent">
          {iosList.map((item: any) => {
            return (
              <Text
                key={item}
                className="p-1 bg-white opacity-75 dark:bg-[#121212]"
              >
                {item}
              </Text>
            );
          })}
        </View>
      )}

      <View className="flex items-center justify-center bg-transparent">
        <Text className="text-xl font-bold ">{packageJson.name || ""}</Text>
        <Text className="text-xs opacity-75">
          Version :{packageJson.version || ""}
        </Text>
      </View>
    </View>
  );
};

export default AboutModal;
