// screens/PhotoWallScreen.tsx
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Character, Furniture } from "../App";
import { styles } from "../components/Common";

type PhotoWallItem = {
  id: string;
  uri: string;
  createdAt: string;
  ownerName: string;
  ownerId: string;
  ownerType: "character" | "furniture";
};

export default function PhotoWallScreen({
  characters,
  furnitures,
  isLoading,
  onDeletePhoto,
}: {
  characters: Character[];
  furnitures: Furniture[];
  isLoading: boolean;
  onDeletePhoto?: (ownerType: "character" | "furniture", ownerId: string, photoId: string) => void;
}) {
  const [mode, setMode] = useState<"characters" | "furnitures">("characters");
  const [preview, setPreview] = useState<PhotoWallItem | null>(null);

  // 建立要顯示的照片陣列（依 mode）
  const allPhotos = useMemo<PhotoWallItem[]>(() => {
    const list =
      mode === "characters"
        ? characters.flatMap((c) =>
            c.photos.map((p) => ({
              id: p.id,
              uri: p.uri,
              createdAt: p.createdAt,
              ownerName: c.name,
              ownerId: c.id,
              ownerType: "character" as const,
            }))
          )
        : furnitures.flatMap((f) =>
            f.photos.map((p) => ({
              id: p.id,
              uri: p.uri,
              createdAt: p.createdAt,
              ownerName: f.name,
              ownerId: f.id,
              ownerType: "furniture" as const,
            }))
          );

    // 新→舊排序
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [mode, characters, furnitures]);

  const handleDelete = (item: PhotoWallItem) => {
    if (!onDeletePhoto) return;
    // 二次確認
    Alert.alert("刪除照片", `確定要刪除「${item.ownerName}」的這張照片？`, [
      { text: "取消", style: "cancel" },
      {
        text: "刪除",
        style: "destructive",
        onPress: () => {
          onDeletePhoto(item.ownerType, item.ownerId, item.id);
          setPreview(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* header + mode switch */}
      <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#333" }}>照片牆</Text>
          <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>{mode === "characters" ? "顯示角色的照片（新到舊）" : "顯示家具的照片（新到舊）"}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={[styles.modeButton, mode === "characters" && styles.modeButtonActive]}
            onPress={() => setMode("characters")}
          >
            <Text style={[styles.modeButtonText, mode === "characters" && styles.modeButtonTextActive]}>角色照片</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeButton, mode === "furnitures" && styles.modeButtonActive]}
            onPress={() => setMode("furnitures")}
          >
            <Text style={[styles.modeButtonText, mode === "furnitures" && styles.modeButtonTextActive]}>家具照片</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* empty / loading handling */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text>載入中…</Text>
        </View>
      ) : allPhotos.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
          <Text style={{ textAlign: "center", color: "#666" }}>
            目前沒有任何照片（切換來源或先到角色 / 家具頁面為項目拍照）
          </Text>
        </View>
      ) : (
        <FlatList
          data={allPhotos}
          keyExtractor={(it) => it.id}
          numColumns={3}
          contentContainerStyle={styles.photoWallContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.wallItem}
              onPress={() => setPreview(item)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.uri }} style={styles.wallImage} />
              <View style={styles.wallInfo}>
                <Text style={styles.wallName} numberOfLines={1}>
                  {item.ownerName}
                </Text>
                <Text style={styles.wallDate} numberOfLines={1}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ---- Modal: 大圖預覽 ---- */}
      <Modal
        visible={preview !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setPreview(null)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "center", alignItems: "center" }}>
          {/* 關閉叉叉 */}
          <TouchableOpacity
            onPress={() => setPreview(null)}
            style={{ position: "absolute", top: Platform.OS === "ios" ? 56 : 40, right: 20, zIndex: 10 }}
          >
            <Text style={{ color: "#fff", fontSize: 24 }}>✕</Text>
          </TouchableOpacity>

          {preview && (
            <>
              <Image
                source={{ uri: preview.uri }}
                style={{ width: "92%", height: "72%", resizeMode: "contain", borderRadius: 12 }}
              />

              <View style={{ marginTop: 12, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{preview.ownerName}</Text>
                <Text style={{ color: "#fff", fontSize: 12, marginTop: 4 }}>{new Date(preview.createdAt).toLocaleString()}</Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 18 }}>
                <TouchableOpacity
                  style={{ backgroundColor: "#d9534f", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                  onPress={() => preview && handleDelete(preview)}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>刪除</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginLeft: 12, backgroundColor: "rgba(255,255,255,0.12)" }}
                  onPress={() => setPreview(null)}
                >
                  <Text style={{ color: "#fff" }}>關閉</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
