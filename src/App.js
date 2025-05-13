import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";
import Contacts from "./components/contacts.component";
import Categories from "./components/categories.component";
import Events from "./components/events.component";
import NotificationCenter from "./components/notification-center.component";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark">
          <div className="container-fluid">
            <Link to={"/"} className="navbar-brand">
              🗓️ Calendario
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">

                {showModeratorBoard && (
                  <li className="nav-item">
                    <Link to={"/mod"} className="nav-link">
                      🛡️ Moderator Board
                    </Link>
                  </li>
                )}

                {showAdminBoard && (
                  <li className="nav-item">
                    <Link to={"/admin"} className="nav-link">
                      ⚙️ Admin Board
                    </Link>
                  </li>
                )}


                {currentUser && (
                  <li className="nav-item">
                    <Link to={"/contacts"} className="nav-link">
                      📋 Contactos
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link to={"/categories"} className="nav-link">
                      🏷️ Categorías
                    </Link>
                  </li>
                )}

                {currentUser && (
                  <li className="nav-item">
                    <Link to={"/events"} className="nav-link">
                      📅 Eventos
                    </Link>
                  </li>
                )}
              </ul>

              {currentUser ? (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item mr-2 d-flex align-items-center">
                    <NotificationCenter />
                  </li>
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      👤 {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/login" className="nav-link" onClick={this.logOut}>
                      🚪 Cerrar Sesión
                    </a>
                  </li>
                </ul>
              ) : (
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      🔑 Iniciar Sesión
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link">
                      ✏️ Registrarse
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </nav>

        <div className="container mt-4">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user" element={<BoardUser />} />
              <Route path="/mod" element={<BoardModerator />} />
              <Route path="/admin" element={<BoardAdmin />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </div>
        </div>

        {/* <AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;
