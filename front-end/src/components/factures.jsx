import React, { Component } from "react";
import { toast } from "react-toastify";
import FacturesTable from "./facturesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";
import { getFactures, deleteFacture } from "./../services/factureService";

class Factures extends Component {
  state = {
    factures: [],
    currentPage: 1,
    pageSize: 7,
    searchQuery: "",
    sortColumn: { path: "dateOn", order: "asc" },
  };

  async componentDidMount() {
    const { data: factures } = await getFactures();
    this.setState({ factures });
  }

  handleDelete = async (facture) => {
    const originalFactures = this.state.factures;
    const factures = originalFactures.filter((m) => m._id !== facture._id);
    this.setState({ factures });

    try {
      await deleteFacture(facture._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This facture has already been deleted.");

      this.setState({ factures: originalFactures });
      return;
    }
    toast("Facture was deleted successfully!!");
  };

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
      factures: allFactures,
    } = this.state;

    let filtered = allFactures;
    if (searchQuery)
      filtered = allFactures.filter((m) =>
        m.client.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const factures = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: factures };
  };

  render() {
    const { length: count } = this.state.factures;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>There are no factures in the database.</p>;

    const { totalCount, data: factures } = this.getPagedData();

    return (
      <div className="row">
        <div className="col">
          <p>Showing {totalCount} factures in the database.</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            holder=" By Client"
          />
          <FacturesTable
            factures={factures}
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

export default Factures;
