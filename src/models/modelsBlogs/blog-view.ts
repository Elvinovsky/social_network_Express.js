// dto, pojo, anemic model
export class BlogView {
    constructor (    public id: string,
                     public name: string,
                     public description: string,
                     public websiteUrl: string,
                     public createdAt: string,
                     /**
                      * True if user has not expired membership subscription to blog
                      */
                     public isMembership: boolean) {
    }

}
