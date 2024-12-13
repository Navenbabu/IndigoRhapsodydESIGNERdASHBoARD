export const dashBoardDesigner = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-sigma.vercel.app/order/total-orders/designer/${designerId}`,
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
export const dashBoardDesignerSales = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-sigma.vercel.app/order/total-sales/designer/${designerId}`,
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

export const dashBoardDesignerProducts = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-sigma.vercel.app/products/total-products/designer/${designerId}`,
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

export const getOrderForTable = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `https://indigo-rhapsody-backend-sigma.vercel.app/order/designer/${designerId}`,
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