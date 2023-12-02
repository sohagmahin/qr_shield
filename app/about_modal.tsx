import { View, Text, Platform } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

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
    <View className="flex items-center justify-center text-center">
      <ScrollView>
        {/* show list item as grid view */}
        {Platform.OS === "android" && (
          <>
            <Text className="text-xl font-bold">Android</Text>
            {androidList.map((item: any) => {
              return <Text key={item}>{item}</Text>;
            })}
          </>
        )}

        {Platform.OS === "ios" && (
          <>
            <Text className="text-xl font-bold">iOS</Text>
            {iosList.map((item: any) => {
              return <Text key={item}>{item}</Text>;
            })}
          </>
        )}

        <Text className="text-2xl font-bold">About</Text>
        <Text className="text-xl font-bold">Version 1.0.0</Text>
        <Text className="text-xl font-bold">Author: Prashant</Text>
        <Text className="text-xl font-bold">Contact: </Text>
      </ScrollView>
    </View>
  );
};

export default AboutModal;
