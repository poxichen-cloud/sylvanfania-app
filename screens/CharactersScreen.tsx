// screens/CharactersScreen.tsx
import React, { useState } from "react";
import { SafeAreaView, FlatList, ActivityIndicator, Alert ,View, Text} from "react-native";
import { Character, PhotoItem } from "../App";
import { CharacterCard, styles } from "../components/Common";
import * as ImagePicker from "expo-image-picker";

type Props = {
  characters: Character[];
  isLoading: boolean;
  onCreateCharacter: (payload: any) => void;
  onAddPhoto: (characterId: string, photo: PhotoItem) => void;
};

export default function CharactersScreen({
  characters,
  isLoading,
  onCreateCharacter,
  onAddPhoto,
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddPhoto = async (characterId: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("需要相機權限", "請到設定中允許此 App 使用相機。");
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
      if (res.canceled) return;
      const uri = res.assets[0].uri;
      onAddPhoto(characterId, { id: Date.now().toString(), uri, createdAt: new Date().toISOString() });
    } catch (err) {
      console.log("拍照失敗：", err);
      Alert.alert("錯誤", "無法開啟相機。");
    }
  };

  const handlePreviewPhoto = (parentId: string, photo: PhotoItem) => {
    // 若你已經把 preview modal handler 傳到此 screen，可在這裡呼叫
    // 目前此 function 僅示範（不會做任何操作）
    console.log("preview", parentId, photo.id);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { paddingTop: 28 }]}>
        <ActivityIndicator style={{ marginTop: 24 }} size="large" />
      </SafeAreaView>
    );
  }

  return (
    // 這裡加入 paddingTop 讓整個角色頁面往下移（只影響此 screen）
    <SafeAreaView style={styles.safeArea}>
      <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>角色列表</Text>
        </View>
      </View>


      <FlatList
        data={characters}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            expanded={expandedId === item.id}
            onToggle={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
            onAddPhoto={() => handleAddPhoto(item.id)}
            onPreviewPhoto={handlePreviewPhoto}
          />
        )}
      />

    </SafeAreaView>
  );
}
