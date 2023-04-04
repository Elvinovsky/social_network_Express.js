
export type PaginatorType<T> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": T
}

export const getPageNumber = (pageNumber?: number ): number => {
    return pageNumber ? +pageNumber : 1;
};

export const getPageSize = (pageSize?: number): number => {
    return pageSize ? +pageSize : 10;
};

export const getSortBy = (sortBy?: string): string => {
    return sortBy ? sortBy : 'createdAt';
};

export const getDirection = (sortDirection?: string ) => {
    return sortDirection === 'asc'? 1 : -1
};

export const getSkip = (pageNumber: number = 1, pageSize: number = 10): number => {
    return (+pageNumber - 1) * +pageSize;
};

export const pagesCountOfBlogs  = (calculateOfFiles: number, pageSize?: number) => {
    return Math.ceil(calculateOfFiles / getPageSize(pageSize))
}
