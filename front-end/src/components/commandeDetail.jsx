import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getArticle } from "../services/articleService";
import { getCommande } from "../services/commandeService";

class CommadeDetail extends Form {
  state = {
    data: {
      _id: "",
      detailDuCommande: [],
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    detailDuCommande: Joi.array(),
  };

  async populateCommande() {
    try {
      const commandeId = this.props.match.params.id;
      const { data: commande } = await getCommande(commandeId);
      for (let index = 0; index < commande.detailDuCommande.length; index++) {
        const { data: article } = await getArticle(
          commande.detailDuCommande[index].article
        );
        commande.detailDuCommande[index].article = article.name;
      }
      this.setState({ data: this.mapToViewModel(commande) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateCommande();
  }

  mapToViewModel(commande) {
    return {
      _id: commande._id,
      detailDuCommande: commande.detailDuCommande,
    };
  }

  renderdetail = ({ detailDuCommande }) => {
    return detailDuCommande.map((item) => (
      <div className="form-inline" key={item._id}>
        <label>Article :</label>
        <input
          className="m-3 form-control form-control-sm w-25"
          disabled
          value={item.article}
        />
        <label className="m-3">Quantity : </label>
        <input
          className="form-control form-control-sm w-25"
          disabled
          value={item.qty}
        />
      </div>
    ));
  };
  render() {
    return (
      <div>
        <h1>Detail Commande</h1>
        <form className="" onSubmit={this.handleSubmit}>
          {this.renderInput("_id", "Commande N° :", "text", true, "w-75")}
          {this.renderdetail(this.state.data)}
        </form>
      </div>
    );
  }
}

export default CommadeDetail;
