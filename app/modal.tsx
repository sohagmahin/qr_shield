import { StatusBar } from "expo-status-bar";
import {
  Platform,
  // TextInput,
  Button,
  Pressable,
  Dimensions,
  useColorScheme,
} from "react-native";
import uuid from "react-native-uuid";
import { Text, View, TextInput } from "../components/Themed";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useBarCodeStore } from "../stores/useBarCodeStore";
import { useEffect, useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import useDatePickerStore from "../stores/useDatePickerStore";
import BottomSheets from "../components/bottom_sheets";
import Ionicons from "@expo/vector-icons/Ionicons";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

type Inputs = {
  name: string;
  description: string;
  date: String;
  code_info: string;
  type: string;
};

export default function ModalScreen() {
  const local = useLocalSearchParams();
  const { id, data, type } = local;
  const [editItem, setEditItem] = useState<any>();
  const codes = useBarCodeStore((state) => state.barCode);

  const setBarCode = useBarCodeStore((state) => state.setBarCode);
  const editBarCode = useBarCodeStore((state) => state.editBarCode);

  const [date, setDate] = useState(new Date());

  const show = useDatePickerStore((state) => state.show);
  const toggle = useDatePickerStore((state) => state.toggle);

  const addZero = (num: number) => {
    if (num < 10) {
      return `0${num}`;
    }
    return num;
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
      date: `${date.getFullYear()}-${addZero(date.getMonth())}-${addZero(
        date.getDate()
      )}`,
      code_info: "",
      type: "",
    },
  });

  // receive data from scanner
  useEffect(() => {
    if (data) setValue("code_info", data.toString());
    if (type) setValue("type", type.toString());
  }, [data, type]);

  // edit bar code
  useEffect(() => {
    if (!id) return;
    codes.forEach((code: any) => {
      if (code.id === id) {
        console.log("inside edit view");
        console.log(code);
        setEditItem(code);
      }
    });
    () => {
      setEditItem(undefined);
    };
  }, [id]);

  useEffect(() => {
    if (!editItem) return;
    setValue("name", editItem.name);
    setValue("description", editItem.description);
    setValue("type", editItem.type);
    setValue("date", editItem.date);
    setValue("code_info", editItem.data);
  }, [editItem]);

  useEffect(() => {
    setValue(
      "date",
      `${date.getFullYear()}-${addZero(date.getMonth())}-${addZero(
        date.getDate()
      )}`
    );
  }, [date]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("submite data");
    console.log(data);
    // insertItem(data.name, data.description, "qr", data.code_info);
    if (id) {
      editBarCode({
        id: id,
        name: data.name,
        description: data.description,
        type: data.type,
        date: data.date,
        data: data.code_info,
      });
    } else {
      setBarCode({
        ...data,
        type: data.type,
        id: uuid.v4(),
        data: data.code_info,
      });
    }

    alert(`Item ${id ? "edited" : "added"} successfully!`);

    if (id) {
      router.back();
    } else {
      // push with replacement
      router.push({ pathname: "/(tabs)" });
    }
  };

  const openDatePicker = () => {
    if (Platform.OS === "ios") {
      toggle();
    } else if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: new Date(date),
        mode: "date",
        onChange: (date) => {
          setDate(new Date(date.nativeEvent?.timestamp || ""));
        },
      });
    }
  };

  const showPreviewCode = () => {
    let codeType = editItem ? editItem.type : type;
    let codeData = editItem ? editItem.data : data;

    return (
      <View className="self-center">
        {codeType === "QRCode" ? (
          <QRCode value={codeData} size={200} />
        ) : (
          <Barcode
            format="CODE128"
            value={codeData || "12345"}
            text={codeData || ""}
            maxWidth={Dimensions.get("window").width / 1.2}
          />
        )}
      </View>
    );
  };

  const AndroidAppBar = (
    <View className="flex flex-row items-center justify-between w-screen h-16 p-3 shadow">
      <Ionicons
        name="arrow-back"
        size={24}
        color={useColorScheme() === "dark" ? "white" : "black"}
        onPress={() => {
          router.back();
        }}
      />
      <Text className="self-center text-lg font-bold">
        {id ? "Edit" : "Add New Code"}
      </Text>
      <Text> </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex items-center flex-1 bg-white dark:bg-[#121212]">
      {Platform.OS === "android" && AndroidAppBar}
      {/* <View className="flex items-center flex-1"> */}
      <View className="w-11/12 dark:bg-[#121212]">
        {showPreviewCode()}
        <Text className="px-10 text-sm text-center opacity-30">
          The barcode may looks different but holds the same data.
        </Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="h-12 p-2 mt-5 border-2 border-gray-300 rounded-md "
              placeholder="Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text className="py-2 text-red-500">This is required.</Text>
        )}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="h-12 p-2 mt-5 border-2 border-gray-300 rounded-md "
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="description"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-row items-center gap-x-2">
              <TextInput
                className="flex-1 h-12 p-2 mt-5 border-2 border-gray-300 rounded-md "
                placeholder="Date"
                onBlur={onBlur}
                // onChangeText={onChange}
                editable={false}
                value={value.toString()}
              />
              {/* Date picker icon button */}
              <Pressable onPress={openDatePicker} className="mt-5">
                <Ionicons name="calendar-outline" size={32} color="green" />
              </Pressable>
            </View>
          )}
          name="date"
        />
      </View>
      <Pressable
        className="flex items-center justify-center w-11/12 h-12 mt-5 bg-red-400 rounded-md"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-lg font-bold text-white">
          {id ? "Update" : "Save"}
        </Text>
      </Pressable>
      {/* IOS date picker */}
      {show && Platform.OS === "ios" && (
        <BottomSheets date={new Date(date)} setDate={setDate} />
      )}

      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      {/* </View> */}
    </SafeAreaView>
  );
}
