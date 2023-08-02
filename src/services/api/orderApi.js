import * as yup from 'yup';

import { apiGet, apiPost } from './baseApi';

export const OrderModelValidator = yup.object().shape({
    product: yup.object({
        name: yup.string().required('Product Name is invalid.'),
        price: yup.number().required('Product price is invalid'),
        productUrl: yup.string().required('Product URL is invalid'),
        images: yup.array(yup.string()).required('Product Images are not valid'),
        fullDescription: yup.string().required('Full Description is invalid'),
        productKey: yup.string().required('Product ID is invalid'),
        madeAt: yup.date().required('Product Made Date is missing'),
        asset3dUrl: yup.string().nullable().optional('Asset 3D URL is invalid'),
    }).required('Product Info should be provided'),
    consumer: yup.object({
        email: yup.string().required('Consumer Email should be provided'),
        firstName: yup.string().required('Consumer First Name should be provided'),
        lastName: yup.string().required('Consumer Last Name should be provided'),
    }).required('consumer Info should be provided'),
    collection: yup.object({
        address: yup.string().defined('Collection Address should be provided')
    }).required('consumer Info should be provided'),
    chain: yup.string().required('Blockchain Network Name should be provided'),
    dpp: yup.string().required('Digital Product Passport should be provided'),
});

/**
 * This function validates the order response coming from backend.
 * 
 * @param {OrderModelValidator} order An order object or an array of orders
 */
const orderValidate = async (orders) => {
    try {
        if (Array.isArray(orders)) {
            for (let order of orders) {
                await OrderModelValidator.validate(order);
            }
        } else {
            await OrderModelValidator.validate(orders);
        }
    } catch (validationError) {
        console.error(validationError);
        throw validationError;
    }
}

/**
 * Get paginationized orders from backend.
 * 
 * There are 2 ways of getting orders from backend.
 * One is to use access_token given when logged in.
 * Another one is to use API_PRIVATE_KEY as a token.
 * As we send access_token by default in baseApi, we follow first one.
 * 
 * @param {number} page Page Number starting from 0
 * @param {number} pageSize Page Size. default is 15.
 * @returns An array of orders
 */
export const getOrders = async (page = 0, size = 100) => {
    try {
        const response = await apiGet({
            url: '/digital-passport',
            queryParams: { page, size },
        });

        await orderValidate(response.data);

        return response;
    } catch (error) {
        console.error('[Error] getOrders Failed.', error);
        throw error;
    }
};

/**
 * Get a specific order based on order id.
 * 
 * if return value is undefined, it will show 404 Not Found Page.
 * 
 * @param {number} orderId ID of the selected order
 * @returns An object to describe details
 */
export const getOrderFee = async (productKey) => {
    try {
        const fee = await apiGet({
            url: `/digital-passport/${productKey}/fees`,
        });

        return fee;
    } catch (error) {
        console.error('[Error] getOrderFee Failed.', error);
        throw error;
    }
}

/**
 * Add a order to backend database and return the added on.
 * 
 * @param {OrderModel} order A order name
 * @returns An added object. Undefined if failed.
 */
export const addOrder = async (order) => {
    try {
        const newOrder = await apiPost({
            url: '/digital-passport',
            bodyParam: order,
        });

        return newOrder;
    } catch (error) {
        console.error('[Error] newOrder Failed.', error);
        throw error;
    }
}