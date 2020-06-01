import React, { PureComponent} from 'react';
import scss from './ContractsByDate.module.scss';
import ContractDateHeader from '../ContractDateHeader/ContractDateHeader';
import ContractHeader from '../ContractHeader/ContractHeader';
import ContractRow from "../ContractRow/ContractRow";
import BitcoinPriceRow from "../BitcoinPriceRow/BitcoinPriceRow";
import {contractRow, contractsByDate, booktop, btcExchange} from "../../types";

type Props = {
    contracts: contractsByDate,
    booktops: Record<number, booktop>,
    btcExchange: btcExchange
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM,
    btcExchange: {ask: 900000, bid: 900000}
};

type State = {
    displayDate: string
}

class ContractsByDate extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            displayDate: ''
        }
    }

    static defaultProps = defaultProps;
    private dateCoords:any[] = [];
    private dates:string[] = [];

    componentDidMount(): void {
        if (this.dates.length) {
            this.setState({displayDate: this.dates[0]});
        }
    }

    getDateHeaderCoords(that:ContractsByDate) {
        return (idx: number) => {
            return (element:HTMLElement): void => {
                if (!element) {
                    return;
                }
                that.dateCoords[idx] = element.offsetTop;
            }
        }
    }

    onTableScroll(that:ContractsByDate) {
        return (event:any) => {
            const scrollTop: number = event.target.scrollTop;
            let dateToDisplay:string = that.dates[0];
            for (let i = 0; i < that.dateCoords.length; i++) {
                if (scrollTop === that.dateCoords[i]) {
                    that.state.displayDate !== that.dates[i] && that.setState({displayDate: that.dates[i]});
                    return;
                }

                if (scrollTop > that.dateCoords[i]) {
                    dateToDisplay = that.dates[Math.max(i, 0)];
                }
            }
            that.setState({displayDate: dateToDisplay});
        }
    }

    renderDateSection(contracts:contractsByDate, booktops:Record<number, booktop>, renderRow:any, getDateHeaderCoords:any, displayDate:string, btcExchange: btcExchange ) {
        return (dateString:string, idx:number): React.ReactNode => {
            const rows = contracts[dateString];
            const keys = Object.keys(rows);
            const hasShownBTC = {value: false};

            return (
                <React.Fragment key={dateString}>
                    <ContractDateHeader date={dateString} getCoords={getDateHeaderCoords(idx)} isHidden={dateString === displayDate}/>
                    { keys.map(renderRow({rows, booktops, dateString, btcExchange, hasShownBTC})) }
                </React.Fragment>
            )
        }
    }

    renderRow({rows, booktops, dateString, btcExchange, hasShownBTC}: {rows:contractRow, booktops: Record<number, booktop>, dateString: string, btcExchange: btcExchange, hasShownBTC:{value:boolean}}) {
        return (strikeKey: string): React.ReactNode => {
            const row = rows[strikeKey];
            const contracts = [row.call.id, row.put.id];
            const call = booktops[contracts[0]] || null;
            const put = booktops[contracts[1]] || null;
            const btcPrice = (btcExchange.ask + btcExchange.bid) / 2;

            if (btcPrice < parseInt(strikeKey) && !hasShownBTC.value) {
                hasShownBTC.value = true;
                return (
                    <React.Fragment key={strikeKey}>
                        <BitcoinPriceRow btcExchange={btcExchange} />
                        <ContractRow row={row} strike={parseInt(strikeKey, 10)} call={call} put={put} dateString={dateString} />
                    </React.Fragment>
                )
            }

            return <ContractRow key={strikeKey} row={row} strike={parseInt(strikeKey, 10)} call={call} put={put} dateString={dateString} />
        }
    }

    render() {
        const {
            props: {
                className,
                as,
                contracts,
                booktops,
                btcExchange
            },
            state: {
                displayDate
            },
            renderDateSection,
            renderRow,
            onTableScroll,
            getDateHeaderCoords
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.
        if (this.dates.length === 0) {
            this.dates = Object.keys(contracts).sort((a:any, b:any) => a - b);
        }

        return contracts ? (
            <Container className={`${scss.container} ${className}`}>
                <table className={scss.contractTable}>
                    <thead className={scss.tableHead}>
                        <ContractHeader displayDate={displayDate}/>
                    </thead>
                    <tbody className={scss.scrollingBody} onScroll={onTableScroll(this)}>
                        {
                            this.dates.map(renderDateSection(contracts, booktops, renderRow, getDateHeaderCoords(this), displayDate, btcExchange))
                        }
                    </tbody>
                </table>
            </Container>
        ) : null ;
    }
}

export default ContractsByDate;
