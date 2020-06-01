import React, { PureComponent} from 'react';
import scss from './AppFooter.module.scss';

type Props = {

} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'footer' as keyof React.ReactDOM
};

type State = {
}

class AppFooter extends PureComponent<Props, State> {
    static defaultProps = defaultProps;

    render() {
        const {
            props: {
                as,
                className,
                children
            }
        } = this;

        const Container: keyof React.ReactDOM = as || defaultProps.as; // a workaround for a perplexing typescript compile issue where the default prop value isn't being read.

        return (
            <Container className={`${className} ${scss.container}`}>
                <div className={scss.sig}>
                    &copy; Eric Chapman 2020, (917) 982-8331, <a href="mailto:hurricane.chapman@gmail.com">hurricane.chapman@gmail.com</a>
                </div>
                <div>
                    {children}
                </div>
            </Container>
        )
    }
}

export default AppFooter;
