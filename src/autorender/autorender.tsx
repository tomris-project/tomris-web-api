


import { ITabMainProps, ITabMainRef, ITabPanelProps, TabMain, TabPanel, useTab } from "../tab/tab";
import { Button, ButtonProps } from "../components/button";
import { FormRef, iFormProps, useForm } from "../form";
import { iScreenProps, useScreen, type ScreenRef } from "../screen/screen"
import { Input, InputProps } from "../components/input";
import { InputNumber, InputNumberProps } from "../components/numberinput";
import { Radio, Select, SelectProps, RadioProps } from "../components/select";
import { Checkbox, CheckboxProps } from "../components/checkbox";
import { DateView, DateProps } from "../components/date";
import { useDataTable, type IDataTableProps, type UIDataTableRef } from "../components/datatable/datatable";
import { IModalProps, UIModalRef, useModal } from "../modal/modal";
import { Icon, IconProps } from "../components/icon/icon";
import React, { useState } from "react";


export interface IRenderComponent {
    isUse: boolean;
    Component: (prop?: any) => any;
    isChild: boolean;
    UseComponentName: string;
    isMustChild?: boolean
}
export const RenderComponents = (): Record<string, IRenderComponent> => {


    return {
        Screen: { isUse: true, Component: useScreen, isChild: true, UseComponentName: "View", isMustChild: true },
        Form: { isUse: true, Component: useForm, isChild: true, UseComponentName: "View", isMustChild: true },
        TabMain: { isUse: true, Component: useTab, isChild: true, UseComponentName: "View", isMustChild: true },
        DataTable: { isUse: true, Component: useDataTable, isChild: true, UseComponentName: "View", isMustChild: false },
        Modal: { isUse: true, Component: useModal, isChild: false, UseComponentName: "View" },

        Button: { isUse: false, Component: Button, isChild: false, UseComponentName: null },
        TabPanel: { isUse: false, Component: TabPanel, isChild: true, UseComponentName: null, isMustChild: true },
        Input: { isUse: false, Component: Input, isChild: false, UseComponentName: null },
        InputNumber: { isUse: false, Component: InputNumber, isChild: false, UseComponentName: null },
        Select: { isUse: false, Component: Select, isChild: false, UseComponentName: null },
        Radio: { isUse: false, Component: Radio, isChild: false, UseComponentName: null },
        Checkbox: { isUse: false, Component: Checkbox, isChild: false, UseComponentName: null },
        Date: { isUse: false, Component: DateView, isChild: false, UseComponentName: null },
        Icon: { isUse: false, Component: Icon, isChild: false, UseComponentName: "" },
    }

}
export type PropsApi = iScreenProps | iFormProps | ButtonProps | ITabMainProps | ITabPanelProps | InputProps | InputNumberProps | SelectProps | RadioProps | CheckboxProps | DateProps | IDataTableProps | IModalProps | IconProps | any;


export type objectType = string | "Screen" | "Form" | "Button" | "TabMain" | "TabPanel" | "Input" | "InputNumber" | "Select" | "Radio" | "Checkbox" | "Date" | "DataTable" | "Modal" | "Icon" ;
export interface RenderElement {
    objectName: string
    objectType: objectType
    props: PropsApi
    child?: RenderElement[]

}
export interface RenderElementProccess extends RenderElement {
    useEvent: any,
    factor: number
}
export interface RenderProps {
    RenderData: RenderElement
    onChange?: (props: RenderElement, before: RenderElement) => PropsApi
}

export interface RenderMethod {
    View: () => JSX.Element
    getControl: <T>(name?: string) => T
    getScreen: (name?: string) => ScreenRef
    getForm: (name?: string) => FormRef
    getTab: (name?: string) => ITabMainRef
    getDataTable: (name?: string) => UIDataTableRef
    getModal: (name?: string) => UIModalRef
}
export const RenderMethod = (useview: RenderElementProccess[], View: () => JSX.Element): RenderMethod => {
    let methods: RenderMethod = {
        View: View,
        getControl: (name?: string) => {
            let x = useview.filter(t => t.objectName == name || (name == null));
            if (x != null && x.length > 0) {
                return x[0].useEvent;
            }
            return null;
        },
        getScreen: (name?: string) => methods.getControl<ScreenRef>(name),
        getForm: (name?: string) => methods.getControl<FormRef>(name),
        getTab: (name?: string) => methods.getControl<ITabMainRef>(name),
        getDataTable: (name?: string) => methods.getControl<UIDataTableRef>(name),
        getModal: (name?: string) => methods.getControl<UIModalRef>(name)
    }
    return methods;
}

export const AutoRender = (props: RenderProps): RenderMethod => {
    
    let comp=RenderComponents();
    let useview: RenderElementProccess[] = []; 
    const Recursive = (element: RenderElementProccess[], factor: number, before: RenderElementProccess) => {

        let jsxElement: any = []
        element.map((t, index) => {
            try { 
                let RenderElementRow = comp[t.objectType]; 
                if (RenderElementRow == null) { 
                    return;
                }
                if (RenderElementRow.isMustChild === true && (t.child == null || t.child.length == 0)) {
                    return;
                }
                let createComponent = null;
                if (props.onChange != null) {
                    t.props = props.onChange(t, before);
                }

                let createElementType = null;
                if (RenderElementRow.isUse == true) {
                    t.useEvent = RenderElementRow.Component();
                    createElementType = t.useEvent.View;
                    t.factor = factor;
                    useview.push(t);

                } else {
                    createElementType = RenderElementRow.Component;
                }
                if (t.props == null) {
                    t.props = {}
                }
                if (t.child != null && t.child.length > 0) {
                    t.props.children = Recursive(t.child as RenderElementProccess[], factor + 1, t);
                }
                t.props.key = t.objectName + "Factor" + factor.toString() + "Index" + index;
                createComponent = React.createElement(createElementType, t.props);
                jsxElement.push(createComponent);
            } catch (e) {
                console.log(e, t);
            }
        })
        return jsxElement;
    }

    let [stateView] = useState( Recursive([{ ...props.RenderData }] as RenderElementProccess[], 0, null));

    const View = () => {

        return <>{stateView}</>
    }

    return useState(RenderMethod(useview, View))[0]
}