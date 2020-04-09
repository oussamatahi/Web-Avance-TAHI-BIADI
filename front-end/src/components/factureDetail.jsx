import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getFacture } from "../services/factureService";

class FactureDetail extends Form {
  state = {
    data: {
      _id: "",
      prixtotale: "",
      prixtotale_ht: "",
      prixtotale_final: "",
      lieudelivraison: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    prixtotale: Joi.string(),
    prixtotale_ht: Joi.string(),
    prixtotale_final: Joi.string(),
    lieudelivraison: Joi.string(),
  };

  async populateFacture() {
    try {
      const factureId = this.props.match.params.id;
      const { data: facture } = await getFacture(factureId);
      this.setState({ data: this.mapToViewModel(facture) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateFacture();
  }

  mapToViewModel(facture) {
    return {
      _id: facture._id,
      prixtotale: facture.prixtotale,
      prixtotale_ht: facture.prixtotale_ht,
      prixtotale_final: facture.prixtotale_final,
      lieudelivraison: facture.lieudelivraison,
    };
  }

  render() {
    return (
      <div>
        <h1>Detail Facture</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("_id", "Facture N° :", "text", true)}
          {this.renderInput("prixtotale_ht", "Prix Hors Taxe :", "text", true)}
          {this.renderInput("prixtotale", "Prix Sans Remise :", "text", true)}
          {this.renderInput(
            "prixtotale_final",
            "Prix Final Avec Remise :",
            "text",
            true
          )}
          {this.renderInput(
            "lieudelivraison",
            "Address Livraison :",
            "text",
            true
          )}
        </form>
      </div>
    );
  }
}

export default FactureDetail;
