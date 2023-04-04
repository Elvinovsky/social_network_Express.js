export type PaginatorType<T> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": T
}
export enum SortDirection {
    Asc = 1,
    Desc = -1
}
export const DEFAULT_PAGE_SortBy = 'createdAt'
const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10



export const getPageNumber = (pageNumber?: number ): number => {
    return pageNumber ? +pageNumber : DEFAULT_PAGE_NUMBER;
};

export const getPageSize = (pageSize?: number): number => {
    return pageSize ? +pageSize : DEFAULT_PAGE_SIZE;
};

export const getSortBy = (sortBy?: string): string => {
    return sortBy ? sortBy : DEFAULT_PAGE_SortBy;
};

export const getDirection = (sortDirection?: string ) => {
    return sortDirection === 'asc'? SortDirection.Asc : SortDirection.Desc
};

export const getSkip = (pageNumber: number = 1, pageSize: number = 10): number => {
    return (+pageNumber - 1) * +pageSize;
};

export const pagesCountOfBlogs  = (calculateOfFiles: number, pageSize?: number): number => {
    return Math.ceil(calculateOfFiles / getPageSize(pageSize))
}

