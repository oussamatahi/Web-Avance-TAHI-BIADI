import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getUser, saveUser } from "../services/userService";
import { toast } from "react-toastify";

class UserForm extends Form {
  state = {
    data: {
      name: "",
      email: "",
      isAdmin: "",
      taux_remise: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name").max(100).min(5),
    email: Joi.string().email().required().label("Email"),
    taux_remise: Joi.number().required().min(0).max(1).label("Remise"),
    isAdmin: Joi.boolean().required().label("IsAdmin"),
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === "new") return;

      const { data: user } = await getUser(userId);
      this.setState({ data: this.mapToViewModel(user) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateUser();
  }

  mapToViewModel(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      taux_remise: user.taux_remise,
      isAdmin: user.isAdmin,
    };
  }

  doSubmit = async () => {
    await saveUser(this.state.data);
    this.props.history.push("/users");
    toast("User edited successfully!!");
  };

  render() {
    return (
      <div>
        <h1>User Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name :", "text", true)}
          {this.renderInput("email", "Email :", "text", true)}
          {this.renderInput("isAdmin", "IsAdmin :")}
          {this.renderInput("taux_remise", "Remise :")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default UserForm;
