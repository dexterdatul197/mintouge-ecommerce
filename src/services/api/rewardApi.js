import * as yup from 'yup';

import { apiGet } from './baseApi';

let testRewards = [];
const MOCK_REWARD = false;

export const initialReward = {
    id: 0, // Auto Increase
    title: '',
    category: '',
    discount: 0,
    videoLink: '',
    cta: '',
    description: '',
    coverImage: '',
    rewardCode: '',
    eventFrom: new Date().toISOString().split('T')[0],
    eventTo: new Date().toISOString().split('T')[0],
    hasExpire: false,
    triggerProductIds: [], // An array of trigger products ID
    applyToProductIds: [] // An array of apply to products ID
};

export const RewardModelValidator = yup.object().shape({
    id: yup.number()
        .required('Reward ID is missing'),
    category: yup.string()
        .required('Reward Title is invalid.'),
    discount: yup.number()
        .required('Reward Discount is invalid'),
    videoLink: yup.string()
        .optional('Reward Video Link is invalid'),
    cta: yup.string()
        .optional('Reward External Link is invalid'),
    description: yup.string()
        .required('Full Description is invalid'),
    coverImage: yup.string()
        .required('Reward Cover Image is invalid'),
    rewardCode: yup.string()
        .optional('Reward Unique Code is missing'),
    eventFrom: yup.date()
        .optional('Reward Event Start Date is invalid'),
    eventTo: yup.date()
        .optional('Reward Event Start Date is invalid'),
    hasExpire: yup.boolean()
        .optional('Reward Expiration Flag is invalid'),
    triggerProductIds: yup.array(yup.number())
        .required('Reward Products are not valid'),
    applyToProductIds: yup.array(yup.number())
        .required('Rewarding Products are not valid'),
});

/**
 * This function validates the reward response coming from backend.
 * 
 * @param {RewardModelValidator} reward An reward object or an array of rewards
 */
const rewardValidate = async (rewards) => {
    try {
        if (Array.isArray(rewards)) {
            for (let reward of rewards) {
                await RewardModelValidator.validate(reward);
            }
        } else {
            await RewardModelValidator.validate(rewards);
        }
    } catch (validationError) {
        console.error(validationError);
        throw validationError;
    }
}

/**
 * Get paginationized rewards from backend.
 * 
 * There are 2 ways of getting rewards from backend.
 * One is to use access_token given when logged in.
 * Another one is to use API_PRIVATE_KEY as a token.
 * As we send access_token by default in baseApi, we follow first one.
 * 
 * @param {string} email Email that owns NFTs to check validation
 * @param {number} page Page Number starting from 0
 * @param {number} pageSize Page Size. default is 15.
 * @returns An array of rewards
 */
export const getRewardsFromEmail = async (email, page = 0, size = 15) => {
    try {
        const response = await apiGet({
            url: '/reward/valid',
            queryParams: { email, page, size },
        });

        await rewardValidate(response.data);

        return response;
    } catch (error) {
        console.error('[Error] getRewardsFromEmail Failed.', error);
        throw error;
    }
};