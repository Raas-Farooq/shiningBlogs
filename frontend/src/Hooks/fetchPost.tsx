// // import React,{useState, useEffect} from 'react';
// // import axios from 'axios';
// import { useAuthenContext } from '../globalContext/globalContext';
// import MakeApiCall from '../pages/makeApiCall';


// const useFetchPost = (id) => {
//     const [post, setPost] = useState({});

//     const [postLoading, setPostLoading] = useState(true);
//     const { setErrorMessage} = useAuthenContext();

//     useEffect(() => {
//         const getPost = async() => {
       
//             const url = `http://localhost:4100/weblog/getBlogPost/${id}`;

//             const onSuccess = (response) => {
//                 console.log('reposne data blogPost inside fetchPost received from makeApicall: ', response.data.blogPost);
//                 setPost(response.data.blogPost)
//             }


//             const onError = (error) => {
//                 if(error?.response?.data.message) {
//                     setErrorMessage(error.response.data.message)
//                 }
//                 else if(error.request){
//                     setErrorMessage("Failed to Get the server response. Try Again Later!")
//                 }
//                 else {
//                     setErrorMessage(error.message);
//                 }
//             }
//             MakeApiCall(setPostLoading, url, {method:"GET"}, onSuccess, onError);   
//         }
//         getPost();
//     },[id])

//     console.log('post inside fetchPost before return: ', post);

//     return {post, postLoading}

    
// }

// export default useFetchPost;

