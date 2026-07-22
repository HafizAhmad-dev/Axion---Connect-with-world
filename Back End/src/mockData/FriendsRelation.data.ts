export interface friendsRelationDataType {
    id:string,
    date:Date
    userA:string,
    userB:string,
    friendsSince?:Date | string
}


export const friendsRelationData:friendsRelationDataType[] = []