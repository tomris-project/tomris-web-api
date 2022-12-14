import React from "react";
export interface IWithController<T, P> extends React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<P>> {
    IsController?: boolean
    SubTypeName?:String
}

export interface IWithScreenController<T, P> extends React.ForwardRefExoticComponent<React.PropsWithoutRef<T> & React.RefAttributes<P>> {
    IsScreenController?: boolean
}
export const WithController = <T, P>(WrappedComponent: React.ComponentType<T>,SubTypeName?:string) => {
    const enhanced: IWithController<T, P> = React.forwardRef<P, T>((props: T, ref: React.ForwardedRef<P>) => {
        return (<WrappedComponent  {...props} ref={ref} />)
    })
    enhanced.IsController = true;
    enhanced.SubTypeName=SubTypeName;
    return enhanced
}

export const WithScreenController = <T, P>(WrappedComponent: React.ComponentType<T>) => {
    const enhanced: IWithScreenController<T, P> = React.forwardRef<P, T>((props: T, ref: React.ForwardedRef<P>) => { 
        return (<WrappedComponent  {...props} ref={ref} />)
    })
    enhanced.IsScreenController = true;
    return enhanced
}


