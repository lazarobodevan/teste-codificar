class UpdatePostDTO{
    constructor(
        public postId: string,
        public content: string,
        public authorId: string
    ){}
}

export default UpdatePostDTO;