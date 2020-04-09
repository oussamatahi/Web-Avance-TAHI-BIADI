import React, { Component } from "react";
import UsersTable from "./usersTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getUsers } from "../services/userService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";

class Users extends Component {
  state = {
    users: [],
    admins: [
      { _id: "", name: "All Users" },
      { name: "Admin List", isAdmin: true, _id: 1 },
      { name: "Client List", isAdmin: false, _id: 2 },
    ],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedAdmin: null,
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: users } = await getUsers();
    this.setState({ users });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleAdminSelect = (admin) => {
    this.setState({ selectedAdmin: admin, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedAdmin: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedAdmin,
      searchQuery,
      users: allUsers,
    } = this.state;

    let filtered = allUsers;
    if (searchQuery)
      filtered = allUsers.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedAdmin && selectedAdmin._id)
      filtered = allUsers.filter((m) => m.isAdmin === selectedAdmin.isAdmin);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: users };
  };

  render() {
    const { length: count } = this.state.users;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) return <p>There are no users in the database.</p>;

    const { totalCount, data: users } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.admins}
            selectedItem={this.state.selectedAdmin}
            onItemSelect={this.handleAdminSelect}
          />
        </div>
        <div className="col">
          <p>Showing {totalCount} users in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <UsersTable
            users={users}
            sortColumn={sortColumn}
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

export default Users;
