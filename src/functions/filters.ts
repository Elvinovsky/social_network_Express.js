export const filter = (searchNameTerm: string | null) => {
    return  searchNameTerm
        ? {name: {$regex: 'searchNameTerm', $options: 'i'}}
        : {}
}