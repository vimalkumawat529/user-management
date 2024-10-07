import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, setCurrentPage } from "../reducer/usersSlice";
import { Table, Button, Pagination, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

// UserTable component for displaying and managing users
const UserTable = ({ onEdit }) => {
  const dispatch = useDispatch();

  // State for managing the confirmation modal
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // Tracks the selected user for deletion

  // Accessing user-related state from the Redux store
  const { users, status } = useSelector((state) => state.users);

  const currentPage = useSelector((state) => state.users.currentPage);
  const itemsPerPage = useSelector((state) => state.users.itemsPerPage);

  // Calculate the indices for slicing the users array based on current page
  const indexOfLastUser = currentPage * itemsPerPage; // Last user's index for current page
  const indexOfFirstUser = indexOfLastUser - itemsPerPage; // First user's index for current page
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser); // Users to display on current page

  // Calculate the total number of pages
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Handle pagination click to navigate to a specific page
  const handlePaginationClick = async (pageNumber) => {
    try {
      await dispatch(setCurrentPage(pageNumber));
    } catch (error) {
      console.error(error);
    }
  };

  // Handle clicking on the "Next" button for pagination
  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      try {
        await dispatch(setCurrentPage(currentPage + 1));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle clicking on the "Previous" button for pagination
  const handlePrevPage = async () => {
    if (currentPage > 1) {
      try {
        await dispatch(setCurrentPage(currentPage - 1));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle showing the confirmation modal for deletion
  const handleDeleteClick = (id) => {
    setSelectedUserId(id); // Set the ID of the user to be deleted
    setShowModal(true); // Show the modal
  };

  // Handle user deletion
  const confirmDeleteUser = async () => {
    try {
      await dispatch(deleteUser(selectedUserId)); // Dispatch action to delete user
      toast.success("User deleted successfully!");
      setShowModal(false);
      // Check if we need to go back to the first page
      const newTotalPages = Math.ceil((users.length - 1) / itemsPerPage);
      if (newTotalPages < currentPage) {
        dispatch(setCurrentPage(1)); // Reset to the first page if current exceeds total pages
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle modal cancellation
  const handleCancelDelete = () => {
    setShowModal(false); // Close the modal without deleting
  };

  // Loading state rendering
  if (status === "loading") {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" /> {/* Loading Spinner */}
      </div>
    );
  }

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Zip Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address.city}</td>
              <td>{user.address.zipcode}</td>
              <td className="d-flex justify-content-around">
                <Button
                  variant="info"
                  onClick={() => onEdit(user)}
                  className="mx-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(user.id)} // Show confirmation modal
                  className="mx-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="justify-content-end">
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1} // Disable if on the first page
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage} // Highlight current page
            onClick={() => handlePaginationClick(index + 1)} // Navigate to page
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={handleNextPage}
          disabled={currentPage === totalPages} // Disable if on the last page
        />
      </Pagination>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserTable;
