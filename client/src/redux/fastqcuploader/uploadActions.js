import axios from 'axios';



export function uploadFile(file) {
  //console.log(file);
   const formData = new FormData();
    formData.append('file',file.file)
    return axios.post(`http://localhost:3000/api/uploadFile`, formData)


}
