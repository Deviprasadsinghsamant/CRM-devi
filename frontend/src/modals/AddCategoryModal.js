// /* eslint-disable react/prop-types */
// // AddCategoryModal.js
// import React from "react";
// import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
// import "./globalstyling/modal.css";

// const AddCategoryModal = ({ open, onClose }) => {
//   if (!open) return null; // Ensure modal renders only when open is true
//   const handleBackdropClick = (event) => {
//     event.stopPropagation(); // Prevent closing the modal when clicking outside
//   };

//   return (
//     <div>
//       <Modal open={open} onClose={handleBackdropClick} className="category-modal">
//         <Box
//           className="modal-style"
//           sx={{
//             padding: 4,
//             maxWidth: 500,
//             margin: "auto",
//             backgroundColor: "white",
//             borderRadius: "12px",
//             boxShadow: 24,
//             display: "flex",
//             flexDirection: "column",
//             gap: 3, // Adds spacing between items
//           }}
//         >
//           {/* Modal Header */}
//           <Typography variant="h6" gutterBottom textAlign="center" sx={{ fontWeight: "bold" }}>
//             Add Product Category
//           </Typography>

//           {/* Add Product Field */}
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Add Product"
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 placeholder="Enter product name"
//               />
//             </Grid>

//             {/* Product Description Field */}
//             <Grid item xs={12}>
//               <TextField
//                 label="Product Description"
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//                 multiline
//                 rows={3}
//                 placeholder="Enter description"
//               />
//             </Grid>
//           </Grid>

//           {/* Buttons Section */}
//           <Grid container spacing={2} justifyContent="center">
//             <Grid item xs={12}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 style={{
//                   background: "linear-gradient(to right, #6a11cb, #2575fc)",
//                   color: "white",
//                   fontWeight: "bold",
//                   height: "48px",
//                 }}
//               >
//                 Add Category
//               </Button>
//             </Grid>
//             <Grid item xs={12}>
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={onClose}
//                 sx={{
//                   color: "#6a11cb",
//                   borderColor: "#6a11cb",
//                   fontWeight: "bold",
//                   height: "48px",
//                 }}
//               >
//                 Cancel
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default AddCategoryModal;

/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globalstyling/modal.css";

const AddCategoryModal = ({ open, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleBackdropClick = (event) => {
    event.stopPropagation();
  };

  const handleAddCategory = async () => {
    // Validate inputs
    if (!categoryName.trim()) {
      toast.error("Category Name is required.");
      return;
    }

    setLoading(true);

    try {
      // Send a POST request to the backend
      const response = await axios.post("http://localhost:8080/addcategory", {
        categoryName,
        categoryDescription,
      });

      if (response.status === 201) {
        toast.success("Category added successfully!");

        setCategoryName("");
        setCategoryDescription("");

        if (onCategoryAdded) {
          onCategoryAdded(response.data.category);
        }

        // Close the modal
        onClose();
      } else {
        toast.error("Failed to add category. Please try again.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Modal open={open} onClose={handleBackdropClick} className="category-modal">
        <Box
          className="modal-style"
          sx={{
            padding: 4,
            maxWidth: 500,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h6" gutterBottom textAlign="center" sx={{ fontWeight: "bold" }}>
            Add Product Category
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Category Name"
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Category Description"
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                placeholder="Enter category description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddCategory}
                style={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "white",
                  fontWeight: "bold",
                  height: "48px",
                }}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Category"}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={onClose}
                sx={{
                  color: "#6a11cb",
                  borderColor: "#6a11cb",
                  fontWeight: "bold",
                  height: "48px",
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* Toast container placed outside the modal */}
      <ToastContainer />
    </div>
  );
};

export default AddCategoryModal;
