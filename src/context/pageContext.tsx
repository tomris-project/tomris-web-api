import React from "react"

let pageContext: React.Context<any> = null;



function setData<T>(key: string, value: T) {
    if (pageContext == null) {
        pageContext = React.createContext<any>(Object.create({}));
    }
    React.useContext<any>(pageContext)[key] = value;
}

function getData<T>(key: string): T {
    if (pageContext == null) {
        return null;
    }
    return React.useContext<any>(pageContext)[key];
}

export const PageContext = {
    set: setData,
    get: getData
} 