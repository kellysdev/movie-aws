import React from "react";
import { Button, Row, Col, Container } from "react-bootstrap";
import { useParams } from "react-router";
import { MovieCard } from "../movie-card/movie-card";

export const MovieView = ({ movies, user, setUser, token }) => {
  const {movieId} = useParams();
  const movie = movies.find((m) => m._id === movieId);

  const selectedMovie = movies.find(movie => movie._id === movieId);
  const similarMovies = movies.filter(movie => {
    return movie._id !== movieId && movie.Genre.Name === selectedMovie.Genre.Name;
  });

  const handleAddFavorite = (event) => {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_URL}/users/${user.Username}/movies/${movie._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      if (response.ok) {
        alert("This movie has been added to your list");
      } else {
        alert("Something went wrong.");
        return false;
      }
    })
    .then(() => {
      fetch(`${process.env.REACT_APP_URL}/users/${user.Username}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
      })
    })
    .catch((e) => alert(e));
  };

  const handleRemoveFavorite = (event) => {
    event.preventDefault();

    fetch(`${process.env.REACT_APP_URL}/users/${user.Username}/movies/${movie._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`}
    })
    .then((response) => {
      if (response.ok) {
        alert("This movie has been removed from your list.");
      } else {
        alert("Could not remove the movie from your list.");
      }
    })
    .then(() => {
      fetch(`${process.env.REACT_APP_URL}/users/${user.Username}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      .then((response) => response.json())
      .then((user) => {
        setUser(user);
      })
    })
    .catch((e) => alert(e));
  };

  return (
    <Container className="fluid">
    <Row className="justify-content-center">
      <Col className="col-6">
        <Row>
          <h3>{movie.Title}</h3>
        </Row>
        <Row>
          <p>{movie.ReleaseDate}</p><br />
          <p>{movie.Description}</p><br /><br />
          <p>Genre: {movie.Genre.Name}<br />
            Director: {movie.Director.Name}<br />
            Actors: {movie.Actors.join(", ")}</p>
        </Row>

        <Row className="movieview-buttons">
          {user.FavoriteMovies.includes(movie._id)
            ? <Button onClick={handleRemoveFavorite} className="p-2 m-2" variant="warning">Remove from Favorites</Button> 
            : <Button onClick={handleAddFavorite} className="p-2 m-2" variant="warning">Add to Favorites</Button>
          }

          {/* <Link to={`/`}>
            <Button variant="warning" className="p-2 ms-auto">Home</Button>
          </Link> */}
        </Row>
      </Col>

      <Col className="col-1"></Col>

      <Col className="col-5">
        <img className="movieview-image" src={movie.ImagePath} />
      </Col>
    </Row>
    <Row className="mt-5">
      <Col>
          <Row>
            <h4>Similar Movies</h4>
          </Row>
          <Row>
            {similarMovies.map((movie) => (
                <Col className="mb-5" key={movie._id} sm={4}>
                  <MovieCard 
                    movie={movie} user={user}
                   />
                </Col>
              ))}
          </Row>
      </Col>
    </Row>
    </Container>
  );
};