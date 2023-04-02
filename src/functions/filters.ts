export type FilterName = {name?: { $regex: string; $options: string}}
export type FilterTitle = {title?: { $regex: string; $options: string}}
export type FilterLoginOrEmail = {$or: [{login?: { $regex: string | null; $options: string}}, {email?: { $regex: string | null; $options: string}}]}

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


export const filterLoginOrEmail = (searchEmailTerm: string | null, searchLoginTerm: string | null): FilterLoginOrEmail => {

    return {$or: [{login : {$regex: searchLoginTerm, $options: 'i'}}, {email : {$regex: searchEmailTerm, $options: 'i'}}]}
}
export const blockMongo_Id =  {projection:{ _id: 0 }}