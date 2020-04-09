import React, { Component } from "react";
import auth from "../services/authService";
import { Link } from "react-router-dom";
import Table from "./common/table";
import CheckBox from "./common/checkbox";

class ArticlesTable extends Component {
  columns = [
    {
      path: "name",
      label: "Article",
    },
    { path: "genre.name", label: "Genre" },
    { path: "stockQty", label: "Stock" },
    { path: "prix_ht", label: "Price HT" },
    { path: "taxe", label: "Taxe" },
    { path: "depot", label: "Depot" },
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

  quantity = {
    label: "Quantity",
    key: "qty",
    content: (article) => (
      <input
        onChange={() => this.props.onChange(article)}
        type="number"
        name={article._id}
        id={article._id}
        defaultValue={article.qty}
        disabled={article.qty === 0}
        className="form-control form-control-sm w-50 "
      />
    ),
  };

  checkbox = {
    label: "select",
    key: "selected",
    content: (article) => (
      <CheckBox
        checked={article.checked}
        onClick={() => this.props.onCheck(article)}
      />
    ),
  };
  giveUserCommande = () => {
    this.columns.push(this.checkbox, this.quantity);
  };

  giveAdminPrivilege = () => {
    this.columns.shift() &&
      this.columns.unshift({
        path: "name",
        label: "Article",
        content: (article) => (
          <Link to={`/articles/${article._id}`}>{article.name}</Link>
        ),
      }) &&
      this.columns.push(this.deleteColumn);
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.giveAdminPrivilege();
    if (user && !user.isAdmin) this.giveUserCommande();
  }

  render() {
    const { articles, onSort, sortColumn } = this.props;

    return (
      <Table
        columns={this.columns}
        data={articles}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ArticlesTable;
