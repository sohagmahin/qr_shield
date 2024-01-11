import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Pressable,
  Platform,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();

      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log(data);
    console.log(type);

    // In android qr code is 256
    // In ios qr code is org.iso.QRCode
    const barCodeType =
      Platform.OS === "ios"
        ? type?.split(".")[2]
        : type === 256
        ? "QRCode"
        : "barcode";
    router.push({
      pathname: "/modal",
      params: { data: data, type: barCodeType },
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    // <SafeAreaView>
    <View className="flex items-center justify-end flex-1">
      {!scanned && (
        <BarCodeScanner
          className=""
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <View className="absolute gap-2 bottom-32 ">
        <Pressable
          className="self-center p-4 bg-red-400 rounded-full"
          onPress={() => setScanned((prev) => !prev)}
        >
          <Text className="text-xl font-semibold text-white ">
            {scanned ? "Tap to open camera" : "Stop Camera Scan"}
          </Text>
        </Pressable>

        <Pressable
          className="self-center p-4 bg-red-400 rounded-full"
          onPress={() => setScanned((prev) => !prev)}
        >
          <Text className="text-xl font-semibold text-white ">
            Get from gallery
          </Text>
        </Pressable>
      </View>
      {/* stop scanning */}
    </View>
    // </SafeAreaView>
  );
};

export default ScanScreen;
