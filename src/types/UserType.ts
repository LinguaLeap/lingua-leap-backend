export interface UserType {
    _id: string;
    googleId: string;
    displayName: string;
    familyName: string;
    givenName: string;
    birthDate: Date;
    photos: Photo[];
    emails: Email[];
    country: string;
    mainLanguage: string[];
    otherLanguages: LanguageLevel[];
    createdAt: string;
}

export interface LoggedUser {
    _id: string;
    googleId: null | string;
    token: string;
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

export interface ChangePasswordType {
    oldPassword: string;
    newPassword: string;
    repeatNewPassword: string;
}