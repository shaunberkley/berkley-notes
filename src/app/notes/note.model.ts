export interface Note {
    id?: string;
    uid?: string;
    title?: string;
    content?: string;  
    createdDate?: Date;  
    updatedDate?: Date;
    lastUpdatedUser?: string;
    public?: boolean;
}