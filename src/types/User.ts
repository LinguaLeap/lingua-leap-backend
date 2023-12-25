export interface User {
    _id: string;
    googleId: string;
    displayName: string;
    familyName: string;
    givenName: string;
    photos: Photo[];
    emails: Email[];
    mainLanguage: string;
    otherLanguages: LanguageLevel[];
    friends: Friend[];
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
  
  export interface Friend {
    _id: string;
    userId: string;
    status: boolean;
  }