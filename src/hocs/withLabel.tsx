import React, { useEffect, useRef, useState } from "react";
import { Label } from "reactstrap";


export interface iLabel {
    label?: string
    hidden?: boolean
    id: string
}
export const WithLabel = <TT extends iLabel, PP>(WrappedComponent: React.ComponentType<TT>, display: boolean = true) => {

    const enhanced = React.forwardRef<PP, TT>(<K extends TT & iLabel, PP>(props: K, ref?: React.ForwardedRef<PP>) => {
        let [hidden, setHidden] = useState(props.hidden ?? false);
        if (ref == null)
            ref = useRef<any>();
        let refs = ref as any;
        /**
         * If That Change Status setHidden state update functions call
         */
        useEffect(() => {
            if (refs.current != null && refs.current.setHide != null) {
                let back = refs.current.setHide;
                refs.current.setHide = (val: boolean = !hidden) => {
                    back(val);
                    hidden=val;
                    setHidden(hidden)
                }
            }
        })
        return (<>
            <Label for={props.id} hidden={hidden || display == false} size="sm">
                {props.label}
            </Label>
            {display == false && (<div style={{ height: '30px' }}></div>)}
            <WrappedComponent  {...props} ref={ref} />
        </>)
    })
    return enhanced
}

