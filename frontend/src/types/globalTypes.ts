interface Blog{
    _id:string,
    userId:string,
    title:string,
    titleImage:string,
    public_id:string,
    content:[],
    contentImages:[],
    category:string,
    createdAt:string,
    updatedAt:string
}


export interface User{
  _id:string,
  username:string,
  email:string,
  password:string,
  profileImg:string,
  TopicsInterested:[],
  goal:string,
  createdAt:string,
  updatedAt:string
}

export {type Blog}