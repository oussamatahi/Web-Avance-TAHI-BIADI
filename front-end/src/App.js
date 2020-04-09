import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Articles from "./components/articles";
import ArticleForm from "./components/articleForm";
import UserForm from "./components/userForm";
import Users from "./components/users";
import NotFound from "./components/notFound";
import AccessDenied from "./components/accessdenied";
import NavBar from "./components/navBar";
import LoginForm from "./components/loginForm";
import ProfileForm from "./components/profileForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute, {
  DeniedRoute,
} from "./components/common/protectedRoute";
import GenreForm from "./components/genreForm";
import auth from "./services/authService";
import Commandes from "./components/commandes";
import MyCommande from "./components/mycommande";
import Factures from "./components/factures";
import CommadeDetail from "./components/commandeDetail";
import FactureDetail from "./components/factureDetail";
import MyFacture from "./components/myfactures";
import NewFacture from "./components/newfacture";
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          <Switch>
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <ProtectedRoute path="/newfacture" component={NewFacture} />
            <DeniedRoute path="/articles/:id" component={ArticleForm} />
            <ProtectedRoute path="/commande/:id" component={CommadeDetail} />
            <ProtectedRoute path="/facture/:id" component={FactureDetail} />
            <DeniedRoute path="/newgenre" component={GenreForm} />
            <DeniedRoute path="/users/:id" component={UserForm} />
            <ProtectedRoute path="/profile" component={ProfileForm} />
            <Route
              path="/articles"
              render={(props) => <Articles {...props} user={this.state.user} />}
            />
            <Route
              path="/users"
              render={(props) => <Users {...props} user={this.state.user} />}
            />
            <DeniedRoute path="/factures" component={Factures} />
            <DeniedRoute path="/users" component={Users} />
            <ProtectedRoute path="/myfactures" component={MyFacture} />
            <ProtectedRoute path="/mycommandes" component={MyCommande} />
            <DeniedRoute path="/commandes" component={Commandes} />
            <Route path="/not-found" component={NotFound} />
            <Route path="/accessdenied" component={AccessDenied} />
            <Redirect from="/" exact to="/articles" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
