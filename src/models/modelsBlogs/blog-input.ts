export type BlogInput = {
    /**
     * name input Blog {maxLength: 15}
     */
    name: string,
    /**
     * description input model {maxLength: 500}
     */
    description: string,
    /**
     * websiteUrl input model {maxLength: 100}
     */
    websiteUrl: string,

}

export class BlogDBModel {
    constructor ( public name: string,
                  public description: string,
                  public websiteUrl: string,
                  public createdAt: string,
                  /**
                   * True if user has not expired membership subscription to blog
                   */
                  public isMembership: boolean) { }
}