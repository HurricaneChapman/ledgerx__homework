import { LinkedList } from 'linked-list-typescript';

// dictionary object of contracts indexed by unix date
export type contractsByDate = Record<string, contractRow>;

// dictionary object of contracts indexed by strike price
export type contractRow = Record<string, contractsOfStrike>;

// dictionary object of contracts with the same strike price, indexed by type 'call' or 'put'
export type contractsOfStrike = Record<string, contract>;

// dictionary object type containing booktop lists, indexed by contract ID
export type bookshelf = Record<number, bookHistory>;

export type bookHistory = {
    min: number,
    max: number,
    history: LinkedList<booktop>
};

export type contract = {
    active: boolean,
    collateral_asset: string,
    date_exercise: string,
    date_expires: string,
    date_live: string,
    derivative_type: "options_contract",
    id: number
    is_one_day: boolean,
    label: string,
    min_increment: number,
    name: string,
    open_interest: number,
    strike_price: number,
    type: string,
    underlying_asset: string
}

export type booktop = {
    ask: number,
    bid: number,
    contract_id?: number,
    contract_type?: number,
    clock?: number,
    type?: string,
    timestamp?: number
}

export type btcSwaps = Record<number, swapData>;

export type swapData = {
    active: boolean,
    collateral_asset: string,
    date_exercise: string,
    date_expires: string,
    date_live: string,
    derivative_type: "day_ahead_swap",
    id: number,
    is_one_day: boolean,
    label: string,
    min_increment: number,
    name: string,
    open_interest: number,
    underlying_asset: string
};

export type btcExchange = {
    ask: number,
    bid: number
}
