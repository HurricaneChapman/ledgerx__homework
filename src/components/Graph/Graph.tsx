/// <reference types="react-vis-types" />
import React, {Component, createRef, ReactNode} from 'react';
import {bookHistory} from "../../types";
import Loader from "../Loader/Loader";
import {FlexibleXYPlot, Crosshair, LineMarkSeries, VerticalGridLines, HorizontalGridLines, YAxis, XAxis, DiscreteColorLegend} from 'react-vis';
import scss from './Graph.module.scss';
import './Graph.scss';
import {currencyFormat} from "../../helper/formatters";

type Props = {
    contract: bookHistory | undefined
} & Partial<DefaultProps>

type DefaultProps = Readonly<typeof defaultProps>;

type State = {
    crosshairValues: {
        x: number,
        y: number
    }[]
};

const defaultProps = {
    className: '' as string
};

class Graph extends Component<Props, State> {
    private svgRef = createRef<any>();
    private containerRef = createRef<any>();
    static defaultProps = defaultProps;

    constructor(props:Props) {
        super(props);
        this.state = {
            crosshairValues: []
        };
    }


    componentDidMount(): void {
        window.addEventListener('resize', this.forceGraphUpdate.bind(this));
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.forceGraphUpdate.bind(this));
    }

    formatYTicks(value:string): string {
        return `$${value}`
    }

    formatXTicks(context:Graph) {
        return (value:string) => {
            if (!context.props.contract) {
                return value;
            }
            const {
                contract: {
                    history
                }
            } = context.props;

            const historyArr = history.toArray();
            const { timestamp } = historyArr[parseInt(value) - 1];

            if (!timestamp) {
                return value;
            }

            const date = new Date(timestamp).toLocaleTimeString('en-us');

            return date;
        }
    }

    forceGraphUpdate():void {
        // The library has a known bug in it where it doesn't resize down properly.
        // Bigfixes in the library, I learned after sinking a bunch of time into this project, have stalled,
        // due to Uber moving away from the library. They're working on transitioning to community maintainers.
        // 💩
        // Through my own tinkering, I've figured out how to force it to resize properly by triggering an update to its internal state.
        if (this.svgRef.current && this.containerRef.current) {
            const {clientHeight, clientWidth} = this.containerRef.current;
            const style = window.getComputedStyle(this.containerRef.current);
            const width = clientWidth - (parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) );
            const height = clientHeight - (parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) );
            this.svgRef.current.setState({width, height});
        }
    }

    onNearestX(context:Graph) {
        return (value: any, {innerX, index}: { innerX: string | number | Date, index: number }): void => {
            if (!context.props.contract) {
                return;
            }
            const {
                history
            } = context.props.contract;
            const historyArr = history.toArray();
            const data = historyArr[index];
            this.setState({crosshairValues: [
                    {
                        x: index + 1,
                        y: data.ask
                    },
                    {
                        x: index + 1,
                        y: data.bid
                    },
                    {
                        x: index + 1,
                        y: value['y']
                    }
                ]
            });
        };
    }

    onMouseLeave(context:Graph) {
        return ():void => {
            context.setState({ crosshairValues: [] });
        }
    }

    generateSVG():ReactNode | false {
        const {
            props: {
                contract
            },
            formatYTicks,
            formatXTicks
        } = this;

        if (!contract || contract.history.length < 2) {
            return false
        }

        const paths = this.calcPaths(contract);
        const {floor, ceil} = this.getGraphBounds(contract);
        const {crosshairValues} = this.state;

        return (
            <>
                <DiscreteColorLegend className={'Graph__legend'} items={[{title: 'Ask'}, {title: 'EMA'}, {title: 'Bid'}]} />
                <FlexibleXYPlot className={scss.svg} ref={this.svgRef}>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <YAxis tickFormat={formatYTicks} />
                    <XAxis tickFormat={formatXTicks(this)} tickLabelAngle={-15} />
                    <LineMarkSeries data={paths.ask} yDomain={[floor * .9, ceil * 1.1]} sizeRange={[0,1]} style={{stroke: 'var(--ask-color)'}}/>
                    <LineMarkSeries data={paths.ema} yDomain={[floor * .9, ceil * 1.1]} curve={'curveMonotoneX'} onNearestX={this.onNearestX(this)} sizeRange={[0,1]} style={{stroke: 'var(--ema-color)'}}/>
                    <LineMarkSeries data={paths.bid} yDomain={[floor * .9, ceil * 1.1]} sizeRange={[0,1]} style={{stroke: 'var(--bid-color)'}} />
                    {
                        crosshairValues.length ? <Crosshair values={crosshairValues}>
                            <aside className={'crosshairBody'}>
                                <div className={'crosshairBodyBackground'} />
                                <p>Ask: {currencyFormat(crosshairValues[0].y, 2, true, true)}</p>
                                <p>Bid: {currencyFormat(crosshairValues[1].y, 2, true, true)}</p>
                                <p>EMA: {currencyFormat(crosshairValues[2].y * 100, 2, true, true)}</p>
                            </aside>
                        </Crosshair>
                        : null
                    }
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

    calcPaths(contract:bookHistory): {ask: {x:number, y:number, size: number}[], bid: {x:number, y:number, size: number}[], ema: {x:number, y:number, size: number}[]} {
        const ask = [];
        const bid = [];
        const ema = [];
        const {
            history
        } = contract;
        let idx = 1;
        let x = 0;
        let prevEMA = 0;

        for (let data of history) {
            const emaY = (((data['ask'] + data['bid']) / 200) * (2 / (1 + idx))) + (prevEMA * (1 - (2 / (1 + idx))));
            prevEMA = emaY;
            x += 1;
            idx += 1;
            ema.push({x, y: emaY, size: 1});
            ask.push({x, y: data['ask'] / 100, size: 1});
            bid.push({x, y: data['bid'] / 100, size: 1});
        }

        return {ask, bid, ema};
    }

    render() {
        const {
            props: {
                className,
            },
            containerRef
        } = this;

        return (
            <div className={`${scss.container} ${className}`} ref={containerRef} onMouseLeave={this.onMouseLeave(this)}>
                {this.generateSVG() ||
                    <>
                    <div className={scss.graphLoader}>
                        <Loader/>
                    </div>
                    <p className={scss.loaderMessage}>Graphing will begin when this contract receives new data.</p>
                    </>
                }
            </div>
        );
    }
}

export default Graph;
