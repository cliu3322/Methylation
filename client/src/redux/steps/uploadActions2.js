import axios from 'axios';



export function uploadFile2(target) {
  //console.log(file);
   const formData = new FormData();
    formData.append('file',target.files[0])
    formData.append('name',target.name)
    return axios.post(`http://localhost:3000/api/uploadFile2`, formData)


}
