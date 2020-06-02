import React, {PureComponent} from 'react';
import scss from './ContractBlock.module.scss';
import { currencyFormat, formatInterest } from "../../helper/formatters";
import {Link} from "react-router-dom";

type Props = {
    bid: number,
    ask: number,
    interest: number,
    link: string,
    contractType: 'call' | 'put',
} & Partial<DefaultProps>

type State = {
    hover: boolean
    updating: boolean
}

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    contractType: 'call',
    className: ''
};


class ContractBlock extends PureComponent<Props, State> {
    static defaultProps = defaultProps;
    constructor(props:Props) {
        super(props);
        this.state = {
            hover: false,
            updating: false
        }
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.ask !== this.props.ask || prevProps.bid !== this.props.bid || prevProps.interest !== this.props.interest) {
            this.setState({updating: true});
            setTimeout(() => this.setState({updating: false}), 300);
        }
    }

    handleMouseEnter(context:ContractBlock) {
        return () => {
            context.setState({hover: true})
        }
    }

    handleMouseLeave(context:ContractBlock) {
        return () => {
            context.setState({hover: false})
        }
    }

    render() {
        const {
            props: {
                bid,
                ask,
                interest,
                link,
                contractType,
                className
            },
            state: {
                hover,
                updating
            },
            handleMouseEnter,
            handleMouseLeave
        } = this;

        return (
            <>
                {
                    contractType === 'call' ? <td className={`${className} ${scss.cell} open-interest ${hover ? scss.hover : '' } ${updating ? scss.update : ''}`} onMouseOver={handleMouseEnter(this)} onMouseLeave={handleMouseLeave(this)}>
                        <Link to={link} title={`View ${contractType} contract details`}>
                            {formatInterest(interest)}
                        </Link>
                    </td> : null
                }
                <td className={`${className} ${scss.cell} ${hover ? scss.hover : '' } ${updating ? scss.update : ''}`} onMouseOver={handleMouseEnter(this)} onMouseLeave={handleMouseLeave(this)}>
                    <Link to={link} title={`View ${contractType} contract details`}>
                        {currencyFormat(bid, 2)}
                    </Link>
                </td>
                <td className={`${className} ${scss.cell} ${hover ? scss.hover : '' }  ${updating ? scss.update : ''}`} onMouseOver={handleMouseEnter(this)} onMouseLeave={handleMouseLeave(this)}>
                    <Link to={link} title={`View ${contractType} contract details`}>
                        {currencyFormat(ask, 2)}
                    </Link>
                </td>
                {
                    contractType === 'put' ? <td className={`${className} ${scss.cell} open-interest  ${hover ? scss.hover : '' } ${updating ? scss.update : ''}`} onMouseOver={handleMouseEnter(this)} onMouseLeave={handleMouseLeave(this)}>
                        <Link to={link} title={`View ${contractType} contract details`}>
                            {formatInterest(interest)}
                        </Link>
                    </td> : null
                }
            </>
        );
    }
}

export default ContractBlock;
