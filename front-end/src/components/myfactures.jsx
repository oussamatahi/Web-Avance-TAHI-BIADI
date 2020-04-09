import React, { Component } from "react";
import FacturesTable from "./facturesTable";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";
import { getMyfacture } from "../services/factureService";

class MyFacture extends Component {
  state = {
    factures: [],
    currentPage: 1,
    pageSize: 7,
    searchQuery: "",
    sortColumn: { path: "dateOn", order: "asc" },
  };

  async componentDidMount() {
    const { data: factures } = await getMyfacture();
    this.setState({ factures });
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
      factures: allFactures,
    } = this.state;

    let filtered = allFactures;
    if (searchQuery)
      filtered = allFactures.filter((m) =>
        m._id.toLowerCase().startsWith(searchQuery.toLowerCase())
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
          <p>You have {totalCount} factures.</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            holder=" By Facture N°"
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

export default MyFacture;
