import axios from 'axios';

export function extractPrimaryReadsFiles(filesName) {
  //console.log(filesName);
  return axios.get(`http://localhost:3000/api/extractPrimaryReads`,{
    params: {
      filesName
    }
  })
};
