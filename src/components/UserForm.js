import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, editUser } from "../reducer/usersSlice";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const UserForm = ({ userToEdit, setUserToEdit }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: { city: "", zipcode: "" },
  });

  useEffect(() => {
    if (userToEdit) {
      setUser(userToEdit); // Populate the form with the user to edit
    } else {
      setUser({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: { city: "", zipcode: "" },
      }); // Reset form
    }
  }, [userToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userToEdit) {
        await dispatch(editUser(user)); // Edit user
        toast.success("User updated successfully!"); // Set success message
      } else {
        await dispatch(addUser(user)); // Add user
        toast.success("User added successfully!"); // Set success message

        setUser({
          id: "",
          name: "",
          email: "",
          phone: "",
          address: { city: "", zipcode: "" },
        }); // Reset form
      }
      setUserToEdit(null); // Reset the userToEdit state after submission
    } catch (error) {
      toast.error("Error occurred: " + error.message); // Show error message
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          value={user.phone}
          max={10}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
          required
        />
      </Form.Group>

      <Form.Group controlId="formCity">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          value={user.address.city}
          onChange={(e) =>
            setUser({
              ...user,
              address: { ...user.address, city: e.target.value },
            })
          }
          required
        />
      </Form.Group>

      <Form.Group controlId="formZipcode">
        <Form.Label>Zip Code</Form.Label>
        <Form.Control
          type="text"
          value={user.address.zipcode}
          onChange={(e) =>
            setUser({
              ...user,
              address: { ...user.address, zipcode: e.target.value },
            })
          }
          required
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="mb-5 mt-4 justify-content-end"
      >
        {userToEdit ? "Update User" : "Add User"}
      </Button>
    </Form>
  );
};

export default UserForm;
