import React, { PureComponent } from 'react';
import scss from './ContractDateHeader.module.scss';

type Props = {
    date:string
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'td' as keyof React.ReactDOM
};

class ContractDateHeader extends PureComponent<Props> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                className,
                as,
                date
            },
        } = this;

        const formattedDate = new Date(parseInt(date)).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'});
        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.

        return (
            <Container className={`${scss.container} ${className}`}>
                {formattedDate}
            </Container>
        );
    }
}

export default ContractDateHeader;
