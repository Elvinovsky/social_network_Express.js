

export const filterTitle = (searchTitleTerm?: string ) => {
    return  searchTitleTerm? {title : {$regex: searchTitleTerm, $options: 'i'}}
            : {};
}

export const filterName = {}


export const filterLoginOrEmail = (searchEmailTerm?: string, searchLoginTerm?: string ) => {
    return  searchLoginTerm && searchEmailTerm
        ? {$and: [{login : {$regex: searchLoginTerm, $options: 'i'}}, {email : {$regex: searchEmailTerm, $options: 'i'}}]}
        : searchLoginTerm?
            {login : {$regex: searchLoginTerm, $options: 'i'}}
            : searchEmailTerm?
                {email : {$regex: searchEmailTerm, $options: 'i'}}
                : {}
}
export const blockMongo_Id =  {projection:{ _id: 0 }}