import axios from 'axios';



export function uploadFile(file) {
  //console.log(file);
   const formData = new FormData();
    formData.append('image',file.file,file.file.name)
    return axios.post(`http://localhost:3000/api/uploadFile`, formData)
    // .then((response)=>{
    //   //console.log(response.status)
    //   return response.status
    //
    //   //dispatch({type: 'File_DETAIL', payload: response });
    // })


}
