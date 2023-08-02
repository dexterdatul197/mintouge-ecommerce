import * as yup from 'yup';

import { apiPost } from './baseApi';

/**
 * This function validates the product response coming from backend.
 * 
 * @param {UserModelValidator} product An product object or an array of products
 */
const userValidate = async (user) => {
    try {
        const validatedResponse = await UserModelValidator.validate(user);

        return validatedResponse;
    } catch (validationError) {
        console.error(validationError);
        throw validationError;
    }
}

export const UserModelValidator = yup.object().shape({
    id: yup.number().required('User ID is missing'),
    email: yup.string().required('User Email is invalid.'),
    firstName: yup.string().required('User First Name is invalid.'),
    lastName: yup.string().required('User Last Name is invalid.'),
    brandName: yup.string().required('Brand Name is invalid.'),
    apiSecretKey: yup.string().required('API Secret Key is invalid.'),
    apiPublicKey: yup.string().required('API Public Key is invalid.'),
    
    walletId: yup.string().optional('Wallet ID is invalid.').nullable(),
    address: yup.string().optional().nullable(),
    phone: yup.string().optional().nullable(),
    siteUrl: yup.string().optional().nullable(),
});

/**
 * Sign in to Brand Dashboard backend.
 * The API response will send cookies as well,
 * so the next APIs will be sent with the cookie.
 * 
 * @param {string} email A user's email
 * @param {string} password A user's password
 * @returns {UserModelValidator} A User object.
 */
export const signIn = async ({ email, password }) => {
    try {
        const user = await apiPost({
            url: '/auth/login',
            bodyParam: { email, password },
        });

        await userValidate(user);
        return user;
    } catch (error) {
        // Handle any network or server errors
        console.error('[Error] Login Failed.', error);
        throw error;
    }
};

/**
 * Sign up to Brand Dashboard backend.
 * The API response will send a verification email.
 * so the user should have to sign in after the account creation.
 * 
 * @param {string} email A user's email
 * @param {string} password A user's password
 * @param {string} firstName A user's first name
 * @param {string} lastName A user's last name
 * @param {string} brandName A brand name like Gucci or Nike
 * @returns {UserModelValidator} A newly created user.
 */
export const signUp = async (userInfo) => {
    try {
        const user = await apiPost({
            url: '/auth/signup',
            bodyParam: userInfo,
        });

        await userValidate(user);
        return user;
    } catch (error) {
        // Handle any network or server errors
        console.error('[Error] Sign up Failed.', error);
        throw error;
    }
}

