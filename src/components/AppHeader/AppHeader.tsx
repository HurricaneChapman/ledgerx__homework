import React, { PureComponent} from 'react';
import scss from './AppHeader.module.scss';
import {Link} from "react-router-dom";

type Props = {

} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'header' as keyof React.ReactDOM
};

type State = {
}

class AppHeader extends PureComponent<Props, State> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                as,
                className
            }
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.

        return (
            <Container className={`${className} ${scss.container}`}>
                <Link className={scss.logoLink} to={'/'}>
                    <picture>
                        <source srcSet={'/LedgerX.png 1x, /LedgerX@2x.png 2x'} media={'(min-width: 768px)'}/>
                        <source srcSet={'/LedgerX.png 1x, /LedgerX@2x.png 2x'} media={'(min-width: 0)'}/>
                        <img className={`${scss.logo} logo`} src="/LedgerX.png" alt="LedgerX"/>
                    </picture>
                </Link>
            </Container>
        )
    }
}

export default AppHeader;
