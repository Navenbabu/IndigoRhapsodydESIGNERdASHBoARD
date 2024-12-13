
const BASE_URL = "https://indigo-rhapsody-backend-sigma.vercel.app";
export const getReturnRequest = async () => {
  try {
    const designerId = localStorage.getItem("designerId");
    const response = await fetch(
      `${BASE_URL}/order/return-requests/${designerId}`,
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

export const CreateReturnRequest = async (returnId) => {
  try {
    const designerId = localStorage.getItem("designerId"); // Assuming you have stored designerId in local storage

    const response = await fetch(`${BASE_URL}/shipping/createReturn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        returnId, // Pass the returnId received in the function argument
        designerRef: designerId, // Pass the designerId as designerRef
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to load data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating return request:", error);
    throw error;
  }
};
