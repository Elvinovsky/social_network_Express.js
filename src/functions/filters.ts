
export const filterTitle = (searchTitleTerm: string | null) => {
    return  searchTitleTerm
            ? {title : {$regex: searchTitleTerm, $options: 'i'}}
            : {}
}

export const filterName = (searchNameTerm: string | null) => {
    return  searchNameTerm
            ? {name : {$regex: searchNameTerm, $options: 'i'}}
            : {}
}
