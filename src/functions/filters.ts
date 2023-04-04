export const blockMongo_Id =  {projection:{ _id: 0 }}

export const filterLoginOrEmail = (searchEmailTerm?: string, searchLoginTerm?: string ) => {
    return  (searchLoginTerm || searchEmailTerm)
        ? {$or: [{login : {$regex: searchLoginTerm, $options: 'i'}}, {email : {$regex: searchEmailTerm, $options: 'i'}}]}
        : {}
}
