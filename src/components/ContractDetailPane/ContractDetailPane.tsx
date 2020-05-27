import React, { PureComponent } from 'react';
import scss from './ContractDetailPane.module.scss';
import {LinkedList} from "linked-list-typescript";
import {booktop, contractsByDate} from "../../types";
import { currencyFormat, formatInterest } from "../../helper/formatters";
import D3Graph from "../D3Graph/D3Graph";

type Props = {
    history?:LinkedList<booktop>,
    booktop: booktop,
    openInterest: number,
    date: Date,
    strike: number,
    contractType: string
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
};

class ContractDetailPane extends PureComponent<Props> {
    static defaultProps = defaultProps;

    componentDidMount(): void {

    }

    render() {
        const {
            props: {
                className,
                as,
                booktop,
                date,
                strike,
                contractType
            }
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.

        return (
            <Container className={`${scss.container} ${className}`}>
                <D3Graph history={this.props.history} />
                <div className={scss.details}>
                    <header className={scss.detailsHeader}>
                        <h1>{contractType} option contract</h1>
                        <p>Expires {date.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'})}</p>

                        <h2>Strike Price</h2>
                        <p>${currencyFormat(strike)}</p>
                    </header>

                    {
                        booktop ?
                            <>
                                <h2>Asking</h2>
                                <p>${currencyFormat(booktop.ask)}</p>

                                <h2>Current bid</h2>
                                <p>${currencyFormat(booktop.bid)}</p>
                            </>
                        :
                            null
                    }

                    <h2>Current BTC -> USD</h2>
                    <p>9000.00</p>

                    <h2>Estimated profit/loss vs current exchange rate</h2>
                    <p>-123.00/BTC</p>
                </div>
            </Container>
        );
    }
}

export default ContractDetailPane;
