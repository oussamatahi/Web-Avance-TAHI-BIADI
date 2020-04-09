import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/commandes";
const endpoint = apiEndpoint + "/mycommandes";

function commandeUrl(id) {
  return `${apiEndpoint}/${id}`;
}
export function getCommandes() {
  return http.get(apiEndpoint);
}
export function getCommande(commandeId) {
  return http.get(commandeUrl(commandeId));
}

export function getMycommande() {
  return http.get(endpoint);
}

export function editCommande(commande) {
  if (commande._id) {
    const body = { ...commande };
    delete body._id;
    return http.put(commandeUrl(commande._id), {
      detailDuCommande: body.detailDuCommande,
    });
  }
}

export function registerCommande(commande) {
  return http.post(apiEndpoint, {
    detailDuCommande: [...commande],
  });
}

export function deleteCommande(commandeId) {
  return http.delete(commandeUrl(commandeId));
}
