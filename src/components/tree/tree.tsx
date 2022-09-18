// import { useRef } from "react";
// import { UncontrolledTreeEnvironment, StaticTreeDataProvider, Tree as TreeView, TreeItem, TreeItemRenderContext, TreeInformation } from "react-complex-tree"
// import { Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
// import { Button } from "../button";

// import { Icon, IconName } from "../icon/icon";

// export const Tree = () => {
//     const items: any = {
//         root: {
//             index: 'root',
//             hasChildren: true,
//             children: ['child1', 'child2'],
//             data: 'Root item',
//         },
//         child1: {
//             index: 'child1',
//             hasChildren: true,
//             children: ['child4'],
//             data: 'Child item 1',
//         },
//         child2: {
//             index: 'child2',
//             hasChildren: true,
//             children: ['child3'],
//             data: 'Child item 2',
//         },
//         child3: {
//             index: 'child3',
//             children: [],
//             data: 'Child item 3',
//         },
//         child4: {
//             index: 'child4',
//             children: [],
//             data: 'Child item 4',
//         },
//     };

//     const tree = useRef<any>(null);
//     const Proccess =(item:any,type:string)=>{

//     }
//     return (
//         <Row>
//             <Col xl="3" md="3" xxl="3" xs="12" lg="2" >

//                 <UncontrolledTreeEnvironment

//                     canDragAndDrop={true}
//                     canReorderItems={true}
//                     // canDropOnItemWithChildren={true}
//                     // canDropOnItemWithoutChildren={true}
//                     //  canDrag={items => { console.log(items); return items[0].index!="child4"}}
//                     canDropAt={(items, target) => { if (target.parentItem == "root") return false; console.log(items, target); return true }}

//                     dataProvider={new StaticTreeDataProvider(items, (item, data) => ({ ...item, data }))}
//                     getItemTitle={item => item.data}
//                     viewState={{}}
//                 >

//                     <TreeView treeId="tree-1" rootItem="root"

//                         renderItemTitle={({ title }) => <span>{title}</span>}
//                         renderItemArrow={({ item, context }) =>
//                             item.hasChildren ? context.isExpanded ? <span><Icon size={24} iconName={"ArrowDown"} color={"black"} /></span> : <span> <Icon size={24} iconName={"ArrowRight"} color={"black"} /> </span> : null
//                         }
//                         renderItem={({ title, arrow, depth, context, children,item }) => (
//                             <li
//                                 {...context.itemContainerWithChildrenProps}
//                                 style={{
//                                     marginTop: 10,
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     alignItems: 'flex-start',
//                                     cursor: "pointer"
//                                 }}
//                             >
//                                 <div style={{ display: "flex", width: "100%" }} {...context.itemContainerWithoutChildrenProps} {...context.interactiveElementProps}>
//                                     {arrow}
//                                     <div style={{ flex: 1 }}>{title}</div>
//                                     <div style={{ float: "right" }} onClick={e => { e.stopPropagation(); e.preventDefault(); }} >
//                                         <UncontrolledDropdown setActiveFromChild    onClick={e => { e.stopPropagation(); e.preventDefault(); }} >
//                                             <DropdownToggle
//                                                 caret  onClick={e => { e.stopPropagation(); e.preventDefault(); }} 
//                                                 className="nav-link"
//                                                 tag="a"
//                                             >
//                                                 #
//                                             </DropdownToggle>
//                                             <DropdownMenu  onClick={e => { e.stopPropagation(); e.preventDefault(); }} >
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                                 <DropdownItem  onClick={(e)=>{e.stopPropagation(); e.preventDefault(); Proccess(item,"Properties") }}>
//                                                     <Icon iconName={IconName.Settings} />  Properties 
//                                                 </DropdownItem>
//                                             </DropdownMenu>
//                                         </UncontrolledDropdown>
//                                     </div>

//                                 </div>
//                                 {children}
//                             </li>
//                         )}
//                         renderTreeContainer={({ children, containerProps }) => <div {...containerProps}>{children}</div>}
//                         renderItemsContainer={({ children, containerProps }) => <ul  {...containerProps} style={{ width: "100%" }}>{children}</ul>}


//                     // renderTreeContainer={(e)=>{ return <div {...e.containerProps}>{e.children} <button key={e.containerProps.key+"BTN"}>BTN</button></div>}}  
//                     />
//                 </UncontrolledTreeEnvironment>
//             </Col>
//             <Col xl="8" md="8" xxl="8">
//                 <div>ss</div>
//             </Col>
//         </Row>
//     );
// }


/* eslint-disable no-console, react/no-access-state-in-setstate */

import TreeView, { type TreeProps as TreePropsBase } from "rc-tree"
import { NodeDragEventParams } from "rc-tree/lib/contextTypes"
import { EventDataNode, BasicDataNode, DataNode } from "rc-tree/lib/interface"
import { useState } from "react";

 

export declare type Key = string | number;
export interface TreeDataType extends BasicDataNode {

}

export type ExpandInfo = {
    node: EventDataNode<TreeDataType>;
    expanded: boolean;
    nativeEvent: MouseEvent;
}
export type InfoDrag = NodeDragEventParams<any> & {
    dragNode: EventDataNode<TreeDataType>;
    dragNodesKeys: Key[];
    dropPosition: number;
    dropToGap: boolean;
}
export interface TreeProps extends Omit<TreePropsBase, "prefixCls"> {
    data: any[]
    oncheckdraganddrop?: (info: InfoDrag) => boolean
}
export const Tree = (props: TreeProps) => {

    let [state] = useState<any>({
        gData: props.data,
        autoExpandParent: true,
    })
    const [render, SetRender] = useState<boolean>(false)

    const RenderView = () => {
        SetRender(!render);
    }


    const onExpand = (expandedKeys: Key[], x: ExpandInfo) => {
        console.log('onExpand', expandedKeys);

        state.expandedKeys = expandedKeys;
        state.autoExpandParent = false;

        props.onExpand?.(expandedKeys, x)
        RenderView();
    };

    const onDrop = (info: InfoDrag) => {
        console.log('drop', info);
        if (props.oncheckdraganddrop?.(info) == false) {
            return;
        }
        // console.log('drop', info);
        const dropKey = info.node.key;
        const dragKey = info.dragNode.key;
        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const loop = (data: any, key: any = null, callback: any = null) => {
            data.forEach((item: any, index: any, arr: any) => {
                if (item.key === key) {
                    callback(item, index, arr);
                    return;
                }
                if (item.children) {
                    loop(item.children, key, callback);
                }
            });
        };
        const data = [...state.gData];

        // Find dragObject
        let dragObj: any = null;
        loop(data, dragKey, (item: any, index: any, arr: any) => {
            arr.splice(index, 1);
            dragObj = item;
        });

        if (dropPosition === 0) {
            // Drop on the content
            loop(data, dropKey, (item: any) => {
                // eslint-disable-next-line no-param-reassign
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            // Drop on the gap (insert before or insert after)
            let ar: any[] = [];
            let i: number = 0;
            loop(data, dropKey, (item: any, index: any, arr: any) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        state.gData = data
        RenderView();
    };





    return (
        <TreeView

        expandedKeys={state.expandedKeys}

        onExpand={onExpand}
        {...props}
            autoExpandParent={state.autoExpandParent}
            draggable={props.draggable ?? {
                icon: '↕️' 
            }}  
            onDrop={onDrop}
            treeData={state.gData} 
            itemHeight={20}
            virtual={true}
        />
    );

}




