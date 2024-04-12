class Pagination<T>{
    page: number;
    totalPages: number;
    pageSize:number;
    offset:number;
    data: T[];
    
    constructor({
        page,
        pageSize,
        offset,
        data,
        totalPages
      }: {
        page: number;
        totalPages:number;
        pageSize: number;
        offset: number;
        data: T[];
      }) {
        this.page = page;
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.offset = offset;
        this.data = data;
      }
}

export default Pagination;