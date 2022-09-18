


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
import { ComponentProps } from "./renderproperties";
import { Accordion, AccordionPanel } from "../accordion/accordion";


export interface IRenderProperties {
    RenderElement: RenderElement[]
    FormName: string[]
}

export interface IRenderComponent {
    isUse: boolean;
    isStart: boolean
    Component: (prop?: any) => any;
    isChild: boolean;
    UseComponentName?: string;
    isMustChild?: boolean
    Properties?: IRenderProperties
}
 
export const RenderComponents = (): Record<string, IRenderComponent> => {
    return {



        Screen: { isUse: true, isStart: true, Component: useScreen, isChild: true, UseComponentName: "View", isMustChild: true, Properties: ComponentProps.Screen() },
        Form: { isUse: true, isStart: true, Component: useForm, isChild: true, UseComponentName: "View", isMustChild: true, Properties: ComponentProps.Form() },
        Input: { isUse: false, isStart: false, Component: Input, isChild: false, UseComponentName: "", Properties: ComponentProps.Input() },
        InputNumber: { isUse: false, isStart: false, Component: InputNumber, isChild: false, UseComponentName: "", Properties: ComponentProps.NumberInput() },
        Button: { isUse: false, isStart: false, Component: Button, isChild: false, UseComponentName: "", Properties: ComponentProps.Button() },
        Icon: { isUse: false, isStart: false, Component: Icon, isChild: false, UseComponentName: "", Properties: ComponentProps.Icon() },
        Checkbox: { isUse: false, isStart: false, Component: Checkbox, isChild: false, UseComponentName: "", Properties: ComponentProps.Checkbox() },
        Date: { isUse: false, isStart: false, Component: DateView, isChild: false, UseComponentName: "", Properties: ComponentProps.Date() },
        Select: { isUse: false, isStart: false, Component: Select, isChild: false, UseComponentName: "", Properties: ComponentProps.Select(false) },
        Radio: { isUse: false, isStart: false, Component: Radio, isChild: false, UseComponentName: "", Properties: ComponentProps.Select(true) },

        TabMain: { isUse: true, isStart: true, Component: useTab, isChild: true, UseComponentName: "View", isMustChild: true, Properties: ComponentProps.TabMain() },
        TabPanel: { isUse: false, isStart: false, Component: TabPanel, isChild: true, UseComponentName: "", isMustChild: false, Properties: ComponentProps.TabPanel() },


        Accordion: { isUse: false, isStart: true, Component: Accordion, isChild: true, UseComponentName: "", isMustChild: true, Properties: ComponentProps.Accordion() },
        AccordionPanel: { isUse: false, isStart: false, Component: AccordionPanel, isChild: true, UseComponentName: "", isMustChild: false, Properties: ComponentProps.AccordionPanel() }, 

        DataTable: { isUse: true, isStart: false, Component: useDataTable, isChild: false, UseComponentName: "View", isMustChild: false, Properties: ComponentProps.DataTable()  },
        Modal: { isUse: true, isStart: false, Component: useModal, isChild: false, UseComponentName: "View" } 
    }

}
export type PropsApi = iScreenProps | iFormProps | ButtonProps | ITabMainProps | ITabPanelProps | InputProps | InputNumberProps | SelectProps | RadioProps | CheckboxProps | DateProps | IDataTableProps | IModalProps | IconProps | any;


export type objectType = string | "Screen" | "Form" | "Button" | "TabMain" | "TabPanel" | "Input" | "InputNumber" | "Select" | "Radio" | "Checkbox" | "Date" | "DataTable" | "Modal" | "Icon";
export interface RenderElement {
    key?: string
    objectName: string
    objectType: objectType
    autorenderformname?: string
    props: PropsApi
    children?: RenderElement[]

}
export interface RenderElementProccess extends RenderElement {
    useEvent: any,
    factor: number
}
export interface RenderProps {
    RenderData: RenderElement
    onChange?: (props: RenderElement, before?: RenderElement) => PropsApi
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

export const AutoRender = (props: RenderProps, useStateVar: boolean = true): RenderMethod => {

    let comp = RenderComponents();
    let useview: RenderElementProccess[] = [];
    const Recursive = (element: RenderElementProccess[], factor: number, before?: RenderElementProccess) => {

        let jsxElement: any = []
        element.map((t, index) => {
            try {
                let RenderElementRow = comp[t.objectType];
                if (RenderElementRow == null) {
                    return;
                }
                if (RenderElementRow.isMustChild === true && (t.children == null || t.children.length == 0)) {
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
                if (t.children != null && t.children.length > 0) {
                    t.props.children = Recursive(t.children as RenderElementProccess[], factor + 1, t);
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
    if (useStateVar == true) {

        let [stateView] = useState(Recursive([{ ...props.RenderData }] as RenderElementProccess[], 0));

        const View = () => {

            return <>{stateView}</>
        }
        return useState(RenderMethod(useview, View))[0]
    }
    else {
        const View = () => {
            return <>{Recursive([{ ...props.RenderData }] as RenderElementProccess[], 0)}</>
        }
        return RenderMethod(useview, View)

    }
}