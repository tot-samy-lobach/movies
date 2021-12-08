import React from 'react';
import PropTypes from 'prop-types';
import { Consumer } from '../MovieContext/MovieContext';

import Movie from '../Movie';
import './MoviesList.css';

const MoviesList = function ({ movies, guestSessionId }) {
  const data = movies.map((item) => {
    const {
      id,
      title,
      overview,
      popularity,
      release_date: release,
      poster_path: posterPath,
      vote_average: voteAverage,
      genre_ids: genreIds,
      // rating,
    } = item;

    return (
      <Consumer>
        {(moviesGenres) => (
          <Movie
            key={id}
            id={id}
            title={title}
            overview={overview}
            popularity={popularity}
            release={release}
            posterPath={posterPath}
            voteAverage={voteAverage}
            genreIds={genreIds}
            moviesGenres={moviesGenres}
            guestSessionId={guestSessionId}
          />
        )}
      </Consumer>
    );
  });

  return <div className="card-list">{data}</div>;
};

MoviesList.defaultProps = {
  movies: [],
  // moviesGenres: [],
  guestSessionId: '',
};

MoviesList.propTypes = {
  movies: PropTypes.instanceOf(Array),
  // moviesGenres: PropTypes.instanceOf(Array),
  guestSessionId: PropTypes.string,
};

export default MoviesList;
