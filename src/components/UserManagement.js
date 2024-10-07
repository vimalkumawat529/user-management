import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../reducer/usersSlice";
import UserTable from "./UserTable";
import UserForm from "./UserForm";
import { Container } from "react-bootstrap";

const UserManagement = () => {
  const dispatch = useDispatch();
  const [userToEdit, setUserToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Container>
      <h1 className="d-flex justify-content-center mt-4">User Management</h1>
      <UserForm userToEdit={userToEdit} setUserToEdit={setUserToEdit} />
      <UserTable onEdit={setUserToEdit} />
    </Container>
  );
};

export default UserManagement;
