import React, {PureComponent, ReactNode} from 'react';
import ContractDetailPane from "./components/ContractDetailPane/ContractDetailPane";
import ContractsByDate from "./components/ContractsByDate/ContractsByDate";
import {contractsByDate, booktop, bookshelf, btcSwaps, btcExchange} from "./types";
import { LinkedList } from 'linked-list-typescript';
import {Route, Switch, BrowserRouter} from "react-router-dom";
import scss from './App.module.scss';
import './App.scss';
import Loader from "./components/Loader/Loader";
import AppHeader from "./components/AppHeader/AppHeader";
import AppFooter from "./components/AppFooter/AppFooter";
import Button from "./components/Button/Button";

type AppState = {
    contracts: contractsByDate,
    booktops: Record<number, booktop>,
    btcSwaps: btcSwaps,
    contractInit: boolean,
    booktopInit: boolean,
    btcExchange: btcExchange,
    connection: 'healthy' | 'disconnected' | 'connecting' | 'stalled' | 'errors';
};

class App extends PureComponent<{}, AppState> {
    private socket: WebSocket | null = null;
    public bookshelf: bookshelf;
    public contractPromise: Promise<any> | undefined;
    public bookHeadPromise: Promise<any> | undefined;
    private connectionTimer: ReturnType<typeof setTimeout> | null | undefined;

    constructor(props:{}) {
        super(props);
        this.state = {
            contracts: {},
            booktops: {},
            contractInit: false,
            booktopInit: false,
            btcSwaps: {},
            btcExchange: {ask: 0, bid: 0},
            connection: "connecting"
        };

        this.bookshelf = {};
    }

    async componentDidMount(): Promise<void> {
        // Get the data
        const now = new Date().toISOString();
        const contractResponse = await fetch(`/api/contracts?after_ts=${encodeURIComponent(now)}&limit=0`, {method: 'GET'});
        const bookHeadResponse = await fetch('/api/book-tops');
        this.contractPromise = contractResponse.json();
        this.bookHeadPromise = bookHeadResponse.json();
        this.connectWebSocket();
        this.contractPromise.then(
            response => {
                const {contracts, swaps} = App.processInitialData(response.data);
                this.setState({
                    contracts: contracts,
                    btcSwaps: swaps,
                    contractInit: true
                });
            }
        );
        this.bookHeadPromise.then(
            response => {
                this.processBookTops(response.data);
                this.setState({booktopInit: true});
            }
        );
    }

    async connectWebSocket() {
        this.setState({connection: 'connecting'});
        const { host } = window.location;
        if (this.socket) {
            await this.disconnectWebSocket();
        }
        this.socket = new WebSocket(`wss://${host}/api/ws`);
        this.socket.onopen = () => {
            this.setState({connection: "healthy"});
            this.connectionTimer = setTimeout(() => {
                this.setState({connection: 'stalled'});
            }, 60000);
        };

        this.socket.onmessage = (event) => {
            const newBooktop:booktop = JSON.parse(event.data);

            if (newBooktop.type !== 'book_top') {
                return;
            }
            this.processBookTops(newBooktop);

            if (this.state.connection !== 'healthy') {
                this.setState({connection: "healthy"});
            }

            if (this.connectionTimer) {
                clearTimeout(this.connectionTimer);
                this.connectionTimer = setTimeout(() => {
                    this.setState({connection: 'stalled'});
                }, 60000);
            }
        };

        this.socket.onerror = (event) => {
            console.error(event);
            this.setState({connection: "errors"})
        };

        this.socket.onclose = () => {
            this.setState({connection: 'disconnected'});
        };
    }

    async disconnectWebSocket() {
        this.socket && await this.socket.close();
    }

    static processInitialData(response: any[]) {
        const contracts:contractsByDate = {};
        const swaps:btcSwaps = {};
        for (let i = 0; i < response.length; i++) {
            switch (response[i].derivative_type) {
                case 'options_contract':
                    // Safari and its inability to understand date strings require doing this the stupid way.
                    const dateString = response[i].date_exercise.replace('+0000', 'Z').replace(' ', 'T');
                    const date = new Date(dateString).getTime();
                    const strike:number = response[i].strike_price;
                    const type:string = response[i].type;
                    contracts[date] = contracts[date] ? contracts[date] : contracts[date] = {};
                    contracts[date][strike] = contracts[date][strike] ? contracts[date][strike] : contracts[date][strike] = {};
                    const strikeObj = contracts[date][strike];
                    strikeObj[type] = response[i];
                break;
                case 'day_ahead_swap':
                    const id = response[i].id;
                    swaps[id] = response[i];
                break;
                default:
            }
        }
        return {contracts, swaps};
    }

    processBookTops(booktops: booktop[] | booktop): void {
        const newState = Object.assign({}, this.state.booktops);
        let bookArray;
        if (!Array.isArray(booktops)) {
            bookArray = [booktops];
        }
        else {
            bookArray = booktops;
        }
        for (let i = 0; i < bookArray.length; i++) {
            if (bookArray[i].clock === 0 ) {
                continue;
            }
            const {
                contract_id = 0
            } = bookArray[i];

            // check first to see if this booktop refers to a btc swap
            if (this.state.btcSwaps[contract_id]){
                //update BTC prices and continue
                if (this.state.btcSwaps[contract_id].active) {
                    this.setState({btcExchange: {ask: bookArray[i].ask, bid:bookArray[i].bid}});
                }
                continue;
            }

            delete bookArray[i].type;
            delete bookArray[i].contract_type;
            delete bookArray[i].contract_id;
            delete bookArray[i].clock;
            bookArray[i].timestamp = Date.now();

            if (!this.bookshelf[contract_id]) {
                this.bookshelf[contract_id] = {
                    min: Math.min(bookArray[i].bid, bookArray[i].ask),
                    max: Math.max(bookArray[i].bid, bookArray[i].ask),
                    history: new LinkedList<booktop>(bookArray[i])
                };
            }
            else {
                const contract = this.bookshelf[contract_id];
                contract.min = Math.min(contract.min, bookArray[i].bid, bookArray[i].ask);
                contract.max = Math.max(contract.max, bookArray[i].bid, bookArray[i].ask);
                contract.history.append(bookArray[i]);
                if (contract.history.length > 200) {
                    // limit the history to 200 datapoints
                    contract.history.removeHead();
                }
            }

            newState[contract_id] = bookArray[i];
        }

        this.setState({booktops: newState});
    }

    showConnectionStatus():ReactNode {
        const {
            connection
        } = this.state;

        const connectionClass = scss[`connection${connection}`];
        const connectButton = <Button className={scss.connectButton} wrapperClass={scss.connectButtonWrapper} label={'Reconnect'} onClick={this.connectWebSocket.bind(this)}/>;

        return (
            <div className={`${scss.connectionStatus} ${connectionClass}`}>
                <p className={scss.connectionStatusText}>Connection status: <span>{connection}</span>{connection === 'disconnected' ? connectButton : ''}</p>
            </div>
        )
    }

    render() {
        const {
            state: {
                contracts,
                booktops,
                contractInit,
                booktopInit,
                btcExchange
            }
        } = this;
        return (
            <div className={`dark-mode ${scss.mainContainer}`}>
                <BrowserRouter>
                    <AppHeader className={`${scss.appHeader}`} />
                    {
                        contractInit && booktopInit?
                            <ContractsByDate className={scss.contractPanel} contracts={contracts} booktops={booktops} btcExchange={btcExchange}/>
                        :
                            <div className={scss.contractPanel}>
                                <Loader/>
                            </div>
                    }
                    <Switch>
                        <Route path={'/:dateISO/:strikeKey/:contractType/:contractId'}>
                            {({match, history}) => {
                                const contractId = match?.params.contractId.substring(1) || null;
                                const contractType = match?.params.contractType.substring(1) || null;
                                const date = new Date(match?.params.dateISO.substring(1)) || null;
                                const strikeKey = parseInt(match?.params.strikeKey.substring(1)) || null;
                                const booktop = booktops[parseInt(contractId)];

                                return !contractId || !contractType || !date || !strikeKey || !booktop || !this.state.contractInit ?
                                    <div className={scss.detailPanel}>
                                        <Loader/>
                                    </div>
                                    :
                                    <ContractDetailPane
                                        as={'aside'}
                                        booktop={booktop}
                                        contractHistory={ contractId && this.bookshelf[contractId] }
                                        openInterest={contracts[date.getTime()][strikeKey][contractType].open_interest}
                                        date={date}
                                        strike={strikeKey}
                                        contractType={contractType}
                                        routerHistory={history}
                                        btcExchange={btcExchange}
                                    />
                                }}
                        </Route>
                        <Route path={'/'}>
                            <div className={scss.detailPanel} />
                        </Route>
                    </Switch>
                    <AppFooter className={scss.appFooter}>
                        {this.showConnectionStatus()}
                    </AppFooter>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
