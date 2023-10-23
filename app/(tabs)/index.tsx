import { StyleSheet, Dimensions } from "react-native";
import { Text, View } from "../../components/Themed";
import QRCode from "react-native-qrcode-svg";
import Barcode from "@kichiyaki/react-native-barcode-generator";

export default function CodesScreen() {
  const qrCodes = (
    <View className="flex flex-row justify-between p-6 m-1">
      <View>
        <Text className="text-red-400">Name</Text>
        <Text>Description</Text>
      </View>
      <QRCode value="http://awesome.link.qr" size={50} />
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
      {qrCodes}
      {barCodes}
    </View>
  );
}
