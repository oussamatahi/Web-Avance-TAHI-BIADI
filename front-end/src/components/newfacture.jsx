import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { registerFacture } from "../services/factureService";
import { toast } from "react-toastify";

class NewFacture extends Form {
  state = {
    data: {
      commandeId: localStorage.getItem("commandeId"),
      lieudelivraison: "",
    },
    errors: {},
  };

  schema = {
    commandeId: Joi.string(),
    lieudelivraison: Joi.string().min(5),
  };

  doSubmit = async () => {
    const { data: facture } = await registerFacture(this.state.data);

    this.props.history.replace(`/facture/${facture._id}`);
    toast("Facture created successfully!!");
    localStorage.removeItem("commandeId");
  };

  render() {
    return (
      <div>
        <h1>New Facture</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("commandeId", "Commande N° :", "text", true)}
          {this.renderInput("lieudelivraison", "Address Livraison :", "text")}
          {this.renderButton("Get Facture")}
        </form>
      </div>
    );
  }
}

export default NewFacture;
