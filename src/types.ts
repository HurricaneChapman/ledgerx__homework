import { LinkedList } from 'linked-list-typescript';

// dictionary object of contracts indexed by unix date
export type contractsByDate = Record<string, contractRow>;

// dictionary object of contracts indexed by strike price
export type contractRow = Record<number, contractsOfStrike>;

// dictionary object of contracts with the same strike price, indexed by type 'call' or 'put'
export type contractsOfStrike = Record<string, contract>;

// dictionary object type containing booktop lists, indexed by contract ID
export type bookshelf = Record<string, LinkedList<booktop>>

export type contract = {
    active: boolean,
    collateral_asset: string,
    date_exercise: string,
    date_expires: string,
    date_live: string,
    derivative_type: string,
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
    contract_id: number,
    contract_type: number,
    clock: number,
    type: string
}
