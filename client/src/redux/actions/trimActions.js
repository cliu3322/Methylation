import axios from 'axios';

export function trimFiles(filesName) {
  //console.log(filesName);
  return axios.get(`http://localhost:3000/api/trim`,{
    params: {
      filesName
    }
  })
};
