// AddProductModal.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getCategory,
  getSubCategory,
  createProduct,
} from "../../service/addProductsService";

import { storage } from "../../service/firebaseService"; // Import the storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  z-index: 1000;
  overflow-y: auto;
  max-height: 90vh;
`;

const FormSection = styled.div`
  margin-bottom: 20px;

  h4 {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  .input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;

    .add-button {
      padding: 0 10px;
      border: none;
      background-color: #28a745;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  .drop-zone {
    border: 2px dashed #ccc;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    cursor: pointer;
    margin-bottom: 10px;
    position: relative;

    &:hover {
      background-color: #f9f9f9;
    }

    p {
      margin: 10px 0;
      color: #666;
    }
  }

  .image-preview {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;

    .image-container {
      position: relative;
      img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 5px;
      }
      .remove-btn {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: red;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
        padding: 2px 5px;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.6s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &.save {
      background-color: #007bff;
      color: #fff;
    }

    &.cancel {
      background-color: #f0f0f0;
      color: #333;
    }
  }
`;

function AddProductModal({ show, onClose }) {
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Track validation errors

  const designerRef = localStorage.getItem("designerRef");

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    sku: "",
    fit: "",
    fabric: "",
    material: "",
  });

  useEffect(() => {
    if (show) {
      const fetchCategories = async () => {
        try {
          const categoryData = await getCategory();
          setCategories(categoryData.categories || []); // Update to match your response structure
        } catch (error) {}
      };
      fetchCategories();
    }
  }, [show]);
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubCategories = async () => {
        try {
          const subCategoryData = await getSubCategory(selectedCategory);
          setSubCategories(subCategoryData.subCategories || []);
        } catch (error) {
          console.error("Failed to fetch subcategories:", error);
        }
      };
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const [variants, setVariants] = useState([
    {
      color: "",
      sizes: [{ size: "", price: "", stock: "" }],
      imageList: [],
    },
  ]);

  const handleAddSize = (colorIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.push({ size: "", price: "", stock: "" });
    setVariants(newVariants);
  };
  const handleRemoveSize = (colorIndex, sizeIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.splice(sizeIndex, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (e, colorIndex, sizeIndex = null, field) => {
    const { value } = e.target;
    const newVariants = [...variants];

    if (sizeIndex === null) {
      newVariants[colorIndex][field] = value;
    } else {
      newVariants[colorIndex].sizes[sizeIndex][field] = value;
    }
    setVariants(newVariants);
  };
  const uploadImageToFirebase = async (file) => {
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return url;
    } catch (error) {
      // console.error("Error uploading image to Firebase:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a cover image.");
      return;
    }

    try {
      setCoverImage(file);
      const url = await uploadImageToFirebase(file); // Upload to Firebase
      setCoverImageUrl(url); // Store the URL for API usage
      toast.success("Cover image uploaded successfully.");
    } catch (error) {
      toast.error("Failed to upload cover image. Please try again.");
    }
  };

  const handleVariantImageChange = async (e, colorIndex) => {
    const files = Array.from(e.target.files);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadImageToFirebase(file);
          return url;
        })
      );
      const newVariants = [...variants];
      newVariants[colorIndex].imageList = [
        ...newVariants[colorIndex].imageList,
        ...uploadedUrls,
      ];
      setVariants(newVariants);
    } catch (error) {
      // console.error("Error uploading image list:", error);
      alert("Failed to upload some images");
    }
  };

  const handleRemoveVariantImage = (colorIndex, imageIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].imageList = newVariants[
      colorIndex
    ].imageList.filter((_, i) => i !== imageIndex);
    setVariants(newVariants);
  };

  const handleAddColor = () => {
    setVariants([
      ...variants,
      { color: "", sizes: [{ size: "", price: "", stock: "" }], imageList: [] },
    ]);
  };

  const handleImageListChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageList(files); // Sets the local image preview

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadImageToFirebase(file);
          return url;
        })
      );
      setImageUrls((prevUrls) => [...prevUrls, ...uploadedUrls]);
    } catch (error) {
      // console.error("Error uploading image list:", error);
      alert("Failed to upload some images");
    }
  };
  const handleRemoveColorVariant = (colorIndex) => {
    const newVariants = [...variants];
    newVariants.splice(colorIndex, 1);
    setVariants(newVariants);
  };

  const handleRemoveImage = (index) => {
    setImageList((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const validateFields = () => {
    const newErrors = {};

    // Validate each field
    if (!formData.productName.trim())
      newErrors.productName = "Product Name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";
    if (!formData.fit.trim()) newErrors.fit = "Fit is required.";
    if (!formData.fabric.trim()) newErrors.fabric = "Fabric is required.";
    if (!formData.material.trim()) newErrors.material = "Material is required.";
    if (!selectedCategory) newErrors.category = "Category is required.";
    if (!selectedSubCategory)
      newErrors.subCategory = "SubCategory is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.productName.trim()) {
      toast.error("Product Name is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (!formData.sku.trim()) {
      toast.error("SKU is required.");
      return;
    }
    if (!formData.fit.trim()) {
      toast.error("Fit is required.");
      return;
    }
    if (!formData.fabric.trim()) {
      toast.error("Fabric is required.");
      return;
    }
    if (!formData.material.trim()) {
      toast.error("Material is required.");
      return;
    }
    if (!selectedCategory) {
      toast.error("Category is required.");
      return;
    }
    if (!selectedSubCategory) {
      toast.error("Subcategory is required.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const productData = {
        ...formData,
        category: selectedCategory,
        subCategory: selectedSubCategory,
        variants: variants,
      };

      const response = await createProduct(productData);

      toast.success("Product created successfully!");
      onClose();
      window.location.reload();
    } catch (error) {
      toast.error(`Failed to create product: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ModalOverlay show={show} onClick={handleOverlayClick}>
      <ModalContent>
        <h3>New Product</h3>
        <form onSubmit={handleSubmit}>
          <FormSection>
            <h4>Variants</h4>
            {variants.map((variant, colorIndex) => (
              <div key={colorIndex}>
                <div className="input-group">
                  <label>Color</label>
                  <input
                    type="text"
                    placeholder="Color"
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(e, colorIndex, null, "color")
                    }
                  />
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveColorVariant(colorIndex)}
                  >
                    -
                  </button>
                </div>

                <label>Upload Images for {variant.color}</label>
                <div className="drop-zone">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantImageChange(e, colorIndex)}
                    style={{ display: "none" }}
                    id={`variantImageUpload-${colorIndex}`}
                  />
                  <label htmlFor={`variantImageUpload-${colorIndex}`}>
                    <FaUpload size={30} color="#888" />
                    <p>Drag & drop or click to upload images</p>
                  </label>
                </div>
                {variant.imageList.length > 0 && (
                  <div className="image-preview">
                    {variant.imageList.map((url, imageIndex) => (
                      <div className="image-container" key={imageIndex}>
                        <img
                          src={url}
                          alt={`Variant ${colorIndex} Image ${imageIndex}`}
                        />
                        <button
                          className="remove-btn"
                          onClick={() =>
                            handleRemoveVariantImage(colorIndex, imageIndex)
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {variant.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="input-group">
                    <input
                      type="text"
                      placeholder="Size"
                      value={size.size}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "size")
                      }
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={size.price}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "price")
                      }
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        handleVariantChange(e, colorIndex, sizeIndex, "stock")
                      }
                    />
                    <button
                      type="button"
                      className="add-button"
                      onClick={() => handleAddSize(colorIndex)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveSize(colorIndex, sizeIndex)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="add-button"
              onClick={handleAddColor}
            >
              + Add Color
            </button>
          </FormSection>
          <FormSection>
            <h4>General Information</h4>
            <label>Product Name</label>
            <input
              type="text"
              name="productName" // Add this line
              placeholder="Enter product name"
              value={formData.productName}
              onChange={handleInputChange}
            />
            {errors.productName && (
              <small className="error-text">{errors.productName}</small>
            )}

            <label>Description</label>
            <textarea
              name="description" // Add this line
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </FormSection>

          <FormSection>
            <h4>Price</h4>
            <div className="input-group">
              <input
                type="number"
                name="price" // Add this line
                placeholder="Base Price"
                value={formData.price}
                onChange={handleInputChange}
              />
              {/* Add additional inputs if necessary */}
            </div>
          </FormSection>

          <FormSection>
            <h4>Meta data</h4>
            <div className="input-group">
              <input
                type="text"
                name="sku" // Add this line
                placeholder="SKU"
                value={formData.sku}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <FormSection>
            <h4>Fit</h4>
            <div className="input-group">
              <input
                type="text"
                name="fit" // Add this line
                placeholder="Fit-Product"
                value={formData.fit}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <FormSection>
            <h4>Fabric</h4>
            <div className="input-group">
              <input
                type="text"
                name="fabric" // Add this line
                placeholder="Fabric Type"
                value={formData.fabric}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <FormSection>
            <h4>Material</h4>
            <div className="input-group">
              <input
                type="text"
                name="material" // Add this line
                placeholder="Material Type"
                value={formData.material}
                onChange={handleInputChange}
              />
            </div>
          </FormSection>

          <FormSection>
            <h4>Category</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormSection>

          <FormSection>
            <h4>SubCategory</h4>
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">Select SubCategory</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory._id} value={subCategory._id}>
                  {subCategory.name}
                </option>
              ))}
            </select>
          </FormSection>

          <ButtonGroup>
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default AddProductModal;
