export const getCategory = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/category`,
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
export const getSubCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/subcategory/subcategories`,
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

export const createProduct = async (productData) => {
  try {
    // Retrieve designerRef from localStorage or any other source
    const designerRef = localStorage.getItem("designerId");

    // Add designerRef to the productData object
    const dataWithDesignerRef = {
      ...productData,
      designerRef: designerRef, // Append designerRef
    };

    const response = await fetch(
      "https://indigo-rhapsody-backend-ten.vercel.app/products/createProduct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithDesignerRef),
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Product creation failed");
    }

    const data = await response.json();
    return data; // Return the product details
  } catch (error) {
    // console.error("Error creating product:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};

export const uploadBulkExcel = async (file) => {
  try {
    const designerRef = localStorage.getItem("designerId");
    if (!designerRef) {
      throw new Error(
        "Designer reference is missing. Please log in or check your credentials."
      );
    }

    // Create a new FormData object
    const formData = new FormData();
    formData.append("file", file); // Append the Excel file
    formData.append("designerRef", designerRef); // Append the designerRef

    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/products/`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error uploading data:", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    // Retrieve designerRef from localStorage or any other source
    const designerRef = localStorage.getItem("designerId");

    // Add designerRef to the productData object
    const dataWithDesignerRef = {
      ...productData,
      designerRef: designerRef, // Append designerRef
    };

    // Use the productId in the URL
    const response = await fetch(
      `https://indigo-rhapsody-backend-ten.vercel.app/products/products/${productId}`,
      {
        method: "PUT", // Use PUT for updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataWithDesignerRef),
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Product update failed");
    }

    const data = await response.json();
    return data; // Return the updated product details
  } catch (error) {
    // console.error("Error updating product:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};