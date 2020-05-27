import React, {createRef, PureComponent} from 'react';
import scss from './ContractDateHeader.module.scss';

type Props = {
    date:string,
    getCoords?:any,
    isHidden?:boolean
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string
};

class ContractDateHeader extends PureComponent<Props> {
    static defaultProps = defaultProps;
    private rowRef = createRef<HTMLTableRowElement>();

    render() {
        const {
            props: {
                className,
                date,
                getCoords,
                isHidden
            },
            rowRef
        } = this;

        const formattedDate = date !== '' ? new Date(parseInt(date)).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}) : '';
        getCoords && getCoords(rowRef.current);

        return formattedDate ? (
            <tr className={`${scss.dateRow} ${className} ${isHidden ? scss.dateRowHidden : ''}`} ref={rowRef}>
                <td className={scss.dateHeader}>
                     {formattedDate}<span className={scss.dateLabel}> Contract date</span>
                </td>
            </tr>
        ) : null;
    }
}

export default ContractDateHeader;
