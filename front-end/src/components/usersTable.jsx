import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

class UsersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      content: (user) => <Link to={`/users/${user._id}`}>{user.name}</Link>,
    },
    { path: "email", label: "Email" },
    { path: "taux_remise", label: "Remise" },
    {
      path: "isAdmin",
      content: (user) => {
        if (user.isAdmin) {
          var isAdmin = "Admin";
        } else {
          isAdmin = "Client";
        }

        return <label>{isAdmin}</label>;
      },
    },
  ];

  render() {
    const { users, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={users}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default UsersTable;
