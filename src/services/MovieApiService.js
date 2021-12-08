export default class MovieApiService {
  apiKEY = 'd96ee218296b50bab99a57cef646cd6e';

  baseURL = 'https://api.themoviedb.org/3';

  async getMoviesFromServer(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, recived ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  searchMovie = async (search = 'return', currentPage = 1) => {
    const url = `${this.baseURL}/search/movie?api_key=${this.apiKEY}&include_adult=false&query=${search}&page=${currentPage}`;
    const body = await this.getMoviesFromServer(url);
    return body;
  };

  getGenersList = async () => {
    const url = `${this.baseURL}/genre/movie/list?api_key=${this.apiKEY}`;
    const body = await this.getMoviesFromServer(url);
    return body;
  };

  getRatedMovies = async (guestSessionToken, pageNumber = 2) => {
    const url = `${this.baseURL}/guest_session/${guestSessionToken}/rated/movies?api_key=${this.apiKEY}&page=${pageNumber}`;
    const body = await this.getMoviesFromServer(url);
    return body;
  };

  guestSession = async () => {
    const url = `${this.baseURL}/authentication/guest_session/new?api_key=${this.apiKEY}`;
    const body = await this.getMoviesFromServer(url);
    return body;
  };

  setMovieRating = async (id, guestSessionToken, rate) => {
    const url = `${this.baseURL}/movie/${id}/rating?api_key=${this.apiKEY}&guest_session_id=${guestSessionToken}`;
    const body = {
      value: rate,
    };
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(body),
    }).catch((err) => {
      console.error('Возникла проблема с fetch запросом: ', err.message);
    });
  };

  deleteRateMovie = async (id, guestSessionToken) => {
    const url = `${this.baseURL}/movie/${id}/rating?api_key=${this.apiKEY}&guest_session_id=${guestSessionToken}`;
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
    };
    await fetch(url, {
      method: 'DELETE',
      headers,
    });
  };
}
