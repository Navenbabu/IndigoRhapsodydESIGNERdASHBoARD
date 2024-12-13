import { storage } from "../../src/service/firebaseService"; // Import the storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const BASE_URL = "https://indigo-rhapsody-backend-sigma.vercel.app";

export const dashBoardDesigner = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(`${BASE_URL}/designer/${designerId}/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error loading data:", error);
    throw error;
  }
};
const uploadImageToFirebase = async (file) => {
  try {
    const fileRef = ref(storage, `ProfileImages/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    // console.error("Error uploading image to Firebase:", error);
    throw new Error("Failed to upload image");
  }
};

export const updateProfile = async (profileData, logoFile, backgroundFile) => {
  try {
    const designerId = localStorage.getItem("designerId");

    // Upload images to Firebase if provided
    let logoUrl = profileData.logoUrl || null;
    let backGroundImage = profileData.backGroundImage || null;

    if (logoFile) {
      logoUrl = await uploadImageToFirebase(logoFile);
    }

    if (backgroundFile) {
      backGroundImage = await uploadImageToFirebase(backgroundFile);
    }

    // Prepare payload with URLs if updated
    const updatedProfileData = {
      ...profileData,
      ...(logoUrl && { logoUrl }),
      ...(backGroundImage && { backGroundImage }),
    };

    const response = await fetch(`${BASE_URL}/designer/${designerId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    const data = await response.json();
    return data; // Return the updated profile data
  } catch (error) {
    // console.error("Error updating profile:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};
