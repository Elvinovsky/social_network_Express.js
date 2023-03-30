export type FilterName = {name?: { $regex: string; $options: string}}
export type FilterTitle = {title?: { $regex: string; $options: string}}

export const filterTitle = (searchTitleTerm: string | null): FilterTitle => {
    return  searchTitleTerm
            ? {title : {$regex: searchTitleTerm, $options: 'i'}}
            : {};
}

export const filterName = (searchNameTerm: string | null): FilterName => {
    return  searchNameTerm
            ? {name : {$regex: searchNameTerm, $options: 'i'}}
            : {};
}
