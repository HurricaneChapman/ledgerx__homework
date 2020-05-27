import React, { PureComponent } from 'react';
import scss from './D3Graph.module.scss';
import {LinkedList} from "linked-list-typescript";
import {booktop} from "../../types";

type Props = {
    history: LinkedList<booktop> | undefined;
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
};

class D3Graph extends PureComponent<Props> {
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
                (graph)
            </Container>
        );
    }
}

export default D3Graph;
