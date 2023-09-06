import * as yup from 'yup';

import { apiGet, apiPost } from './baseApi';

export const CategoryModelValidator = yup.object().shape({
    id: yup.number().required('Category ID is missing'),
    name: yup.string().required('Category Name is invalid'),
});

/**
 * This function validates the category response coming from backend.
 * 
 * @param {CategoryModelValidator} category An category object or an array of categorys
 */
const categoryValidate = async (categorys) => {
    try {
        if (Array.isArray(categorys)) {
            for (let category of categorys) {
                await CategoryModelValidator.validate(category);
            }
        } else {
            await CategoryModelValidator.validate(categorys);
        }
    } catch (validationError) {
        console.error(validationError);
        throw validationError;
    }
}

/**
 * Get paginationized categorys from backend.
 * 
 * There are 2 ways of getting categorys from backend.
 * One is to use access_token given when logged in.
 * Another one is to use API_PRIVATE_KEY as a token.
 * As we send access_token by default in baseApi, we follow first one.
 * 
 * @param {number} page Page Number starting from 0
 * @param {number} pageSize Page Size. default is 15.
 * @returns An array of categorys
 */
export const getcategories = async (page = 0, size = 100) => {
    try {
        const response = await apiGet({
            url: '/category',
            queryParams: { page, size },
        });

        await categoryValidate(response.data);

        return response;
    } catch (error) {
        console.error('[Error] getCategorys Failed.', error);
        throw error;
    }
};

/**
 * Get a specific category based on category id.
 * 
 * if return value is undefined, it will show 404 Not Found Page.
 * 
 * @param {number} categoryId ID of the selected category
 * @returns An object to describe details
 */
export const getCategoryDetail = async (categoryId) => {
    try {
        const category = await apiGet({
            url: '/category',
            queryParams: { categoryId },
        });

        await categoryValidate(category);

        return category;
    } catch (error) {
        console.error('[Error] getCategory Failed.', error);
        throw error;
    }
}

/**
 * Add a category to backend database and return the added on.
 * 
 * @param {string} category A category name
 * @returns An added object. Undefined if failed.
 */
export const addCategory = async (category) => {
    try {
        const newCategory = await apiPost({
            url: '/category',
            bodyParam: {name: category},
        });

        await categoryValidate(newCategory);

        return newCategory;
    } catch (error) {
        console.error('[Error] newCategory Failed.', error);
        throw error;
    }
}