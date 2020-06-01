import React, {PureComponent, ReactNode, ReactText} from 'react';
import {bookHistory, booktop, btcExchange} from "../../types";
import { currencyFormat, formatInterest } from "../../helper/formatters";
import Graph from "../Graph/Graph";

import scss from './ContractDetailPane.module.scss';
import './ContractDetailPane.scss';
import Button from "../Button/Button";
import {History} from "history";

type Props = {
    contractHistory?:bookHistory,
    booktop: booktop,
    openInterest: number,
    date: Date,
    strike: number,
    contractType: string,
    routerHistory: History<History.PoorMansUnknown>
    btcExchange: btcExchange
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM,
    btcExchange: {ask: 900000, bid: 900000}
};

class ContractDetailPane extends PureComponent<Props> {
    static defaultProps = defaultProps;

    componentDidMount(): void {
    }

    renderDatapoint(className:string , label:ReactText, content:ReactText | ReactNode | null, header: keyof React.ReactDOM = 'h2', contentWrapper: keyof React.ReactDOM = 'p'): React.ReactNode {
        const Header: keyof React.ReactDOM = header;
        const ContentWrapper = contentWrapper;
        return (
            <div className={className}>
                <Header className={scss.detailsLabel}>{label}</Header>
                <ContentWrapper className={scss.detailsData}>{content}</ContentWrapper>
            </div>
        )
    }

    calcProfitLoss({btcExchange, contractType, strike, booktop}: {btcExchange: {bid: number, ask: number}, contractType: string, strike: number, booktop:booktop}):number | string {
        if (!btcExchange || !contractType || !strike || !booktop) {
            return '–';
        }

        const midpoint = ((booktop.bid + booktop.ask) / 2);
        const estBtc = ((btcExchange.bid + btcExchange.ask) / 2);

        return contractType === 'call' ? estBtc - (strike + midpoint) : strike - (estBtc + midpoint);
    }

    closeDetails(routerHistory: History<History.PoorMansUnknown>) {
        return () => routerHistory.push('/')
    }

    render() {
        const {
            props: {
                className,
                as,
                booktop,
                date,
                strike,
                contractType,
                openInterest,
                routerHistory,
                btcExchange
            },
            renderDatapoint,
            calcProfitLoss,
            closeDetails,
        } = this;

        const btcMidpoint = ((btcExchange.bid + btcExchange.ask) / 2);
        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.
        const profitLoss = calcProfitLoss(this.props);
        const profitClassName = profitLoss < 0 ? scss.profitCalcLoss : scss.profitCalcGain;
        return (
            <Container className={`${scss.container} ${className} contract-detail`}>
                <Graph contract={this.props.contractHistory} />
                <div className={scss.details}>
                    <header className={scss.detailsHeader}>
                        {renderDatapoint(scss.contractType, 'Contract', `${contractType.substring(0,1).toUpperCase()}${contractType.substring(1)} option`, 'h1')}
                        {renderDatapoint(scss.expiration, 'Option expires', date.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}))}
                    </header>
                    <div className={scss.strikeSection}>
                        {renderDatapoint(scss.strike, 'Strike Price', currencyFormat(strike, 2, true, true))}
                        {renderDatapoint(scss.interest, 'Open interest', formatInterest(openInterest))}
                    </div>
                    {
                        booktop ?
                            <div className={scss.bidAskBox}>
                                {renderDatapoint(scss.ask, 'Asking', currencyFormat(booktop.ask, 2, true, true))}
                                {renderDatapoint(scss.bid, 'Current bid', currencyFormat(booktop.bid, 2, true, true))}
                            </div>
                        :
                            null
                    }
                    <div className={scss.profitLoss}>
                        {renderDatapoint(scss.cbtc, 'Current BTC/USD rate', currencyFormat(btcMidpoint, 2, true, true))}
                        {renderDatapoint(profitClassName, 'Estimated ITM/OTM', currencyFormat(profitLoss, 2, true, true))}
                        <p className={scss.profitDisclaimer}>Estimated ITM/OTM is based on current bid, ask, strike price and BTC value. Values can and will change without notice before contract expiration.</p>
                    </div>
                    <Button wrapperClass={scss.detailsClose} label={'Done'} onClick={closeDetails(routerHistory)} />
                </div>
            </Container>
        );
    }
}

export default ContractDetailPane;
