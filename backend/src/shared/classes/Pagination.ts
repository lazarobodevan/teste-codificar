class Pagination<T>{
    page: number;
    pageSize:number;
    offset:number;
    data: T[];
    
    constructor({
        page,
        pageSize,
        offset,
        data,
      }: {
        page: number;
        pageSize: number;
        offset: number;
        data: T[];
      }) {
        this.page = page;
        this.pageSize = pageSize;
        this.offset = offset;
        this.data = data;
      }
}

export default Pagination;