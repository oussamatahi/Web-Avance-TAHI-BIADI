import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class CommandesTable extends Component {
  columns = [
    {
      path: "_id",
      label: "Commande N°",
      content: (commande) => (
        <Link to={`/commande/${commande._id}`}>{commande._id}</Link>
      ),
    },

    { path: "dateOn", label: "Date" },
    {
      path: "isPayed",
      content: (commande) => {
        if (commande.isPayed) {
          var isPayed = "Payed";
        } else {
          isPayed = "Not Payed";
        }

        return <label>{isPayed}</label>;
      },
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (article) => (
      <button
        onClick={() => this.props.onDelete(article)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  giveAdminPrivilege = () => {
    this.columns.push(
      { path: "client.email", label: "Client" },
      this.deleteColumn
    );
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.giveAdminPrivilege();
  }

  render() {
    const { commandes, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={commandes}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default CommandesTable;
