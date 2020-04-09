import React, { Component } from "react";
import CommandesTable from "./commandesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";
import { getMycommande } from "./../services/commandeService";

class MyCommande extends Component {
  state = {
    commandes: [],
    currentPage: 1,
    pageSize: 7,
    searchQuery: "",
    sortColumn: { path: "dateOn", order: "asc" },
  };

  async componentDidMount() {
    const { data: commandes } = await getMycommande();
    this.setState({ commandes });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      commandes: allCommandes,
    } = this.state;

    let filtered = allCommandes;
    if (searchQuery)
      filtered = allCommandes.filter((m) =>
        m._id.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const commandes = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: commandes };
  };

  render() {
    const { length: count } = this.state.commandes;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>There are no commandes in the database.</p>;

    const { totalCount, data: commandes } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          <p>You have made {totalCount} commandes.</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            holder=" By Commande N°"
          />
          <CommandesTable
            commandes={commandes}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default MyCommande;
