import { FormRef } from "../form"


export enum ControllerType {
    Input = 1,
    Select = 2,
    Checkbox = 3,
    Date = 4,
    Number = 5,
    DataTable = 10
}

export enum ControllerClassType {
    Input = 1,
    Action = 2
}

export enum ScreenControllerType {
    Form = 1,
    DataTable = 2,
    Modal = 3
}


export interface ValidResponse {
    IsValid: boolean
    ValidText?: string
}
/**
 * T= > Element Ref
 * P=> Props
 */
export interface BaseProps<T, P> {
    id: string
    controller?: FormRef
    notvisible?: boolean
    blocking?: boolean    
    onValid?: ((thatFnc: BaseControllerValueRef<T, P>) => ValidResponse)[]  | ((data: BaseControllerValueRef<T, P>) => ValidResponse)


}

export interface BaseControllerActionRef<T> {
    isHide: () => boolean
    setHide: (val?: boolean) => void
    // isNotVisible: () => boolean
    // setNotVisible: (val: boolean) => void
    isDisable: () => boolean
    setDisable: (val?: boolean) => void
    isBlock: () => boolean
    setBlock: (val?: boolean) => void
    getProps: () => BaseProps<T, BaseControllerActionRef<T>> //  BaseProps<T,BaseControllerActionRef<T> >
    controllerClass: ControllerClassType
    type: ControllerType
}

export interface BaseControllerValueRef<T, P> extends Omit<BaseControllerActionRef<P>, 'isBlock' | 'setBlock' | 'ref'> {
    getValue: () => T
    setValue: (value: T,ext?:any) => boolean
    clear?:()=>void
    isValid?: () => ValidResponse | null
}