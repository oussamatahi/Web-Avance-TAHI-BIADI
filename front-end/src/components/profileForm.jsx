import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import {
  getMyaccount,
  saveMyaccount,
  deleteMyaccount,
} from "../services/userService";
import { login, logout } from "../services/authService";
import { toast } from "react-toastify";

class ProfileForm extends Form {
  state = {
    data: {
      name: "",
      email: "",
      password: "",
      taux_remise: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name").max(100).min(5),
    password: Joi.string().label("Password"),
    email: Joi.string().email().required().label("Email"),
    taux_remise: Joi.number().required().min(0).max(1).label("Remise"),
  };

  async populateUser() {
    try {
      const { data: user } = await getMyaccount();
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
      password: "",
      email: user.email,
      taux_remise: user.taux_remise,
    };
  }

  doSubmit = async () => {
    await saveMyaccount(this.state.data);
    await login(this.state.data.email, this.state.data.password);
    this.props.history.push("/");
    toast("Profile was edited successfull!!");
  };
  onDelete = async () => {
    try {
      await deleteMyaccount();
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return toast.error("This Profile has already been deleted.");
    }

    logout();
    window.location = "/";
    toast("Profile has been deleted successfully");
  };

  render() {
    return (
      <div>
        <h1>Edit Profile</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name :")}
          {this.renderInput("password", "Password :", "password")}
          {this.renderInput("email", "Email :", "text", true)}
          {this.renderInput("taux_remise", "Remise :", "text", true)}
          {this.renderButton("Save")}
          <button
            onClick={() => this.onDelete()}
            className="m-2 btn btn-danger btn-sm"
          >
            Delete Profile
          </button>
        </form>
      </div>
    );
  }
}

export default ProfileForm;
