export type QueryParams = {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string
}
export type QueryParamsNameTerm = {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string
    searchNameTerm: string | null
}