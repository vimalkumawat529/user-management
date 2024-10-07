import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import UserManagement from "./components/UserManagement";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <Provider store={store}>
      <UserManagement />
      <ToastContainer />
    </Provider>
  );
};

export default App;
