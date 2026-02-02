export interface ProfileStats {
    rating: number;
    participations: number;
    solved: number;
    wins: number;
}

export interface ProfileHistoryItem {
    id: string;
    contestId: string;
    title: string;
    platform: string;
    startTime: Date;
    rank: number;
    ratingDelta: number;
    solved: number;
    isWinner: boolean;
}

export interface ProfileSummary {
    stats: ProfileStats;
    history: ProfileHistoryItem[];
}

export interface AddResultPayload {
    contestId: string;
    rank?: number;
    solved?: number;
    ratingDelta?: number;
    isWinner?: boolean;
}

export interface IProfileService {
    getProfile(userId: string): Promise<ProfileSummary>;
    addResult(userId: string, payload: AddResultPayload): Promise<ProfileSummary>;
}
