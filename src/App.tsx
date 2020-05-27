import React, { PureComponent } from 'react';
import scss from './App.module.scss';
import './App.scss';
import ContractDetailPane from "./components/ContractDetailPane/ContractDetailPane";
import ContractsByDate from "./components/ContractsByDate/ContractsByDate";
import {contractsByDate, contract, booktop, bookshelf} from "./types";
import { LinkedList } from 'linked-list-typescript';
import {Route, Switch, BrowserRouter} from "react-router-dom";

type AppState = {
    contracts: contractsByDate,
    booktops: Record<number, booktop>,
    contractInit: boolean,
    booktopInit: boolean
};

class App extends PureComponent<{}, AppState> {
    private socket: WebSocket | null = null;
    public bookshelf: bookshelf;
    public contractPromise: Promise<any> | undefined;
    public bookHeadPromise: Promise<any> | undefined;

    constructor(props:{}) {
        super(props);
        this.state = {
            contracts: {},
            booktops: {},
            contractInit: false,
            booktopInit: false
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
        const { host } = window.location;
        this.socket = new WebSocket(`wss://${host}/api/ws`);
        this.socket.onopen = (event) => {
            console.log('CONNECTED', event);
        };
        this.socket.onmessage = (event) => {
            const newBooktop:booktop = JSON.parse(event.data);
            if (newBooktop.type !== 'book_top') {
                return;
            }
            this.processBookTops(newBooktop);
        };
        this.socket.onerror = (event) => {
            console.error(event);
        };
        this.socket.onclose = (event) => {
            console.log('DISCONNECTED', event)
        };
        this.contractPromise.then(
            response => {
                this.setState({
                    contracts: App.processInitialData(response.data),
                    contractInit: true
                });
            }
        );
        this.bookHeadPromise.then(
            response => {
                this.processBookTops(response.data)
                this.setState({booktopInit: true});
            }
        );
    }

    static processInitialData(response: contract[]):contractsByDate {
        const data:contractsByDate = {};
        for (let i = 0; i < response.length; i++) {
            if (response[i].derivative_type !== 'options_contract') {
                // we only care about options contracts
                continue;
            }
            const date:number = new Date(response[i].date_exercise).getTime();
            const strike:number = response[i].strike_price;
            const type:string = response[i].type;
            data[date] = data[date] ? data[date] : data[date] = {};
            data[date][strike] = data[date][strike] ? data[date][strike] : data[date][strike] = {};
            const strikeObj = data[date][strike];
            strikeObj[type] = response[i];
        }
        return data;
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
            if (bookArray[i].clock === 0) {
                continue;
            }

            const {
                contract_id
            } = bookArray[i];

            if (!this.bookshelf[contract_id]) {
                this.bookshelf[contract_id] = new LinkedList<booktop>(bookArray[i]);
            }
            else {
                this.bookshelf[contract_id].prepend(bookArray[i]);
            }

            newState[contract_id] = bookArray[i];
        }

        this.setState({booktops: newState});
    }

    render() {
        const {
            state: {
                contracts,
                booktops
            }
        } = this;
        return (
            <main className={`dark-mode ${scss.mainContainer}`}>
                <BrowserRouter>
                    <header className={`${scss.appHeader}`}>

                    </header>
                    <ContractsByDate className={scss.contractPanel} contracts={contracts} booktops={booktops} />
                    <Switch>
                        <Route path={'/:dateISO/:strikeKey/:contractType/:contractId'}>
                            {({match}) => {
                                // let dateString = match?.params?.dateISO || null;
                                const contractId = match?.params.contractId.substring(1) || null;
                                const contractType = match?.params.contractType.substring(1) || null;
                                const date = new Date(match?.params.dateISO.substring(1)) || null;
                                const strikeKey = parseInt(match?.params.strikeKey.substring(1)) || null;
                                const booktop = booktops[parseInt(contractId)];

                                return !contractId || !contractType || !date || !strikeKey || !booktop || !this.state.contractInit ?
                                    <div className={scss.detailPanel} /> //return loader
                                    :
                                    <ContractDetailPane
                                        className={scss.detailPanel}
                                        as={'aside'}
                                        booktop={booktop}
                                        history={ contractId && this.bookshelf[contractId] }
                                        openInterest={contracts[date.getTime()][strikeKey][contractType].open_interest}
                                        date={date}
                                        strike={strikeKey}
                                        contractType={contractType}
                                    />
                                }}
                        </Route>
                        <Route path={'/'}>
                            <div className={scss.detailPanel} />
                        </Route>
                    </Switch>
                </BrowserRouter>
            </main>
        );
    }
}

export default App;
