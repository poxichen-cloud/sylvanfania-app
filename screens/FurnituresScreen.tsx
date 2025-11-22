// screens/FurnituresScreen.tsx
import React, { useState } from "react";
import { SafeAreaView, FlatList, View, Text } from "react-native";
import { Furniture, PhotoItem } from "../App";
import { FurnitureCard, styles } from "../components/Common";
import * as ImagePicker from "expo-image-picker";

type Props = {
  furnitures: Furniture[];
  isLoading: boolean;
  onCreateFurniture: (payload: any) => void;
  onAddPhoto: (furnitureId: string, photo: PhotoItem) => void;
};

export default function FurnituresScreen({ furnitures, isLoading, onCreateFurniture, onAddPhoto }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddPhoto = async (furnitureId: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("需要相機權限");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4,3], quality: 0.7 });
    if (res.canceled) return;
    const uri = res.assets[0].uri;
    onAddPhoto(furnitureId, { id: Date.now().toString(), uri, createdAt: new Date().toISOString() });
  };

  const handlePreviewPhoto = (parentId: string, photo: PhotoItem) => {
    console.log("preview furniture photo", parentId, photo.id);
  };

  if (isLoading) return <SafeAreaView style={styles.safeArea}></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>家具列表</Text>
        </View>
      </View>
      <FlatList data={furnitures} keyExtractor={it => it.id} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
        <FurnitureCard
          item={item}
          expanded={expandedId === item.id}
          onToggle={() => setExpandedId(prev => prev === item.id ? null : item.id)}
          onAddPhoto={() => handleAddPhoto(item.id)}
          onPreviewPhoto={handlePreviewPhoto}
        />
      )} />
    </SafeAreaView>
  );
}
