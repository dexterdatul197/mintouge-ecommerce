import { useState } from "react";
import { RewardApi } from "../services/api";

const useRewards = () => {
    const [isLoading, setLoading] = useState(false);

    const fetchRewards = async (email) => {
        setLoading(true);
        try {
            const rewardsData = await RewardApi.getRewardsFromEmail(email);
            setLoading(false);

            return rewardsData.data;
        } catch (err) {
            console.error(err);
            setLoading(false);
            throw err;
        }
    };

    return {
        isLoading,
        fetchRewards,
    };
};

export default useRewards;
