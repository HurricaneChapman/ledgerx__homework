import React, { PureComponent} from 'react';
import scss from './ContractsByDate.module.scss';
import ContractDateHeader from '../ContractDateHeader/ContractDateHeader';
import ContractSortHeader from '../ContractSortHeader/ContractsSortHeader';
import ContractRow from "../ContractRow/ContractRow";
import {contractRow, contractsByDate, booktop} from "../../types";

type Props = {
    contracts: contractsByDate,
    booktops: Record<number, booktop>
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
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
            for (let i = 0; i < that.dateCoords.length; i++) {
                if (scrollTop === that.dateCoords[i]) {
                    that.setState({displayDate: that.dates[i]});
                    return;
                }

                if (scrollTop > that.dateCoords[i]) {
                    that.setState({displayDate: that.dates[Math.max(i, 0)]});
                }
            }
        }
    }

    renderDateSection(contracts:contractsByDate, booktops:Record<number, booktop>, renderRow:any, getDateHeaderCoords:any, displayDate:string ) {
        return (dateString:string, idx:number): React.ReactNode => {
            const rows = contracts[dateString];
            const keys = Object.keys(rows);

            return (
                <React.Fragment key={dateString}>
                    <ContractDateHeader date={dateString} getCoords={getDateHeaderCoords(idx)} isHidden={dateString === displayDate}/>
                    { keys.map(renderRow(rows, booktops, dateString)) }
                </React.Fragment>
            )
        }
    }

    renderRow(rows:contractRow, booktops: Record<number, booktop>, dateString: string) {
        return (strikeKey: any): React.ReactNode => {
            const row = rows[strikeKey];
            const contracts = [row.call.id, row.put.id];
            const call = booktops[contracts[0]] || null;
            const put = booktops[contracts[1]] || null;

            return <ContractRow key={strikeKey} row={row} strike={strikeKey} call={call} put={put} dateString={dateString} />
        }
    }

    render() {
        const {
            props: {
                className,
                as,
                contracts,
                booktops
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
                        <ContractSortHeader displayDate={displayDate}/>
                    </thead>
                    <tbody className={scss.scrollingBody} onScroll={onTableScroll(this)}>
                        { this.dates.map(renderDateSection(contracts, booktops, renderRow, getDateHeaderCoords(this), displayDate)) }
                    </tbody>
                </table>
            </Container>
        ) : null ;
    }
}

export default ContractsByDate;
