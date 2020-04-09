import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { addGenre } from "../services/genreService";
import { toast } from "react-toastify";

class GenreForm extends Form {
  state = {
    data: {
      name: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Genre Name").max(100).min(5),
  };

  doSubmit = async () => {
    await addGenre(this.state.data);
    this.props.history.push("/articles");
    toast("Genre was created successfully!!");
  };

  render() {
    return (
      <div>
        <h1>Adding New Genre</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Genre Name :")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default GenreForm;
