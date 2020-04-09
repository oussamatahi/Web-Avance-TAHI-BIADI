import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";
const endpoint = apiEndpoint + "/myaccount";

function userUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getUsers() {
  return http.get(apiEndpoint);
}
export function getUser(userId) {
  return http.get(userUrl(userId));
}

export function getMyaccount() {
  return http.get(endpoint);
}

export function saveMyaccount(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(endpoint, { name: body.name, password: body.password });
  }
}

export function saveUser(user) {
  if (user._id) {
    const body = { ...user };
    delete body._id;
    return http.put(userUrl(user._id), {
      isAdmin: body.isAdmin,
      taux_remise: body.taux_remise,
    });
  }
}

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

export function deleteMyaccount() {
  return http.delete(endpoint);
}
