import React, { PureComponent } from 'react';
import scss from './ContractSortHeader.module.scss';

type Props = {
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
};

class ContractSortHeader extends PureComponent<Props> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                className,
                as,
            }
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.

        return (
            <Container className={`${scss.container} ${className}`}>

            </Container>
        );
    }
}

export default ContractSortHeader;
