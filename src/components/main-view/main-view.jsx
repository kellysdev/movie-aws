import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { SearchBar } from "../search-bar/search-bar";

const MainView = () => {
  const storedToken = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.ALB_URL}/movies`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then((response) => response.json())
    .then((movies) => {
      setMovies(movies);
    });
  }, [token]);

  return (
    <BrowserRouter>
      <Row className="justify-content-sm-center">
        <Routes>
          <Route
            path="movie-client-side-bucket.s3-website-us-west-1.amazonaws.com/signup"
            element={
              <>
                {user ? (
                  <Navigate to="movie-client-side-bucket.s3-website-us-west-1.amazonaws.com/" />
                ) : (
                  <Col md={5}>
                    <SignupView />
                  </Col>
                )}
              </>
            }
          />

          <Route 
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(userData, token) => {
                        setUser(userData); setToken(token)
                      }}
                     />
                  </Col>
                )}
              </>
            }
          />

          <Route 
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <div>The list is empty!</div>
                ) : (
                  <>
                    <NavigationBar 
                      user={user}
                      onLoggedOut={() => {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}
                    />
                    <Col md={8}>
                      <MovieView 
                      movies={movies} 
                      user={user}
                      setUser={setUser}
                      token={token}
                      />
                    </Col>
                  </>
                )}
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <div>The list is empty!</div>
                ) : (
                  <Col>
                    <Row>
                      <NavigationBar 
                        user={user}
                        onLoggedOut={() => {
                          setUser(null);
                          setToken(null);
                          localStorage.clear();
                        }}
                      />
                    </Row>
                    <Row>
                      <Col className="my-4 mx-auto col-5 col-md-4 justify-content-center" >
                        <SearchBar
                          onSearchTermChange={(searchInput) => {
                            setSearchInput(searchInput);
                          }}
                          searchInput={searchInput}
                        />
                      </Col>
                    </Row>
                    <Row>
                      {
                        movies.filter((movie) => {
                          if(!searchInput) {
                            return true;
                          } else {
                            return movie.Title.toLowerCase().includes(searchInput.toLowerCase());
                          }
                        }).map((movie) => (
                          <Col className="mb-5" key={movie._id} xs={3}>
                            <MovieCard movie={movie} user={user} />
                          </Col>
                        ))
                      }
                    </Row>
                  </Col>
                )}
              </>
            }
          />

          <Route 
            path="/profile"
            element={
              <>
              {!user ? (
                <Navigate to="/login" replace />
              ) : (
                <>
                  <NavigationBar 
                    user={user}
                    onLoggedOut={() => {
                      setUser(null);
                      setToken(null);
                      localStorage.clear();
                    }}
                  />
                  <ProfileView 
                    movies={movies} 
                    user={user} 
                    token={token}
                    setUser={setUser}
                    setToken={setToken}
                  />
                </>
              )}
              </>
            }
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );

};

export default MainView;