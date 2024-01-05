import * as yup from "yup";

export const RegisterValidation = yup
    .object({
        googleId: yup.string(),
        displayName: yup.string(),
        familyName: yup.string(),
        givenName: yup.string(),
        photos: yup.array().of(
            yup.object({
                value: yup.string().url("Invalid URL format"),
            })
        ),
        emails: yup
            .array()
            .of(
                yup.object({
                    value: yup
                        .string()
                        .email("Invalid email format")
                        .required("Email is required"),
                    verified: yup.boolean(),
                })
            )
            .required("Emails are required"),
        gender: yup.number(),
        birthDate: yup.date(),
        country: yup.string(),
        password: yup.string(),
        mainLanguage: yup
            .array()
            .of(yup.string())
            .required("Main Language is required"),
        otherLanguages: yup.array().of(
            yup.object({
                language: yup.string(),
                level: yup.number(),
            })
        ),
    })
    .noUnknown();

export const UpdateValidation = yup
    .object({
        displayName: yup.string(),
        familyName: yup.string(),
        givenName: yup.string(),
        photos: yup.array().of(
            yup.object({
                value: yup.string().url("Invalid URL format"),
            })
        ),
        gender: yup.number(),
        birthDate: yup.date(),
        country: yup.string(),
        mainLanguage: yup.array().of(yup.string()),
        otherLanguages: yup.array().of(
            yup.object({
                language: yup.string(),
                level: yup.number(),
            })
        ),
    })
    .noUnknown();

export const ChangePasswordValidation = yup
    .object({
        oldPassword: yup.string().required(),
        newPassword: yup.string().required(),
        repeatNewPassword: yup.string().required(),
    })
    .noUnknown();

export const LoginValidation = yup
    .object({
        email: yup.string().email().required(),
        password: yup.string().min(6).required(),
    })
    .noUnknown();
