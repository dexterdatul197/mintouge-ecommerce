import { apiPost } from './baseApi';

/**
 * Send email using backend service
 * 
 * @param {string} options A stringfied options
 * @returns An API response
 */
export const sendEmail = async (option) => {
    try {
        const response = await apiPost({
            url: '/user/send-email',
            bodyParam: { option },
        });

        return response;
    } catch (error) {
        console.error('[Error] Send Email Failed.', error);
        throw error;
    }
};