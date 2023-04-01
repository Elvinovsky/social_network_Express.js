export type QueryParams= {
    pageNumber: number | null,
    pageSize: number | null,
    sortBy: string | null,
    sortDirection: string,
}
export type SearchNameTerm = {searchNameTerm: string | null }
export type SearchTitleTerm = {searchTitleTerm: string | null}
export type SearchEmailTerm = {searchEmailTerm: string | null}
export type SearchLoginTerm = {searchLoginTerm: string | null}