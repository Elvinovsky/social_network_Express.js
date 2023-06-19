export const filterLoginOrEmail = ( searchEmailTerm?: string, searchLoginTerm?: string ) => {
    return (searchLoginTerm || searchEmailTerm) ? {
        $or: [{
            login: {
                $regex: searchLoginTerm,
                $options: 'i'
            }
        }, {
            email: {
                $regex: searchEmailTerm,
                $options: 'i'
            }
        }]
    } : {}
}
