const Rank = {
    FLAG: "FLAG", SPY: "SPY", SCOUT: "SCOUT", MINER: "MINER",
    SERGEANT: "SERGEANT", LIEUTENANT: "LIEUTENANT", CAPTAIN: "CAPTAIN", MAJOR: "MAJOR",
    COLONEL: "COLONEL", GENERAL: "GENERAL", MARSHALL: "MARSHALL", BOMB: "BOMB",
    properties: {
        FLAG: {power: 0, symbol: "F", quantity: 1},
        SPY: {power: 1,symbol: "1", quantity: 1},
        SCOUT: {power: 2,symbol: "2", quantity: 8},
        MINER: {power: 3,symbol: "3", quantity: 5},
        SERGEANT: {power: 4,symbol: "4", quantity: 4},
        LIEUTENANT: {power: 5,symbol: "5", quantity: 4},
        CAPTAIN: {power: 6,symbol: "6", quantity: 4},
        MAJOR: {power: 7,symbol: "7", quantity: 3},
        COLONEL: {power: 8,symbol: "8", quantity: 2},
        GENERAL: {power: 9,symbol: "9", quantity: 1},
        MARSHALL: {power: 10,symbol: "10", quantity: 1},
        BOMB: {power: 11,symbol: "B", quantity: 6}
    }
};

export default Rank