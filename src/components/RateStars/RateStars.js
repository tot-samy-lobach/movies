import React, { Component } from 'react';
import store from 'store';
import PropTypes from 'prop-types';

import { Rate } from 'antd';

import './RateStars.css';
import MovieDbService from '../../services/MovieApiService';

export default class RateStars extends Component {
  MovieDbService = new MovieDbService();
  state = {
    ratingValue: store.get(`${this.props.id}`) || 0,
  };

  setMovieRating = (rate) => {
    const { guestSessionId, id } = this.props;
    this.setState({
      ratingValue: rate,
    });
    if (rate === 0) this.MovieDbService.deleteRateMovie(id, guestSessionId);
    this.MovieDbService.setMovieRating(id, guestSessionId, rate);
    store.set(`${id}`, `${rate}`);
  };

  render() {
    const { ratingValue } = this.state;
    return (
      <Rate
        count={10}
        value={ratingValue}
        onChange={(rate) => {
          this.setMovieRating(rate);
        }}
      />
    );
  }
}
RateStars.defaultProps = {
  guestSessionId: '',
  id: 0,
};

RateStars.propTypes = {
  guestSessionId: PropTypes.string,
  id: PropTypes.number,
};
