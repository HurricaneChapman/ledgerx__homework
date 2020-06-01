import React, { Component } from 'react';
import { currencyFormat } from "../../helper/formatters";
import scss from './BitcoinPriceRow.module.scss';
import './BitcoinPriceRow.scss';

type Props = {
    btcExchange: {ask: number, bid: number}
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    btcExchange: {bid: 0, ask: 0}
};

class BitcoinPriceRow extends Component<Props> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                className,
                btcExchange: {
                    bid,
                    ask
                }
            }
        } = this;

        return (
            <tr className={`${scss.bitcoinRow} ${className} BitcoinPriceRow`}>
                <td colSpan={7}>
                    <div className={scss.priceContainer}>
                        <span className={scss.text}>Estimated</span><span className={scss.price}>{currencyFormat((bid + ask) / 2, 2, true, true)}</span><span className={scss.text}>BTC price</span>
                    </div>
                </td>
            </tr>
        );
    }
}

export default BitcoinPriceRow;
