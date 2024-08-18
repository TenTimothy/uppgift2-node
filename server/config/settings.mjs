export const MINE_RATE = 1000;
export const INITIAL_BALANCE = 1000;
const INITIAL_DIFFICULTY = 3;


export const GENESIS_DATA = {
    timestamp: 1,
    //timestamp: date.now()
    lastHash: '0',
    hash: '0',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};

export const MINING_REWARD = 50; 

export const REWARD_INPUT = {
    address: '*authorized-reward*', 
};

