import _ from "lodash"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import { Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import { WithController } from "../hocs/withController"
import { BaseProps, ControllerClassType } from "../utility/baseRef"
import { iLayoutTypeProps, View } from "../hocs/withLayout"
import { Button } from "../components/button"
import { IconName } from "../components/icon/icon"



export interface ITabPanelProps extends Omit<iLayoutTypeProps, 'spacer' | 'responsive'> {
    children?: React.ReactNode | React.ReactNode[]
    id: string
    name: string
    hidden?: boolean
    index?: number
}
export const TabPanel = (props: ITabPanelProps) => {
    const propsNew = _.omit({ ...props }, ['tabRef',"responsiveSize",'spacer' , 'responsive']);
    return (
        <TabPane {...propsNew} tabId={props.id}>
            <View responsiveSize={props.responsiveSize}>{props.children}</View>
        </TabPane>)
}

export interface ITabMainRef {
    SelectTab: (selectId: string, status?: WinzadStatus) => void
    getSelectedTab: () => string
    hideTab: (TabId?: string, status?: boolean) => void
    getTabProps: (Tab: any) => ITabPanelProps
    getProps: () => ITabMainProps
    before: () => void
    next: () => void
    getIndexTabId: (index: number) => string
    depth: number
}
export interface ITabMainProps extends BaseProps<ITabMainProps, null> {
    children?: React.ReactNode | React.ReactNode[]
    // id?: string
    isVertical?: boolean
    isWizard?: boolean
    SelectTabId?: string
    OnChange?: (tabId: string, status: WinzadStatus) => boolean
    OnWinzadSave?: () => void
    depth?: number
}
export enum WinzadStatus {
    None = 0,
    Before = 1,
    Next = 2,
    Save = 3
}
export const TabMain = WithController(React.forwardRef((props: ITabMainProps, ref?: React.ForwardedRef<ITabMainRef>) => {
    const [render, setRender] = useState(false);

    let [SelectIndex] = useState(0);
    let [TabCount] = useState(0);
    const SelectTabId = (selectId: string, status: WinzadStatus = WinzadStatus.None) => {
        if (props.OnChange != null) {
            if (props.OnChange(selectId, status) == false) {
                return;
            }
        }
        SetTabId(selectId);
        setRender(!render);
    }

    let thatFnc: ITabMainRef = {
        SelectTab: SelectTabId,
        getSelectedTab: () => tabId,
        hideTab: (Tab, status?) => {
            let item = TabMainList[Tab];
            if (item != null) {
                item.hidden = status ?? !(item.hidden ?? false);
                setRender(!render);
            }
        },
        getTabProps: (Tab) => {
            return TabMainList[Tab]
        },
        getProps: () => {
            return props
        },
        getIndexTabId: (tabIndex: number) => {
            let id: string = "";
            let keys = Object.keys(TabMainList)
            for (let index = 0; index < keys.length; index++) {
                if (TabMainList[keys[index]].index == tabIndex) {
                    id = TabMainList[keys[index]].id;
                    return id;
                }
            }
            return null;
        },
        before: () => {
            let changeIndex = SelectIndex - 1;
            if (changeIndex < 0)
                changeIndex = 0;

            winzadChange(thatFnc.getIndexTabId(changeIndex), WinzadStatus.Before);
        },
        next: () => {
            let changeIndex = SelectIndex + 1;
            if (changeIndex > TabCount) {
                changeIndex = TabCount;
                winzadChange(thatFnc.getIndexTabId(changeIndex), WinzadStatus.Save);
            } else {
                winzadChange(thatFnc.getIndexTabId(changeIndex), WinzadStatus.Next);
            }
        },
        depth: props.depth ?? 0
    }
    const winzadChange = (ptabID: string, status: WinzadStatus) => {
        if (props.controller == null) {
            throw "winzad useable only inside form - winzad sadece form icinde kullanilabilir"
        }
        let FirstTabError = ""
        let validstatus: any = true;
        let SendStatus = status;
        if (status != WinzadStatus.Before) {
            let form = props.controller;
            let controls = form.getControllers();
            let vals = Object.values(controls);
            let cnt = vals.filter(t => t.controllerClass == ControllerClassType.Input && (t.event.getProps?.().tabid == tabId || status == WinzadStatus.Save));

            cnt.map(t => {
                let response = t.event?.isValid?.();
                if (response != null && response.IsValid == false) {

                    validstatus = false;
                    if (t.event.getProps?.().tabid == null && FirstTabError == "")
                        FirstTabError = t.event.getProps?.().tabid;
                }
            })
            if (validstatus == false) {
                SendStatus = WinzadStatus.None;
            }
        }
        if (validstatus == true) {
            thatFnc.SelectTab(ptabID, SendStatus);
            if (SendStatus == WinzadStatus.Save)
                props.OnWinzadSave?.();
        }
        else if (FirstTabError != "" && FirstTabError != tabId) {
            thatFnc.SelectTab(FirstTabError, SendStatus);
        }

    }

    let FirstTabId = props.SelectTabId ?? "";
    let [TabMainList] = useState<Record<string, ITabPanelProps>>(Object.create({}));
    const SetTabViewId = (tabCont: { props: { children: React.ReactNode | React.ReactNode[] } }, TabId: string): React.ReactNode | React.ReactNode[] => {
        if (!React.isValidElement(tabCont))
            return null;
        if (tabCont.props != null && React.Children.count(tabCont.props.children) > 0) {
            return React.Children.map(tabCont.props.children, (child, index) => {

                let setCont = false;
                if (!React.isValidElement(child))
                    return null;
                let c: any = child as any;
                let propData = { ...c.props };

                if (c.type != null && c.type.SubTypeName == "TabMain") {
                    debugger
                    propData.depth = thatFnc.depth + 1;
                }
                if (c.type != null && c.props.controller !== null && c.props.controller?.isController?.() == true) {
                    propData.tabid = TabId
                    propData.intab = thatFnc;
                }
                if (propData.children != null) {
                    propData.children = SetTabViewId(c, TabId);
                }
                if (setCont) {
                    propData.ref = c.ref == null ? useRef<any>() : c.ref
                }
                c = React.cloneElement(c, propData);
                return c;
            });
        }
    }
    let tabs = React.Children.map(props.children, (child, index) => {
        if (!React.isValidElement(child))
            return null;
        let tab = child as JSX.Element;
        let panel = tab.props as ITabPanelProps;
        if (FirstTabId == "" && index == 0) FirstTabId = panel.id;
        if (TabMainList[panel.id] == null) {
            TabMainList[panel.id] = { ...tab.props };
        }
        TabMainList[panel.id].index = index;
        if (props.isWizard == true) {
            TabMainList[panel.id].children = SetTabViewId(tab, panel.id);
        }
        TabCount = index;
        return React.cloneElement(tab, { ...TabMainList[panel.id], tabRef: thatFnc });
    })
    const [tabId, SetTabId] = useState(FirstTabId);
    useImperativeHandle(ref, () => (thatFnc));

    return (
        <>
            <div id={props.id} style={{ display: props.isVertical == true ? "flex" : undefined }}>
                <Nav vertical={props.isVertical == true} tabs={props.isVertical !== true} pills={props.isVertical == true}
                    key={render ? "1" : "2"}>
                    {
                        Object.keys(TabMainList).map((key, index) => {
                            let item = TabMainList[key];
                            if (tabId == item.id) {
                                SelectIndex = index;
                            }

                            return (
                                <NavItem key={item.id} hidden={item.hidden}>
                                    <NavLink href="#3" disabled={props.isWizard}
                                        className={tabId == item.id ? "active" : ""}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); SelectTabId(item.id) }}>
                                        {item.name}
                                    </NavLink>
                                </NavItem>)
                        })
                    }
                </Nav>
                <TabContent activeTab={tabId} style={{ flex: props.isVertical == true ? 1 : undefined }}>
                    {tabs}
                </TabContent>
                {props.isWizard == true && thatFnc.depth == 0 && (
                    <div>
                        <Row>
                            <Col >
                                <hr />
                            </Col>
                        </Row>
                        <Row key={render ? "1" : "2"}>
                            <Col >
                                <Button isLabelHidden hidden={SelectIndex == 0} label="Before" icon={{ iconName: IconName.ChevronsLeft }} id="before" onClick={thatFnc.before} />
                            </Col>
                            <Col>
                                <div style={{ float: "right" }} >
                                    <Button isLabelHidden color={SelectIndex < TabCount ? "primary" : "success"} label={SelectIndex < TabCount ? "Next" : "Finish"} iconPosition="right" icon={{ iconName: SelectIndex < TabCount ? IconName.ChevronsRight : IconName.Save }} id="next" onClick={thatFnc.next} />
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
        </>)
}), "TabMain")

export interface IUTabMainRef extends ITabMainRef {
    View: (props: ITabMainProps, ref?: React.ForwardedRef<ITabMainRef>) => JSX.Element
}
export const useTab = () => {

    let ref = useRef<ITabMainRef>(null);
    const enhanced = WithController(React.forwardRef((props: ITabMainProps, refs?: React.ForwardedRef<ITabMainRef>) => {
        if (refs != null)
            useEffect(() => {
                ref = refs as any
            }, [refs])
        else
            refs = ref;
        return <TabMain {...props} ref={refs} />
    }), "TabMain")

    let uref: IUTabMainRef = Object.create({});

    useEffect(() => {
        if (ref.current != null) {
            let keys = Object.keys(ref.current)
            for (let index = 0; index < keys.length; index++) {
                (uref as any)[keys[index]] = (ref.current as any)[keys[index]];
            }
        }

    }, [ref]);

    uref.View = enhanced;
    return useState(uref)[0]
}