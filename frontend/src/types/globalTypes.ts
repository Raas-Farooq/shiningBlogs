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


export {type Blog}