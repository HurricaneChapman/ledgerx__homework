import React, { PureComponent } from 'react';
import scss from './ContractHeader.module.scss';
import ContractDateHeader from "../ContractDateHeader/ContractDateHeader";

type Props = {
    displayDate: string
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
};

class ContractHeader extends PureComponent<Props> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                displayDate
            }
        } = this;

        return (
            <>
                <tr className={`${scss.optionTypesRow}`}>
                    <th>
                        Call options
                    </th>
                    <th />
                    <th className={scss.strike}></th>
                    <th>
                        Put options
                    </th>
                    <th />
                </tr>
                <tr className={`${scss.headsRow}`}>
                    <th className={scss.columnHead}>
                        Open interest
                    </th>
                    <th className={scss.columnHead}>
                        Bid
                    </th>
                    <th className={scss.columnHead}>
                        Ask
                    </th>
                    <th className={`${scss.columnHead} ${scss.strike}`}>
                        Strike
                    </th>
                    <th className={scss.columnHead}>
                        Bid
                    </th>
                    <th className={scss.columnHead}>
                        Ask
                    </th>
                    <th className={scss.columnHead}>
                        Open interest
                    </th>
                </tr>
                <ContractDateHeader date={displayDate}/>
            </>
        );
    }
}

export default ContractHeader;
