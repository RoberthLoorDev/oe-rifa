import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

export const saveProductImage = async (imageUri: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return imageUri;
  }
  
  try {
    const raffleImagesDir = `${FileSystem.documentDirectory}raffle_images/`;
    const dirInfo = await FileSystem.getInfoAsync(raffleImagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(raffleImagesDir, { intermediates: true });
    }
    const fileName = `raffle_img_${Date.now()}.jpg`;
    const destPath = `${raffleImagesDir}${fileName}`;
    await FileSystem.copyAsync({
      from: imageUri,
      to: destPath
    });
    return fileName;
  } catch (fsError) {
    console.error(fsError);
    return imageUri;
  }
};
