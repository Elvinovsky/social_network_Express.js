export type QueryParams = {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string
}
export type QueryParamsAndNameTerm = {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string
    searchNameTerm: string | null
}

export type QueryParamsAndTitleTerm = {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string
    searchTitleTerm: string | null
}