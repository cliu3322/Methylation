import axios from 'axios';

export function alignFiles(filesName) {
  //console.log(filesName);
  return axios.get(`http://localhost:3000/api/align`,{
    params: {
      filesName
    }
  })
};
