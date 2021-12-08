/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Pagination, Layout, Space, Spin, Alert, Input } from 'antd';
import * as _ from 'lodash';
import store from 'store';
import Header from '../Header';
import MoviesList from '../MoviesList';
import MovieApiService from '../../services/MovieApiService';
import { Provider } from '../MovieContext/MovieContext';

import 'antd/dist/antd.css';
import './App.css';

export default class App extends Component {
  MovieApiService = new MovieApiService();
  debounceSearchMovies = _.debounce(this.searchMovies.bind(this), 700);
  state = {
    movies: [],
    moviesGenres: [],
    loading: true,
    error: false,
    internet: true,
    search: 'return',
    searchInput: '',
    currentPage: 1,
    totalPage: null,
    ratedFilm: [],
    tabPane: '1',
    guestSessionId: '',
  };

  componentDidMount() {
    this.onInternetAddEvent();
    if (!store.get('guestSessionId')) {
      this.createGuestSession();
    } else {
      this.setState({
        guestSessionId: store.get('guestSessionId'),
      });
    }
    this.MovieApiService.searchMovie()
      .then((res) => {
        this.setState({ movies: res.results, loading: false, totalPage: res.total_pages });
      })
      .catch(this.onError);
    this.MovieApiService.getGenersList().then((res) => {
      this.setState({ moviesGenres: res.genres });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { search, currentPage } = this.state;
    if ((search !== prevState.search && search !== '') || currentPage !== prevState.currentPage) {
      this.MovieApiService.searchMovie(search, currentPage)
        .then((res) => {
          this.setState(() => ({
            movies: res.results,
            loading: false,
            error: false,
            totalPage: res.total_pages,
            currentPage,
          }));
        })
        .catch(this.onError);
    }
  }

  onInternetAddEvent() {
    window.addEventListener('offline', this.onInternet.bind(this));
    window.addEventListener('online', this.onInternet.bind(this));
  }

  onInternet() {
    const { internet } = this.state;
    this.setState({ internet: !internet });
  }

  createGuestSession = () => {
    this.MovieApiService.guestSession()
      .then((body) => {
        store.set('guestSessionId', `${body.guest_session_id}`);
        this.setState({
          guestSessionId: body.guest_session_id,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          loading: false,
        });
      });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  searchMoviesInput = (searchInput) => {
    this.setState({ searchInput });
    this.debounceSearchMovies(searchInput);
  };

  changeTab = (key) => {
    if (key === '2') {
      this.setState(
        {
          tabPane: key,
          currentPage: 1,
        },
        () => {
          this.getRatedMovies();
        }
      );
    } else {
      this.setState(
        {
          // error: false,
          tabPane: key,
          currentPage: 1,
        },
        () => {
          this.searchMovies();
        }
      );
    }
  };

  changePage = (page) => {
    const { tabPane } = this.state;
    this.setState(
      {
        currentPage: page,
      },
      () => {
        if (tabPane === '1') {
          this.searchMovies();
        } else {
          this.getRatedMovies();
        }
      }
    );
  };

  getRatedMovies = () => {
    const { guestSessionId, currentPage } = this.state;
    this.MovieApiService.getRatedMovies(guestSessionId, currentPage)
      .then((item) => {
        this.setState({
          ratedFilm: item.results,
          totalPage: item.total_pages,
          currentPage,
        });

        if (item.results.length === 0) {
          this.setState({
            // isLoading: false,
            // notFound: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          // isLoading: false,
          // notFound: false,
          // isError: true,
        });
      });
  };

  searchMovies(newSearch) {
    const { search } = this.state;

    if (newSearch === search) this.setState({ search: newSearch, searchInput: '' });
    else this.setState({ loading: true, search: newSearch, searchInput: '' });
  }

  render() {
    const {
      movies,
      moviesGenres,
      loading,
      // error,
      internet,
      currentPage,
      searchInput,
      totalPage,
      search,
      tabPane,
      ratedFilm,
      guestSessionId,
    } = this.state;

    if (!internet) {
      return (
        <Alert message="Нет подключения к интернету" description="Попробуйте повторить позже" type="error" showIcon />
      );
    }
    if (search === '') {
      <Alert
        message="Начните поиск фильма"
        description="Введите название фильма в поисковую строку"
        type="info"
        showIcon
      />;
    }

    // const hasData = !(loading || error);
    // const errorMessege = error ? (
    //   <Alert message="Error" description="Что-то пошло не так. Попробуйте повторить" type="error" showIcon />
    // ) : null;
    const spinner = loading ? <Spin /> : null;
    const inputSearch =
      tabPane === '1' ? (
        <Input
          autoFocus
          value={searchInput}
          onChange={(event) => {
            this.searchMoviesInput(event.target.value);
          }}
          placeholder="Поиск ...."
        />
      ) : null;

    const moviesList =
      tabPane === '1' ? (
        <MoviesList movies={movies} moviesGenres={moviesGenres} guestSessionId={guestSessionId} />
      ) : (
        <MoviesList movies={ratedFilm} moviesGenres={moviesGenres} guestSessionId={guestSessionId} />
      );

    const pagination =
      tabPane === '1' ? (
        <Pagination
          defaultCurrent={1}
          total={movies.length * totalPage}
          pageSize={20}
          current={currentPage}
          onChange={this.changePage}
          showSizeChanger={false}
        />
      ) : (
        <Pagination
          defaultCurrent={1}
          total={ratedFilm.length * totalPage}
          pageSize={20}
          current={currentPage}
          onChange={this.changePage}
          showSizeChanger={false}
        />
      );

    return (
      <div className="container">
        <Provider value={moviesGenres}>
          <Layout>
            <Header changeTab={this.changeTab} />
            {inputSearch}
            <Space direction="vertical" align="center">
              {spinner}
              <div className="">{moviesList}</div>
              {pagination}
              {/* {errorMessege} */}
            </Space>
          </Layout>
        </Provider>
      </div>
    );
  }
}
