export interface UserType {
    _id: string;
    googleId: string;
    displayName: string;
    familyName: string;
    givenName: string;
    birthDate: Date;
    photos: Photo[];
    emails: Email[];
    country: number;
    mainLanguage: string[];
    otherLanguages: LanguageLevel[];
    createdAt: string;
}

export interface Photo {
    value: string;
    _id: string;
}

export interface Email {
    value: string;
    verified: boolean;
    _id: string;
}

export interface LanguageLevel {
    language: string;
    level: number;
}