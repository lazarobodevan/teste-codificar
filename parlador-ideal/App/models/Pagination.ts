class Pagination<T>{
    constructor(
        public page:number,
        public totalPages:number,
        public data:T[]
    ){

    }
}

export default Pagination;