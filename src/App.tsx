import React, { PureComponent } from 'react';
import scss from './App.module.scss';
import './App.scss';
import ContractDetailPane from "./components/ContractDetailPane/ContractDetailPane";
import ContractsByDate from "./components/ContractsByDate/ContractsByDate";
import {contractsByDate, contract, booktop, bookshelf} from "./types";
import { LinkedList } from 'linked-list-typescript';

type AppState = {
    contracts: contractsByDate,
    booktops: bookshelf
};

class App extends PureComponent<{}, AppState> {
    constructor(props:{}) {
        super(props);
        this.state = {
            contracts: {},
            booktops: {}
        }
    }

    private socket: WebSocket | null = null;

    async componentDidMount(): Promise<void> {
        // Get the data
        const now = new Date().toISOString();
        // const contractResponse = await fetch(`/api/contracts?after_ts=${encodeURIComponent(now)}&limit=0`, {method: 'GET'});
        // const bookHeadResponse = await fetch('/api/book-tops');
        // const contractPromise = contractResponse.json();
        // const bookHeadPromise = bookHeadResponse.json();
        const { host } = window.location;
        this.socket = new WebSocket(`wss://${host}/api/ws`);
        this.socket.onopen = (event) => {
            console.log(event);
        };
        // contractPromise.then(
        //     response => {
        //         this.setState({contracts: App.processInitialData(response.data)});
        //         bookHeadPromise.then(
        //             response => this.setState({booktops: App.processBookTops(response.data)})
        //         );
        //     }
        // );
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

    static processBookTops(booktops: booktop[]): bookshelf {
        const bookshelf: bookshelf = {};
        for (let i = 0; i < booktops.length; i++) {
            if (booktops[i].clock === 0) {
                continue;
            }

            const {
                contract_id
            } = booktops[i];

            bookshelf[contract_id] = bookshelf[contract_id] ? bookshelf[contract_id] : bookshelf[contract_id] = new LinkedList<booktop>();
            bookshelf[contract_id].prepend(booktops[i]);
        }

        return bookshelf;
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
                <header className={`${scss.appHeader}`}>

                </header>
                <ContractsByDate className={scss.contractPanel} contracts={contracts} booktops={booktops}/>
                <ContractDetailPane className={scss.detailPanel} as={'aside'}/>
            </main>
        );
    }
}

export default App;
