// App.tsx
import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import CharactersScreen from "./screens/CharactersScreen";
import FurnituresScreen from "./screens/FurnituresScreen";
import PhotoWallScreen from "./screens/PhotoWallScreen";

const STORAGE_KEY = "forestApp_v1";

export type PhotoItem = { id: string; uri: string; createdAt: string };
export type Character = {
  id: string;
  name: string;
  family: string;
  animalType: string;
  tags: string[];
  rating: number;
  description: string;
  photos: PhotoItem[];
};
export type Furniture = {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  photos: PhotoItem[];
};

const INITIAL_CHARACTERS: Character[] = [
  { id: "1", name: "巧克力兔妹妹", family: "巧克力兔家族", animalType: "兔子", tags: ["有點害羞","愛畫畫"], rating: 5, description: "轉學來到森林學校的新同學...", photos: [] },
  { id: "2", name: "灰熊老爸", family: "熊家族", animalType: "熊", tags: ["愛做料理"], rating: 4, description: "喜歡在家裡做早餐給家人...", photos: [] },
];

const INITIAL_FURNITURES: Furniture[] = [
  { id: "f1", name: "小木桌", category: "桌子", tags: ["木製"], description: "森林小屋用的小木桌", photos: [] },
  { id: "f2", name: "圓背椅", category: "椅子", tags: ["舒適"], description: "給小朋友坐的舒適椅子", photos: [] },
];

const Tab = createBottomTabNavigator();

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [furnitures, setFurnitures] = useState<Furniture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setCharacters(parsed.characters ?? INITIAL_CHARACTERS);
          setFurnitures(parsed.furnitures ?? INITIAL_FURNITURES);
        } else {
          setCharacters(INITIAL_CHARACTERS);
          setFurnitures(INITIAL_FURNITURES);
        }
      } catch (err) {
        console.log("load error", err);
        Alert.alert("讀取失敗", "無法讀取本機資料，將使用預設資料。");
        setCharacters(INITIAL_CHARACTERS);
        setFurnitures(INITIAL_FURNITURES);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ characters, furnitures }));
      } catch (err) {
        console.log("save error", err);
      }
    };
    save();
  }, [characters, furnitures, isLoading]);

  // --- character handlers ---
  const createCharacter = (payload: Omit<Character, "id" | "photos"> & { photos?: PhotoItem[]; }) => {
    setCharacters(prev => [...prev, { id: Date.now().toString(), ...payload, photos: payload.photos ?? [] }]);
  };
  const addPhotoToCharacter = (characterId: string, photo: PhotoItem) => {
    setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, photos: [...c.photos, photo] } : c));
  };
  const deleteCharacterPhoto = (characterId: string, photoId: string) => {
    setCharacters(prev => prev.map(c => c.id === characterId ? { ...c, photos: c.photos.filter(p => p.id !== photoId) } : c));
  };

  // --- furniture handlers ---
  const createFurniture = (payload: Omit<Furniture, "id" | "photos"> & { photos?: PhotoItem[]; }) => {
    setFurnitures(prev => [...prev, { id: Date.now().toString(), ...payload, photos: payload.photos ?? [] }]);
  };
  const addPhotoToFurniture = (furnitureId: string, photo: PhotoItem) => {
    setFurnitures(prev => prev.map(f => f.id === furnitureId ? { ...f, photos: [...f.photos, photo] } : f));
  };
  const deleteFurniturePhoto = (furnitureId: string, photoId: string) => {
    setFurnitures(prev => prev.map(f => f.id === furnitureId ? { ...f, photos: f.photos.filter(p => p.id !== photoId) } : f));
  };

  // unified delete used by PhotoWall (ownerType: 'character'|'furniture')
  const deletePhotoUnified = (ownerType: "character" | "furniture", ownerId: string, photoId: string) => {
    if (ownerType === "character") deleteCharacterPhoto(ownerId, photoId);
    else deleteFurniturePhoto(ownerId, photoId);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#7B4BA1" }}>
        <Tab.Screen name="角色列表">
          {() => (
            <CharactersScreen
              characters={characters}
              isLoading={isLoading}
              onCreateCharacter={createCharacter}
              onAddPhoto={addPhotoToCharacter}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="家具列表">
          {() => (
            <FurnituresScreen
              furnitures={furnitures}
              isLoading={isLoading}
              onCreateFurniture={createFurniture}
              onAddPhoto={addPhotoToFurniture}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="照片牆11">
          {() => (
            <PhotoWallScreen
              characters={characters}
              furnitures={furnitures}
              isLoading={isLoading}
              onDeletePhoto={deletePhotoUnified}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
