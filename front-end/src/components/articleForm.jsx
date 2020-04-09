import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getArticle, saveArticle } from "../services/articleService";
import { getGenres } from "../services/genreService";
import { toast } from "react-toastify";

class ArticleForm extends Form {
  state = {
    data: {
      name: "",
      genreId: "",
      stockQty: "",
      prix_ht: "",
      taxe: "",
      depot: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Article").max(100).min(5),
    genreId: Joi.string().required().label("Genre"),
    stockQty: Joi.number().required().min(0).label("Number in Stock"),
    prix_ht: Joi.number().required().min(0).label("Price Hors Taxe"),
    taxe: Joi.number().required().min(0).max(1).label("Number in Stock"),
    depot: Joi.string().required().label("Depot"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateArticle() {
    try {
      const articleId = this.props.match.params.id;
      if (articleId === "new") return;

      const { data: article } = await getArticle(articleId);
      this.setState({ data: this.mapToViewModel(article) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateArticle();
  }

  mapToViewModel(article) {
    return {
      _id: article._id,
      name: article.name,
      genreId: article.genre._id,
      stockQty: article.stockQty,
      prix_ht: article.prix_ht,
      taxe: article.taxe,
      depot: article.depot,
    };
  }

  doSubmit = async () => {
    await saveArticle(this.state.data);

    this.props.history.push("/articles");
    toast("Article was submited successfuly!!");
  };

  render() {
    return (
      <div>
        <h1>Article Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Article :")}
          {this.renderSelect("genreId", "Genre :", this.state.genres)}
          {this.renderInput("stockQty", "Number in Stock :", "number")}
          {this.renderInput("prix_ht", "Prix Hors Taxe :")}
          {this.renderInput("taxe", "Taxe :")}
          {this.renderInput("depot", "Depot :")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default ArticleForm;
