import React, { PureComponent } from 'react';
import scss from './ContractRow.module.scss';
import {booktop, contractsOfStrike} from "../../types";

type Props = {
    row: contractsOfStrike,
    strike: number,
    call: booktop,
    put: booktop
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string
};

class ContractRow extends PureComponent<Props> {
    static defaultProps = defaultProps;

    static currencyFormat(amount:number, decimals: number = 2) {
        if (!amount && amount !== 0) {
            return amount;
        }

        let i = Math.abs(amount / 100 || 0).toFixed(decimals).toString();
        let d = decimals ? i.slice(0 - (decimals + 1)) : '';
        i = decimals ? i.slice(0, i.length - (decimals + 1)) : i;
        let j = (i.length > 3) ? i.length % 3 : 0;

        const output = `${j ? `${i.substr(0, j)},` : ''}${i.substr(j).replace(/(\d{3})(?=\d)/g, "$1,")}${d}`;
        return output || '–';
    }

    static formatInterest(amount:number) {
        if (amount < 1000) {
            return amount || '–';
        }
        const output = amount > 10000 ? Math.round(amount / 1000) : Math.round(amount / 100) / 10;
        return `${output}k`;
    }

    render() {
        const {
            props: {
                className,
                row,
                strike,
                call,
                put
            }
        } = this;

        const $format = ContractRow.currencyFormat;
        const formatOI = ContractRow.formatInterest;
        const callBid = call && call.bid;
        const callAsk = call && call.ask;
        const putBid = put && put.bid;
        const putAsk = put && put.ask;

        return (
            <tr className={`${scss.container} ${className}`}>
                <td className={`open-interest`}>
                    {formatOI(row.call.open_interest)}
                </td>
                <td>
                    {$format(callBid)}
                </td>
                <td>
                    {$format(callAsk)}
                </td>
                <td>
                    {$format(strike, 0)}
                </td>
                <td>
                    {$format(putAsk)}
                </td>
                <td>
                    {$format(putBid)}
                </td>
                <td className={`open-interest`}>
                    {formatOI(row.put.open_interest)}
                </td>
            </tr>
        );
    }
}

export default ContractRow;
