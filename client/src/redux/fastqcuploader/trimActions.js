import axios from 'axios';

export function trimFiles(file) {
  return axios.get(`http://localhost:3000/api/trim`)

}
