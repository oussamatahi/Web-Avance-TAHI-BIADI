import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/articles";

function articleUrl(id) {
  return `${apiEndpoint}/${id}`;
}

export function getArticles() {
  return http.get(apiEndpoint);
}

export function getArticle(articleId) {
  return http.get(articleUrl(articleId));
}

export function saveArticle(article) {
  if (article._id) {
    const body = { ...article };
    delete body._id;
    return http.put(articleUrl(article._id), body);
  }

  return http.post(apiEndpoint, article);
}

export function deleteArticle(articleId) {
  return http.delete(articleUrl(articleId));
}
