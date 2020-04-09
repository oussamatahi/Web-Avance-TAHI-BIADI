import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/factures";
const endpoint = apiEndpoint + "/myfactures";

function factureUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getFactures() {
  return http.get(apiEndpoint);
}
export function getFacture(factureId) {
  return http.get(factureUrl(factureId));
}

export function getMyfacture() {
  return http.get(endpoint);
}

export function registerFacture(facture) {
  return http.post(apiEndpoint, {
    commande: facture.commandeId,
    lieudelivraison: facture.lieudelivraison,
  });
}

export function deleteFacture(factureId) {
  return http.delete(factureUrl(factureId));
}
