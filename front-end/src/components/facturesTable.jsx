import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class FacturesTable extends Component {
  columns = [
    {
      path: "_id",
      label: "Facture N°",
      content: (facture) => (
        <Link to={`/facture/${facture._id}`}>{facture._id}</Link>
      ),
    },
    { path: "commande._id", label: "Commande N°" },
    { path: "dateOn", label: "Date" },
  ];

  deleteColumn = {
    key: "delete",
    content: (facture) => (
      <button
        onClick={() => this.props.onDelete(facture)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  giveAdminPrivilege = () => {
    this.columns.push({ path: "client", label: "Client" }, this.deleteColumn);
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.giveAdminPrivilege();
  }

  render() {
    const { factures, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={factures}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default FacturesTable;
