import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ArticlesTable from "./articlesTable";
import ListGroup from "./common/listGroup";
import Pagination from "./common/pagination";
import { getArticles, deleteArticle } from "../services/articleService";
import { getGenres } from "../services/genreService";
import { paginate } from "../utils/paginate";
import _ from "lodash";
import SearchBox from "./searchBox";
import { registerCommande } from "./../services/commandeService";

class Articles extends Component {
  state = {
    articles: [],
    genres: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    selectedGenre: null,
    sortColumn: { path: "name", order: "asc" },
    detailDuCommande: [],
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: articles } = await getArticles();
    articles.forEach(function (article) {
      if (document.getElementById(article._id) !== null) {
        article.qty = document.getElementById(article._id).value;
      } else article.qty = "1";
    });
    this.setState({ articles, genres });
  }

  handleDelete = async (article) => {
    const originalArticles = this.state.articles;
    const articles = originalArticles.filter((m) => m._id !== article._id);
    this.setState({ articles });

    try {
      await deleteArticle(article._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This article has already been deleted.");

      this.setState({ articles: originalArticles });
      return;
    }
    toast("Article deleted successfully!!");
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handledisable() {
    if (this.state.detailDuCommande.length === 0) return true;
    else return false;
  }

  handleCheck = (article) => {
    const articles = [...this.state.articles];
    let detailDuCommande = [...this.state.detailDuCommande];
    const index = articles.indexOf(article);
    articles[index] = { ...articles[index] };
    if (articles[index].stockQty === 0) {
      return toast.error("this item is not in stock");
    }
    if (!articles[index].checked) articles[index].checked = true;
    else articles[index].checked = !articles[index].checked;
    if (articles[index].checked === true) {
      detailDuCommande = [
        ...detailDuCommande,
        { article: articles[index]._id, qty: articles[index].qty },
      ];
    } else {
      const i = detailDuCommande.findIndex(
        (x) => x.article === articles[index]._id
      );

      detailDuCommande.splice(i, 1);
    }
    this.setState({ articles, detailDuCommande });
  };

  handleChange = (article) => {
    let detailDuCommande = [...this.state.detailDuCommande];
    const articles = [...this.state.articles];
    const index = articles.indexOf(article);
    let value = document.getElementById(articles[index]._id).value;
    if (value < 1) {
      document.getElementById(articles[index]._id).value = 1;
      return toast.error("quantity must be higher or equal to 1");
    }
    if (articles[index].stockQty === 0) {
      document.getElementById(articles[index]._id).value = 1;
      return toast.error("this item is not in stock");
    }
    if (articles[index].stockQty < value) {
      document.getElementById(articles[index]._id).value = value - 1;
      return toast.error("not enough of this item in stock");
    }
    if (articles[index].checked === true) {
      const i = detailDuCommande.findIndex(
        (x) => x.article === articles[index]._id
      );
      detailDuCommande[i].qty = document.getElementById(
        articles[index]._id
      ).value;
    }
    articles[index].qty = document.getElementById(articles[index]._id).value;

    this.setState({ articles, detailDuCommande });
  };

  async handleCommande() {
    const { data: commande } = await registerCommande(
      this.state.detailDuCommande
    );
    var commandeId = commande._id;
    localStorage.setItem("commandeId", commandeId);
    this.props.history.replace("/newfacture");
    toast("Commande created successfully!!");
    console.log(commande, commandeId);
  }

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchQuery,
      articles: allArticles,
    } = this.state;

    let filtered = allArticles;
    if (searchQuery)
      filtered = allArticles.filter((m) =>
        m.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allArticles.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const articles = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: articles };
  };

  render() {
    const { length: count } = this.state.articles;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) return <p>There are no articles in the database.</p>;

    const { totalCount, data: articles } = this.getPagedData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && !user.isAdmin && (
            <button
              onClick={() => {
                this.handleCommande();
              }}
              disabled={this.handledisable()}
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              Commander
            </button>
          )}

          {user && user.isAdmin && (
            <React.Fragment>
              <Link
                to="/articles/new"
                className="btn btn-primary m-2"
                style={{ marginBottom: 20 }}
              >
                Add Article
              </Link>
              <Link
                to="/newgenre"
                className="btn btn-primary"
                style={{ marginBottom: 0 }}
              >
                Add Genre
              </Link>
            </React.Fragment>
          )}
          <p>Showing {totalCount} articles in the database.</p>
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            holder=" By Article"
          />
          <ArticlesTable
            articles={articles}
            sortColumn={sortColumn}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            onCheck={this.handleCheck}
            onChange={this.handleChange}
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

export default Articles;
