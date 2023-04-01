
export type PaginatorType<T> = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": T
}

export const getMongoPageNumber = (pageNumber: number | null): number => {
    return pageNumber ? +pageNumber : 1;
};

export const getMongoPageSize = (pageSize: number | null): number => {
    return pageSize ? +pageSize : 10;
};

export const getMongoSortBy = (sortBy: string | null): string => {
    return sortBy ? sortBy : 'createdAt';
};

export const getMongoSortDirection = (sortDirection: string | null) => {
    return sortDirection === 'asc'? 1 : -1
};

export const getMongoSkip = (pageNumber: number, pageSize: number): number => {
    return (+pageNumber - 1) * +pageSize;
};

export const pagesCountOfBlogs  = (calculateOfFiles: number, pageSize: number | null) => {
    return Math.ceil(calculateOfFiles / getMongoPageSize(pageSize))
}
