

export const filterTitle = (searchTitleTerm: string | null) => {
    return  searchTitleTerm
            ? {title : {$regex: searchTitleTerm, $options: 'i'}}
            : {};
}

export const filterName = (searchNameTerm: string | null) => {
    return  searchNameTerm
            ? {name : {$regex: searchNameTerm, $options: 'i'}}
            : {};
}


export const filterLoginOrEmail = (searchEmailTerm: string | null, searchLoginTerm: string | null) => {
    return  searchLoginTerm && searchEmailTerm
        ? {$or: [{login : {$regex: searchLoginTerm, $options: 'i'}}, {email : {$regex: searchEmailTerm, $options: 'i'}}]}
        : !searchEmailTerm&&searchLoginTerm?
            {login : {$regex: searchLoginTerm, $options: 'i'}}
            : searchEmailTerm?
                {email : {$regex: searchEmailTerm, $options: 'i'}}
                : {}
}
export const blockMongo_Id =  {projection:{ _id: 0 }}