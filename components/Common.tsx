// components/Common.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { PhotoItem, Character, Furniture } from "../App"; // 注意路徑

export const UPLOADED_LOGO_PATH = "./assets/forest_app_icon.png"; // 你上傳的檔案路徑 (可當示例圖)

// 簡單 Avatar
export const AvatarCircle: React.FC<{ title: string; style?: any }> = ({ title, style }) => (
  <View style={[styles.avatarCircle, style]}>
    <Text style={styles.avatarText}>{title.slice(0, 1)}</Text>
  </View>
);

// 角色 / 家具的卡片（簡化，UI 與你原本的很相似）
// 注意：這裡只負責顯示、photo list 也會把按下事件透過 props 回傳
export const CharacterCard: React.FC<{
  character: Character;
  expanded: boolean;
  onToggle: () => void;
  onAddPhoto: () => void;
  onPreviewPhoto: (parentId: string, photo: PhotoItem) => void;
}> = ({ character, expanded, onToggle, onAddPhoto, onPreviewPhoto }) => {
  const renderStars = (count: number) => "★".repeat(count) + "☆".repeat(5 - count);
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AvatarCircle title={character.name} />
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardName}>{character.name}</Text>
            <Text style={styles.cardFamily}>{character.family}</Text>
            <Text style={styles.cardRating}>喜愛指數：{renderStars(character.rating)}</Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {character.tags.map(t => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>

        {expanded && (
          <>
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>角色故事</Text>
              <Text style={styles.descriptionText}>{character.description}</Text>
            </View>

            <View style={styles.photoHeaderRow}>
              <Text style={styles.sectionTitle}>照片紀錄</Text>
              <TouchableOpacity style={styles.addPhotoButton} onPress={onAddPhoto}><Text style={styles.addPhotoButtonText}>＋ 新增照片</Text></TouchableOpacity>
            </View>

            {character.photos.length === 0 ? (
              <Text style={styles.noPhotoText}>目前還沒有照片</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {character.photos.map(p => (
                  <TouchableOpacity key={p.id} style={{ marginRight: 8 }} onPress={() => onPreviewPhoto(character.id, p)}>
                    <Image source={{ uri: p.uri }} style={styles.photoImage} />
                    <Text style={styles.photoDate}>{new Date(p.createdAt).toLocaleDateString()}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const FurnitureCard: React.FC<{
  item: Furniture;
  expanded: boolean;
  onToggle: () => void;
  onAddPhoto: () => void;
  onPreviewPhoto: (parentId: string, photo: PhotoItem) => void;
}> = ({ item, expanded, onToggle, onAddPhoto, onPreviewPhoto }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AvatarCircle title={item.name} />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardFamily}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.tagContainer}>
        {item.tags.map(t => (
          <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
        ))}
      </View>

      {expanded && (
        <>
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>家具說明</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          <View style={styles.photoHeaderRow}>
            <Text style={styles.sectionTitle}>照片紀錄</Text>
            <TouchableOpacity style={styles.addPhotoButton} onPress={onAddPhoto}><Text style={styles.addPhotoButtonText}>＋ 新增照片</Text></TouchableOpacity>
          </View>

          {item.photos.length === 0 ? (
            <Text style={styles.noPhotoText}>目前還沒有照片</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.photos.map(p => (
                <TouchableOpacity key={p.id} style={{ marginRight: 8 }} onPress={() => onPreviewPhoto(item.id, p)}>
                  <Image source={{ uri: p.uri }} style={styles.photoImage} />
                  <Text style={styles.photoDate}>{new Date(p.createdAt).toLocaleDateString()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </>
      )}
    </View>
  </TouchableOpacity>
);

// 請將 styles 與表單（NewCharacterForm / NewFurnitureForm）放在此檔或另存一檔；
// 為簡潔起見，我把 styles 加在底下（你也可以把 styles 拆出去）
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" , paddingTop:70, },
 
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding:14,
    marginBottom: 12,
    borderColor: "#eee",
    borderWidth: 0.5,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#F5E6FF", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: "#7B4BA1", fontWeight: "700", fontSize: 20 },
  cardTitleContainer: { flex: 1 },
  cardName: { fontSize: 18, fontWeight: "600", color: "#333" },
  cardFamily: { fontSize: 13, color: "#777" },
  cardRating: { fontSize: 12, color: "#FF9800" },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  tag: { backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, color: "#555" },
  descriptionContainer: { marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 6 },
  descriptionText: { fontSize: 13, color: "#555", lineHeight: 18 },
  photoHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  addPhotoButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: "#7B4BA1" },
  addPhotoButtonText: { color: "#7B4BA1", fontWeight: "600" },
  noPhotoText: { color: "#999", fontStyle: "italic" },
  photoImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: "#eee" },
  photoDate: { fontSize: 10, color: "#777", marginTop: 6 },
    // mode switch (for PhotoWall)
  modeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonActive: {
    backgroundColor: "#7B4BA1",
    borderColor: "#7B4BA1",
  },
  modeButtonText: {
    color: "#666",
    fontSize: 13,
  },
  modeButtonTextActive: {
    color: "#FFF",
    fontSize: 13,
  },
 // photo wall styles
  photoWallContent: { paddingHorizontal: 8, paddingBottom: 24 },
  wallItem: { flex: 1 / 3, padding: 4, alignItems: "center" },
  wallImage: { width: "100%", aspectRatio: 1, borderRadius: 10, backgroundColor: "#EEE" },
  wallInfo: { marginTop: 6, alignItems: "center" },
  wallName: { fontSize: 11, color: "#333333", maxWidth: "100%" },
  wallDate: { fontSize: 10, color: "#777777" },
});
