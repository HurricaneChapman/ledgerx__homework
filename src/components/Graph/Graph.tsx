/// <reference types="react-vis-types" />
import React, {Component, createRef, ReactNode} from 'react';
import {bookHistory, booktop} from "../../types";
import Loader from "../Loader/Loader";
import {FlexibleXYPlot, LineSeries, Crosshair, VerticalGridLines, HorizontalGridLines, YAxis, XAxis, DiscreteColorLegend} from 'react-vis';
import {LinkedList} from "linked-list-typescript";
import scss from './Graph.module.scss';
import './Graph.scss';

type Props = {
    contract: bookHistory | undefined;
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    className: '' as string,
    as: 'div' as keyof React.ReactDOM
};

class Graph extends Component<Props> {
    // private svgRef = createRef<SVGSVGElement>();
    static defaultProps = defaultProps;

    formatTicks(value:string): string{
        return `$${value}`
    }

    generateSVG():ReactNode | false {
        const {
            props: {
                contract
            },
            // svgRef,
            formatTicks
        } = this;

        if (!contract || contract.history.length < 2) {
            return false
        }

        // const width = svgRef.current ? svgRef.current.clientWidth : 1260;
        // const height = svgRef.current ? svgRef.current.clientHeight : 360;
        // const timestamp = Date.now();

        const askPath = this.calcPath(contract, 'ask');
        const bidPath = this.calcPath(contract, 'bid');
        const EMAPath = this.calcEMA(contract);
        const {range, floor, ceil} = this.getGraphBounds(contract);

        return (
            <>
                <DiscreteColorLegend className={'Graph__legend'} items={[{title: 'Ask'}, {title: 'Bid'}, {title: 'EMA'}]} />
                <FlexibleXYPlot className={scss.svg}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <YAxis tickFormat={formatTicks} />
                    <XAxis />
                    <LineSeries data={askPath} yDomain={[floor * .9, ceil * 1.1]} />
                    <LineSeries data={bidPath} yDomain={[floor * .9, ceil * 1.1]} />
                    <LineSeries data={EMAPath} yDomain={[floor * .9, ceil * 1.1]} curve={'curveMonotoneX'} />
                    {/*<Crosshair values={myValues}>*/}
                        {/*<div style={{background: 'black'}}>*/}
                            {/*<h3>Values of crosshair:</h3>*/}
                            {/*<p>Series 1: {myValues[0].x}</p>*/}
                            {/*<p>Series 2: {myValues[1].x}</p>*/}
                        {/*</div>*/}
                    {/*</Crosshair>*/}
                </FlexibleXYPlot>
            </>
        );
    }

    getGraphBounds({max, min}: {max: number, min: number}){
        return {
            range: (max - min) / 100, // whole dollar values
            floor: Math.floor((min / 100) / 50) * 50,
            ceil: Math.ceil((max / 100) / 50) * 50
        }
    }

    calcPath(contract:bookHistory, key:'ask' | 'bid' ):{x:number, y:number}[] {
        const output = [];
        const {
            history
        } = contract;
        let x = 0;

        for (let data of history) {
            const dp = data[key] / 100; // initial datapoint, dollar value. A decimal is unexpected, but acceptable.
            x+=1;
            output.push({x, y: dp});
        }

        return output;
    }

    calcEMA(contract:bookHistory):{x:number, y:number}[] {
        const output = [];
        const {
            history
        } = contract;
        let idx = 1;
        let x = 0;
        let prevY = 0;
        for (let data of history) {
            const y = (((data['ask'] + data['bid']) / 200) * (2 / (1 + idx))) + (prevY * (1 - (2 / (1 + idx))));
            prevY = y;
            x += 1;
            output.push({x, y});
        }

        return output;
    }

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
                {this.generateSVG() || <Loader/>}
            </Container>
        );
    }
}

export default Graph;
