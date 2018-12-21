import axios from 'axios';

export function trimFiles(files) {
  //console.log(filesname);
  return axios.get(`http://localhost:3000/api/trim`,{
    params: {
      files
    }
  })
};
