import axios from 'axios';



export function uploadFile1(target) {
  //console.log(file);
   const formData = new FormData();
    formData.append('file',target.files[0])
    formData.append('name',target.name)
    return axios.post(`http://localhost:3000/api/uploadFile1`, formData)


}
