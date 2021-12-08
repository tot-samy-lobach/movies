import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from 'antd';
import { format } from 'date-fns';
import { custDescription, getColorRate } from '../../services/helpers';
import RateStars from '../RateStars/RateStars';
import noimg from './noimg.jpg';

import './Movie.css';

export default class Movie extends Component {
  static defaultProps = {
    id: null,
    title: 'No title',
    overview: 'No overview',
    release: new Date(),
    posterPath: '',
    voteAverage: 0,
    moviesGenres: [],
    genreIds: [],
    guestSessionId: '',
  };

  static propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    overview: PropTypes.string,
    release: PropTypes.string,
    posterPath: PropTypes.string,
    voteAverage: PropTypes.number,
    moviesGenres: PropTypes.instanceOf(Array),
    genreIds: PropTypes.instanceOf(Array),
    guestSessionId: PropTypes.string,
  };

  render() {
    const { Title, Text } = Typography;
    const { id, title, overview, release, posterPath, voteAverage, genreIds, moviesGenres, guestSessionId } =
      this.props;

    const description = custDescription(overview);
    const colorRate = getColorRate(voteAverage);

    const genres = moviesGenres.filter((item) => genreIds.includes(item.id));
    const genersContent = genres.map((item) => (
      <Text code key={item.id}>
        {item.name}
      </Text>
    ));

    return (
      <Card hoverable key={id}>
        <img className="card-img" alt="" src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : noimg} />
        <Title level={4} className="card-movie-title">
          {title}
        </Title>
        <div className="card-popularity-count" style={colorRate}>
          {voteAverage}
        </div>
        <Text type="secondary" className="card-release-date">
          {release ? format(new Date(release), 'MMMM dd, yyyy') : 'Дата не определена'}
        </Text>
        <div className="card-tags">{genersContent}</div>
        <Text className="card-overview">{description}</Text>
        <RateStars id={id} guestSessionId={guestSessionId} />
      </Card>
    );
  }
}
