import React, {ReactNode} from "react";

export function currencyFormat(amount:number | string | null, decimals: number = 2, $sign:boolean = false, jsx:boolean = false): string | ReactNode | null {
    if (!amount && amount !== 0) {
        return null;
    }

    if (typeof amount === 'string') {
        return amount;
    }

    let i = Math.abs(amount / 100 || 0).toFixed(decimals).toString();
    let d = decimals ? i.slice(0 - (decimals + 1)) : '';
    i = decimals ? i.slice(0, i.length - (decimals + 1)) : i;
    let j = (i.length > 3) ? i.length % 3 : 0;

    const output = `${j ? `${i.substr(0, j)},` : ''}${i.substr(j).replace(/(\d{3})(?=\d)/g, "$1,")}`;
    if (!jsx) {
        return amount !== 0 ? `${amount < 0 ? '-' : '' }${$sign? '$' : ''}${output}${d}` : '–';
    }

    return (
        <>
            {amount < 0 ? '-' : '' }{$sign && <span className={'dolladollabillyall'}>$</span>}{output}{d && <span className={'cents'}>{d}</span>}
        </>
    )
}

export function formatInterest(amount:number) {
    if (amount < 1000) {
        return amount || '–';
    }
    const output = amount > 10000 ? Math.round(amount / 1000) : Math.round(amount / 100) / 10;
    return `${output}k`;
}
