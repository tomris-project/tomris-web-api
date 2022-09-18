import _ from "lodash"
import React, { useState } from "react"
import { AccordionBody, AccordionHeader, AccordionItem, Accordion as AccordionView } from "reactstrap"
import { BaseProps } from "../utility/baseRef"
import { iLayoutTypeProps, View } from "../hocs/withLayout" 



export interface IAccordionPanelProps extends Omit<iLayoutTypeProps, 'spacer' | 'responsive'> {
    children?: React.ReactNode | React.ReactNode[]
    name: string
}
export const AccordionPanel = (props: IAccordionPanelProps) => {
    const propsNew = _.omit({ ...props }, ['tabRef', "responsiveSize"]);
    return (
        <AccordionBody {...propsNew} accordionId={(props as any).id}>
            <View responsiveSize={props.responsiveSize}>{props.children}</View>
        </AccordionBody>)
}

export interface IAccordionProps extends BaseProps<IAccordionProps, null>, iLayoutTypeProps {
    children?: React.ReactNode | React.ReactNode[]
    SelectTabId?:string
}

export const Accordion = (props: IAccordionProps) => { 
    const [open, setOpen] = useState(props.SelectTabId??"0");
    const toggle = (id: string = "") => {
        if (open === id) {
            setOpen("");
        } else {
            setOpen(id);
        }
    };
    const prop: any = { toggle: (e: any) => { } }
    return (
        <>
            <AccordionView open={open} {...prop} className="mt-2" >
                {                    React.Children.map(props.children as any, (child, index) => {
                        if (!React.isValidElement(child))
                            return;
                        let c = child as JSX.Element;
                        let key = index.toString();
                        return (
                            <AccordionItem >
                                <AccordionHeader targetId={key} onClick={() => { toggle(key) }} >
                                    {c.props.name}
                                </AccordionHeader>
                                <AccordionPanel id={key} {...c.props} />
                            </AccordionItem>
                        )
                    })
                }
            </AccordionView>
        </>)
}