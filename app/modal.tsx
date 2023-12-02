import { StatusBar } from "expo-status-bar";
import { Platform, TextInput, Button } from "react-native";
import uuid from "react-native-uuid";
import { Text, View } from "../components/Themed";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useBarCodeStore } from "../stores/useBarCodeStore";
import { useEffect, useState } from "react";

type Inputs = {
  name: string;
  description: string;
  date: Date;
  code_info: string;
};

export default function ModalScreen() {
  const local = useLocalSearchParams();
  const { id, data } = local;
  const [editItem, setEditItem] = useState<any>();
  const codes = useBarCodeStore((state) => state.barCode);

  const setBarCode = useBarCodeStore((state) => state.setBarCode);
  const editBarCode = useBarCodeStore((state) => state.editBarCode);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      description: "",
      date: new Date(),
      code_info: "",
    },
  });

  // receive data from scanner
  useEffect(() => {
    if (!data) return;
    setValue("code_info", data.toString());
  }, [data]);

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
    setValue("date", editItem.date);
    setValue("code_info", editItem.code_info);
  }, [editItem]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    // insertItem(data.name, data.description, "qr", data.code_info);
    if (id) {
      editBarCode({
        id: id,
        name: data.name,
        description: data.description,
        type: "qr",
        data: data.code_info,
      });
    } else {
      setBarCode({ ...data, type: "qr", id: uuid.v4(), data: data.code_info });
    }

    alert(`Item ${id ? "edited" : "added"} successfully!`);

    if (id) {
      router.back();
    } else {
      // push with replacement
      router.push({ pathname: "/(tabs)" });
    }
  };

  return (
    <View className="flex items-center">
      <Text className="text-3xl font-bold">Add new item</Text>
      <View className="w-11/12">
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
            <TextInput
              className="h-12 p-2 mt-5 border-2 border-gray-300 rounded-md "
              placeholder="Date"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value.toString()}
            />
          )}
          name="date"
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="h-12 p-2 mt-5 border-2 border-gray-300 rounded-md "
              placeholder="Code info"
              onBlur={onBlur}
              editable={false}
              onChangeText={onChange}
              // defaultValue={data.toString()}
              value={value.toString()}
            />
          )}
          name="code_info"
        />
      </View>
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
