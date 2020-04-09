import http from "./httpService";
import { apiUrl } from "../config.json";

export function getGenres() {
  return http.get(apiUrl + "/genres");
}

export function addGenre(genre) {
  return http.post(apiUrl + "/genres", { name: genre.name });
}
