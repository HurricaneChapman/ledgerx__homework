import React, { Component } from 'react';
import scss from './ContractRow.module.scss';
import { currencyFormat } from "../../helper/formatters";
import {booktop, contractsOfStrike} from "../../types";
import ContractBlock from "../ContractBlock/ContractBlock";

type Props = {
    row: contractsOfStrike,
    strike: number,
    call: booktop,
    put: booktop,
    dateString: string
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;


const defaultProps = {
    className: '' as string
};

class ContractRow extends Component<Props> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                className,
                row,
                strike,
                call,
                put,
                dateString
            },
        } = this;

        const dateISO = new Date(parseInt(dateString, 10)).toISOString(); // to make it slightly more human-readable
        const callBid = call && call.bid;
        const callAsk = call && call.ask;
        const putBid = put && put.bid;
        const putAsk = put && put.ask;

        return (
            <tr className={`${scss.contractRow} ${className}`}>
                <ContractBlock bid={callBid} ask={callAsk} interest={row.call.open_interest} link={`/:${dateISO}/:${strike}/:call/:${row.call.id}`} contractType={'call'}/>
                <td className={scss.strikeCell}>
                    {currencyFormat(strike, 0)}
                </td>
                <ContractBlock bid={putBid} ask={putAsk} interest={row.put.open_interest} link={`/:${dateISO}/:${strike}/:put/:${row.put.id}`} contractType={'put'}/>
            </tr>
        );
    }
}

export default ContractRow;
