import React, { Component } from 'react';
import scss from './ContractRow.module.scss';
import { currencyFormat, formatInterest } from "../../helper/formatters";
import {booktop, contractsOfStrike} from "../../types";
import {Link} from "react-router-dom";

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
            }
        } = this;
        const dateISO = new Date(parseInt(dateString)).toISOString(); // to make it slightly more human-readable
        const callBid = call && call.bid;
        const callAsk = call && call.ask;
        const putBid = put && put.bid;
        const putAsk = put && put.ask;

        return (
            <tr className={`${scss.contractRow} ${className}`}>
                <td className={`open-interest`}>
                    <Link to={`/:${dateISO}/:${strike}/:call/:${row.call.id}`} title={'View Call contract details'}>
                        {formatInterest(row.call.open_interest)}
                    </Link>
                </td>
                <td>
                    <Link to={`/:${dateISO}/:${strike}/:call/:${row.call.id}`} title={'View Call contract details'}>
                        {currencyFormat(callAsk)}
                    </Link>
                </td>
                <td>
                    <Link to={`/:${dateISO}/:${strike}/:call/:${row.call.id}`} title={'View Call contract details'}>
                        {currencyFormat(callBid)}
                    </Link>
                </td>
                <td className={scss.strikeCell}>
                    {currencyFormat(strike, 0)}
                </td>
                <td>
                    <Link to={`/:${dateISO}/:${strike}/:put/:${row.put.id}`} title={'View Put contract details'}>
                        {currencyFormat(putBid)}
                    </Link>
                </td>
                <td>
                    <Link to={`/:${dateISO}/:${strike}/:put/:${row.put.id}`} title={'View Put contract details'}>
                        {currencyFormat(putAsk)}
                    </Link>
                </td>
                <td className={`open-interest`}>
                    <Link to={`/:${dateISO}/:${strike}/:put/:${row.put.id}`} title={'View Put contract details'}>
                        {formatInterest(row.put.open_interest)}
                    </Link>
                </td>
            </tr>
        );
    }
}

export default ContractRow;
