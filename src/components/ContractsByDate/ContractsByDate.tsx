import React, { PureComponent } from 'react';
import scss from './ContractsByDate.module.scss';
import ContractDateHeader from '../ContractDateHeader/ContractDateHeader';
import ContractSortHeader from '../ContractSortHeader/ContractsSortHeader';
import ContractRow from "../ContractRow/ContractRow";
import {contractRow, contractsByDate, bookshelf} from "../../types";

type Props = {
    contracts: contractsByDate,
    booktops: bookshelf
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
};

class ContractsByDate extends PureComponent<Props> {
    static defaultProps = defaultProps;

    renderDateSection(contracts:contractsByDate, booktops:bookshelf, renderRow:any ) {
        return (dateString:string): React.ReactNode => {
            const rows = contracts[dateString];
            const keys = Object.keys(rows);

            return (
                <React.Fragment key={dateString}>
                    <tr>
                        <ContractDateHeader date={dateString}/>
                    </tr>
                    { keys.map(renderRow(rows, booktops)) }
                </React.Fragment>
            )
        }
    }

    renderRow(rows:contractRow, booktops: bookshelf) {
        return (strikeKey: any): React.ReactNode => {
            const row = rows[strikeKey];
            const contracts = [row.call.id, row.put.id];
            const call = booktops[contracts[0]]?.head || null;
            const put = booktops[contracts[1]]?.head || null;

            return <ContractRow key={strikeKey} row={row} strike={strikeKey} call={call} put={put} />
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
            renderDateSection,
            renderRow
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.
        const dates = Object.keys(contracts).sort((a:any, b:any) => a - b);

        return contracts ? (
            <Container className={`${scss.container} ${className}`}>
                <ContractSortHeader/>
                <table className={scss.contractTable}>
                    <thead>
                        <tr>

                        </tr>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className={scss.scrollingBody}>
                        { dates.map(renderDateSection(contracts, booktops, renderRow)) }
                    </tbody>
                </table>
            </Container>
        ) : null ;
    }
}

export default ContractsByDate;
