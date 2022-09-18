import { useEffect, useState } from "react"
import { ButtonGroup, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, InputGroup, List, Offcanvas, OffcanvasBody, OffcanvasHeader, Row, UncontrolledDropdown } from "reactstrap"
import { Icon, IconName } from "../components/icon/icon"
import { Button, ButtonProps } from "../components/button"
import { InfoDrag, Key, Tree, TreeDataType } from "../components/tree/tree"
import { AutoRender, IRenderComponent, RenderComponents, RenderElement, RenderMethod } from "./autorender"
import { Confirm, useModal } from "../modal/modal"
import { Input } from "../components/input"
import { useForm } from "../form"
import _ from "lodash"
import { ActionsProps, IDataTableRef } from "../components/datatable"

interface RenderElementTree extends RenderElement, TreeDataType {
    key: string
    title: string
    children: RenderElementTree[]
}

interface dState {
    TreeData: RenderElementTree[]
    RenderComponents: Record<string, IRenderComponent>,
    RenderComponentKeys: string[],
    expandedKeys: Key[],
    SelectedObject?: RenderElementTree,
    SelectedLeft?: any,
    index: number,
    PropertiesRenderElement?: RenderElement,
    PropertiesRenderElementLeft?: RenderElement
}



export const DesignerPage = () => {

    let Modal = useModal();
    let Form = useForm();
    let [autoRender, setAutoRender] = useState<RenderMethod>();
    let [autoRender2, setAutoRender2] = useState<RenderMethod>();
    let [autoRenderView, setAutoRenderView] = useState<RenderMethod>();

    const [state] = useState<dState>({
        TreeData: [{ "key": "Screen0", "title": "scr1", "objectName": "scr1", "objectType": "Screen", "props": { "screencode": "SCR1", "alert": true, "spacer": false, "responsiveSize": {}, "responsive": { "xs": 12, "sm": 12, "md": 12, "lg": 12, "xl": 12 } }, "children": [{ "key": "Form0", "title": "Form1", "objectName": "Form1", "objectType": "Form", "props": { "name": "Form 1", "alert": false, "spacer": false }, "children": [{ "key": "TabMain0", "title": "tbl1", "objectName": "tbl1", "objectType": "TabMain", "props": { "id": "Tab1", "SelectTabId": "Tab1", "isWizard": false, "isVertical": false, "hidden": false, "disabled": false, "spacer": false }, "children": [{ "key": "TabPanel1", "title": "tbl2", "objectName": "tbl2", "objectType": "TabPanel", "props": { "id": "Tab1", "name": "Tab1", "hidden": false, "disabled": false, "responsiveSize": {} }, "children": [{ "key": "Input1", "title": "Input1", "objectName": "Input1", "objectType": "DataTable", "props": { "id": "Int1", "spacer": false, "label": "label ", "placeholder": "label ", "hidden": false }, "children": [] }] }, { "key": "TabPanel2", "title": "tbl3", "objectName": "tbl3", "objectType": "TabPanel", "props": { "id": "Tab12", "name": "2Tab1", "hidden": false, "disabled": false, "spacer": false }, "children": [{ "key": "Input0", "title": "Input2", "objectName": "Input2", "objectType": "Radio", "props": { "returntype": "object", "options": [{ "value": "1", "label": "1" }, { "value": "2", "label": "2" }], "id": "Label2", "label": "Label 2", "placeholder": "Label 2", "hidden": false, "disabled": false, "spacer": false }, "children": [] }] }] }] }] }],
        RenderComponents: RenderComponents(),
        RenderComponentKeys: Object.keys(RenderComponents()),
        //SelectedObject: null,
        // PropertiesRenderElement: null,
        expandedKeys: ["Screen0", "Form0", "Input1", "TabMain0", "TabPanel1", "TabPanel2"],
        index: 0
    })

    const [render, SetRender] = useState(false)
    const [offcanvas, setOffcanvas] = useState(false)
    const [offcanvas2, setOffcanvas2] = useState(false)
    const RenderView = () => { SetRender(!render); thatEvent.RenderSampleScreen(); }



    const thatEvent = {
        checkDrag: (info: InfoDrag) => {
            if (info.dropToGap == true)
                return false;

            let node = info.node as RenderElementTree
            if ((state.RenderComponents[node.objectType].isChild ?? false) == false) {
                return false;
            }
            if (info.event.altKey == true) {
                console.log(info);
                let node: RenderElement = JSON.parse(JSON.stringify(info.dragNode));

                const loop = (node: RenderElement[]) => {
                    node.map((t: RenderElement) => {

                        state.index += 1;
                        t.key += state.index.toString();
                        state.expandedKeys.push(t.key as any);
                        //@ts-ignore
                        if (t.children?.length > 0) {
                            loop(t.children as any);
                        }
                    })

                }
                loop([node]);
                info.node.children.push(node);
                setTimeout(() => {
                    RenderView();
                }, 100)
                return false;
            }
            setTimeout(() => {
                thatEvent.RenderSampleScreen();
            }, 100);
            return true;
        },
        AddNew: (name: string, node: RenderElementTree) => {
            state.SelectedObject = node;
            Modal.isOpen(true).then(() => {
                Form.setHiddenData({ Name: name });
            })
        },
        AddNewObject: () => {

            //@ts-ignore
            if (!Form.isValid()) {
                return;
            }
            let name = Form.getHiddenData().Name;
            let ObjectName = Form.getValue().ObjectName;
            Modal.isOpen(false);
            let row = { ...state.RenderComponents[name] };
            let add = false;
            add = (state.TreeData.length == 0 && row.isStart == true);

            let element: RenderElementTree = { key: name + state.index.toString(), title: ObjectName, objectName: ObjectName, objectType: name, props: {}, children: [] };
            state.index += 1;
            if (state.TreeData.length == 0) {
                element.children = [];
                state.TreeData.push(element);

            } else {
                if (state.SelectedObject == null && add == false) {
                    Confirm.ConfirmBoolean("Warning", "If add object before select object tree", "Ok");
                } else {
                    state.SelectedObject.children.push(element);
                }
            }
            state.expandedKeys.push(element.key)
            RenderView();
        },
        PropertiesOpenPanel: (status?: boolean) => {
            setOffcanvas(status);
        },
        PropertiesOpenPanel2: (status?: boolean) => {
            setOffcanvas2(status);
        },
        getProtertiesToFormData: (data: any, FormName: string[]) => {
            let RetData: any = {}
            const loop = (dataVal: any, key: string) => {
                if (dataVal == null)
                    return;
                let keys = Object.keys(dataVal);
                keys.map(t => {
                    if (t == "children")
                        return;
                    let frm = FormName.filter(x => { return x == (key + t) });
                    if (frm.length > 0) {
                        RetData[frm[0]] = dataVal[t];
                    } else if (typeof dataVal[t] == "object") {
                        loop(dataVal[t], t + ".");
                    }
                })
            }
            loop(data, "");
            return RetData;
        },
        SelectOpen: (status: RenderElementTree) => {
            state.SelectedObject = status;
            if (state.RenderComponents[status.objectType].Properties != null) {

                if (status.objectType == "DataTable") {
                    let dataTable = state.RenderComponents[status.objectType].Properties.RenderElement.filter(t => t.objectName == "columns");
                    if (dataTable != null && dataTable.length > 0) {
                        (dataTable[0].props.actions as ActionsProps[])?.filter(t => t.id == "Settings").map(t => {
                            t.onClick = (row, that) => {
                                thatEvent.SelectOpenLeft(row, that);
                            }
                        });
                    }
                }

                let RenderViews: RenderElement = { objectName: "Form1", objectType: "Form", children: [...state.RenderComponents[status.objectType].Properties.RenderElement], props: { name: "Form1", responsiveSize: { col: 2 } } };

                RenderViews.children.push({ objectName: "Save", objectType: "Button", props: { label: "Save", id: "Save", onClick: () => thatEvent.SaveProperties(false) } as ButtonProps })
                let windowData = window as any;
                windowData.autorender = AutoRender({ RenderData: RenderViews }, false);
                let propsData = (thatEvent.getProtertiesToFormData(state.SelectedObject.props, [...state.RenderComponents[status.objectType].Properties.FormName]));
                setTimeout(() => {
                    let x = windowData.autorender as RenderMethod;
                    x.getForm().setValue(propsData);
                }, 100);
                setAutoRender(windowData.autorender);
                state.PropertiesRenderElement = RenderViews;
                thatEvent.PropertiesOpenPanel(true);
                RenderView();
            }

        },
        Delete: async (status: RenderElementTree) => {

            if (await Confirm.ConfirmBoolean("Warning", "Is Delete Object ?", "Yes", "No") == true) {
                const loop = (data: RenderElement[]) => {

                    for (let index = 0; index < data.length; index++) {
                        let element = data[index];
                        if (element.key == status.key) {
                            data.splice(index, 1);
                        } else if (element.children?.length > 0) {
                            loop(element.children);
                        }
                    }
                }
                loop(state.TreeData);
                RenderView();
            }
        },
        SaveProperties: (isLeft: boolean = false) => {
            debugger
            let windowData = window as any;
            let formName: string[]
            let data: any = null;
            if (isLeft == true) {
                autoRender2 = windowData.autorenderleft;
                data = autoRender2.getForm().getValue();
                formName = [...state.RenderComponents[state.SelectedLeft.columnControllerType.value].Properties.FormName]
            } else {
                autoRender = windowData.autorender;
                data = autoRender.getForm().getValue();
                formName = [...state.RenderComponents[state.SelectedObject.objectType].Properties.FormName]
            }



            let propsCreate: any = {};
            formName.map(t => {
                if (data[t] == null)
                    return;
                let keySub = t.split(/\./gi);
                let propsCreateSub = propsCreate;
                keySub.map((key, index) => {
                    if (propsCreateSub[key] == null) {
                        if (index == keySub.length - 1)
                            propsCreateSub[key] = data[t];
                        else
                            propsCreateSub[key] = {};
                    }
                    propsCreateSub = propsCreateSub[key];
                })
            })
            if (isLeft == true) {
                state.SelectedLeft.columnControllerProps = { ...propsCreate };

                thatEvent.PropertiesOpenPanel2(false);

            } else {
                state.SelectedObject.props = { ...propsCreate };
                if (state.SelectedObject.objectType == "DataTable") {
                    state.SelectedObject.props.data = [[], [], []];
                }
                delete state.SelectedObject.props.children
                thatEvent.RenderSampleScreen();
            }
        },
        RenderSampleScreen: () => {
            if (state.TreeData != null && state.TreeData.length > 0) {
                let windowData = window as any;
                windowData.autorenderView = AutoRender({ RenderData: JSON.parse(JSON.stringify(state.TreeData[0])) }, false);
                setAutoRenderView(windowData.autorenderView);
            }
        },
        SelectOpenLeft: (row: any, that: IDataTableRef) => {
            if (row.columnControllerType == null) {
                Confirm.ConfirmBoolean("Warning", "Component select one type before", "Ok", null, null, "")
                return;
            }
            state.SelectedLeft = row;
            let objectType = row.columnControllerType.value;
            if (state.RenderComponents[objectType].Properties != null) {

                debugger
                let RenderViews: RenderElement = { objectName: "Form1", objectType: "Form", children: [...state.RenderComponents[objectType].Properties.RenderElement.filter(t => t.objectName != "iLayoutTypeProps")], props: { name: "Form1", responsiveSize: { col: 2 } } };

                RenderViews.children.push({ objectName: "Save", objectType: "Button", props: { label: "Save", id: "Save", onClick: () => thatEvent.SaveProperties(true) } as ButtonProps })
                let windowData = window as any;
                windowData.autorenderleft = AutoRender({ RenderData: RenderViews }, false);
                let propsData = (thatEvent.getProtertiesToFormData(state.SelectedLeft.columnControllerProps, [...state.RenderComponents[objectType].Properties.FormName]));
                setTimeout(() => {
                    let x = windowData.autorenderleft as RenderMethod;
                    x.getForm().setValue(propsData);
                }, 100);
                setAutoRender2(windowData.autorenderleft);
                state.PropertiesRenderElementLeft = RenderViews;
                thatEvent.PropertiesOpenPanel2(true);
                RenderView();
            }

        },

    }

    const ObjectAdd = (props: { isMustChild: boolean, node: RenderElementTree }) => {

        return (<UncontrolledDropdown size="sm" setActiveFromChild>
            <DropdownToggle
                caret
            >
                <Icon iconName={IconName.Plus} />
            </DropdownToggle>
            <DropdownMenu >
                {
                    state.RenderComponentKeys.map((t, index) => {
                        if (true == props.isMustChild) {
                            if ((state.RenderComponents[t].isMustChild ?? false) == false) {
                                return null;
                            }
                        }
                        return [(
                            <DropdownItem key={t} onClick={() => thatEvent.AddNew(t, props.node)}>
                                <Icon iconName={IconName.Plus} />  {t}
                            </DropdownItem>
                        ), (<DropdownItem key={t + "dvi"} hidden={index == state.RenderComponentKeys.length - 1 || props.isMustChild} divider />)]
                    })
                }
            </DropdownMenu>
        </UncontrolledDropdown>);
    }
    const titleRenderView = (e: RenderElementTree) => {
        let isChild = state.RenderComponents[e.objectType].isChild ?? false;
        let isProperties = state.RenderComponents[e.objectType].Properties == null;
        return (
            <span>
                <InputGroup size="sm" >
                    <Button hidden={isProperties} isLabelHidden id="" icon={{ iconName: IconName.Settings }} onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); thatEvent.SelectOpen(e); }} />
                    <Button isLabelHidden id="" icon={{ iconName: IconName.Trash2 }} color="danger" onClick={(ev) => { ev.preventDefault(); ev.stopPropagation(); thatEvent.Delete(e); }} />
                    {(isChild == true && (<ObjectAdd isMustChild={false} node={e} />))}
                    <Input id="" defaultValue={e.objectName} onChange={(er, x) => { e.objectName = x; }} />
                </InputGroup>
            </span>
        )
    }



    useEffect(() => {
        thatEvent.RenderSampleScreen();
    }, [])
    return (
        <Card style={{ height: "100vh", minHeight: "100vh" }}>
            <Row>
                <Col md="3" xl="3" xs="3" xxl="3">
                    <Col>
                        <ObjectAdd isMustChild={true} node={null} />
                    </Col>
                    <Col>
                        <Tree
                            style={{ width: "90%" }}
                            showIcon={false}
                            selectable={false}
                            draggable={{ icon: null }}
                            expandedKeys={state.expandedKeys}
                            defaultExpandedKeys={state.expandedKeys}
                            onSelect={(e, info) => { console.log("select", info) }}
                            titleRender={(e) => { return titleRenderView(e as any) }}
                            key={render ? "1" : "0"}
                            data={state.TreeData}
                            oncheckdraganddrop={thatEvent.checkDrag} />
                    </Col>
                </Col>
                <Col md="9" xl="9" xs="9" xxl="9">
                    <Col> <Button id="btnExport" label="Export  Label" onClick={(e) => {
                        debugger;
                        console.log([...state.TreeData]);
                    }} /></Col>
                    <Col>
                        {(autoRenderView != null && (<autoRenderView.View key={render ? "1" : "2"} />))}
                    </Col>
                </Col>
            </Row>
            <Offcanvas key={render ? "1" : "0"}
                isOpen={offcanvas}
                backdrop={false}
                direction="end"
                style={{ width: 800 }}
                scrollable
                fade={false}
                toggle={() => thatEvent.PropertiesOpenPanel(false)}
            >
                <OffcanvasHeader
                    toggle={() => thatEvent.PropertiesOpenPanel(false)}>
                    {state.SelectedObject?.objectName}
                </OffcanvasHeader>
                <OffcanvasBody>
                    {(autoRender != null && (<autoRender.View key={render ? "1" : "2"} />))}
                </OffcanvasBody>
            </Offcanvas>
            <Offcanvas key={render ? "11" : "00"}
                isOpen={offcanvas2}
                backdrop={false}
                direction="start"
                style={{ width: 800 }}
                scrollable
                fade={false}
                toggle={() => thatEvent.PropertiesOpenPanel2(false)}
            >
                <OffcanvasHeader
                    toggle={() => thatEvent.PropertiesOpenPanel2(false)}>
                    {state.SelectedObject?.objectName} - {state.SelectedLeft?.columnName}
                </OffcanvasHeader>
                <OffcanvasBody>
                    {(autoRender2 != null && (<autoRender2.View key={render ? "11" : "22"} />))}
                </OffcanvasBody>
            </Offcanvas>
            <Modal.View header="Object Name" body={() => { return <Form.View name="Form"> <Input id="ObjectName" label="Object Name" onValid={(e) => { return { IsValid: !_.isEmpty(e.getValue()), ValidText: "*" } }} /> <Button id="" label="Save" onClick={thatEvent.AddNewObject} /></Form.View> }} />
        </Card>
    )
}