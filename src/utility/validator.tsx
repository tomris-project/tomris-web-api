import _ from "lodash";
import { BaseControllerValueRef, ValidResponse } from "./baseRef";




export interface OnValidProps {

}

export const Validator = {
    ValidCheck: (check: ((thatFnc: BaseControllerValueRef<any, any>) => ValidResponse)[] | ((data: BaseControllerValueRef<any, any>) => ValidResponse), 
    props: BaseControllerValueRef<any, any>, 
    setValid: React.Dispatch<React.SetStateAction<boolean>>, setValidText: React.Dispatch<React.SetStateAction<string>>) => {
        if (check == null) {
            setValid(true);
            setValidText("");
            return { IsValid: true };
        }
        let data: any = check;
        if (!_.isArray(check))
            data = [check];
        if (_.isArray(data)) {
            let fnc = _.toArray(data);
            for (let index = 0; index < fnc.length; index++) {
                let element = (fnc[index] as (props: any) => ValidResponse)(props);
                if (element.IsValid === false) {
                    setValidText(element.ValidText ?? "");
                    setValid(false);
                    return element;
                }
            }
        }
        setValidText("");
        setValid(true);
        return { IsValid: true };
    }
}