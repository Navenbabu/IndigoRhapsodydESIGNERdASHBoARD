export const getProductsBydesigner = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-sigma.vercel.app/products/getProductsByDesigner/${designerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export const createPassword = async (email, password) => {
  try {
    const response = await fetch(
      "https://indigo-rhapsody-backend-sigma.vercel.app/products/createProduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    return data; // Return the user and designer details
  } catch (error) {
    // console.error("Error logging in:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};
