import { CATEGORIES } from './categories.js';
import { animeData } from './sections/anime.js';
import { seriesData } from './sections/series.js';
import { moviesData } from './sections/movies.js';
import { gamesData } from './sections/games.js';
import { youtubeData } from './sections/youtube.js';
import { booksData } from './sections/books.js';
import { musicData } from './sections/musics.js';

export const MEDIA_DATA = {
  anime: animeData,
  series: seriesData,
  movies: moviesData,
  games: gamesData,
  youtube: youtubeData,
  books: booksData,
  music: musicData,
};

export const placeholderX = './assets/media/placeholder_x.png';
export { CATEGORIES };
