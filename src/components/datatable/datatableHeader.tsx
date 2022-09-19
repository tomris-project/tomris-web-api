import { useMemo, useRef, useState } from "react"
import { Icon, IconName } from "../icon/icon"
import { ActionsProps, ColumnTypeinSide, InsideEffect, ProcessType } from "./datatable"
import { TableColumn } from "react-data-table-component"
import { ControllerType, WebApi, type IInputRef, type ICheckboxRef, type IInputNumberRef, ISelectRef } from "../../component"
import { IDateRef } from "../date"
import _ from "lodash"
import { Input } from "../input"
import { BaseDate } from "../../utility/BaseDate"
import { ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Label, UncontrolledDropdown, UncontrolledTooltip } from "reactstrap"
import { Checkbox } from "../checkbox"
import { Button } from "../button"

export const ActionsButtons = (act: ActionsProps[], rowData: any, header: boolean, insideEffect: InsideEffect, rowIndex: number) => {

    let actdata = act.filter(t => header == false || t.isColAction === true);

    if (actdata.length > 4) {
        return (
            <UncontrolledDropdown tabIndex={1111} style={{ position: "static" }}>
                <DropdownToggle color="link" size="sm">
                    <Icon iconName={IconName.MoreVertical} color="black" size={16} />
                </DropdownToggle>
                <DropdownMenu tabIndex={9999999999} >
                    {
                        actdata.map((row, index) => {
                            return [
                                (<DropdownItem key={"PropcAct" + index.toString() + "ROW" + rowIndex.toString()} onClick={(e) => {
                                    row.onClick(rowData, insideEffect.that(), header);
                                }}>
                                    <Icon iconName={row.iconName} color="black" /> {row.label}
                                </DropdownItem>
                                ),
                                (<DropdownItem key={"PropcDivAct" + index.toString() + "ROW" + rowIndex.toString()} divider hidden={(index + 1) == act.length} />)]
                        })
                    }
                </DropdownMenu>
            </UncontrolledDropdown>
        )
    } else if (actdata.length > 0) {
        return (
            <ButtonGroup>
                {
                    actdata.map((row, index) => {
                        return [
                            (<Button color="link" isLabelHidden id={"PropcAct" + index.toString() + "ROW" + rowIndex.toString()} icon={{ iconName: row.iconName, color: row.color, size: row.size }} key={"PropcAct" + index.toString() + "ROW" + rowIndex.toString()} onClick={(e) => {
                                row.onClick(rowData, insideEffect.that(), header);
                            }} />
                            ),
                            (<UncontrolledTooltip key={"PropcActTooltip" + index.toString() + "ROW" + rowIndex.toString()} target={"PropcAct" + index.toString() + "ROW" + rowIndex.toString()}>{row.label}</UncontrolledTooltip>)]
                    })
                }
            </ButtonGroup>
        )
    }
    return '-';
}

export const ColumnsDetails = (insideEffect: InsideEffect) => {
    
    let cols: ColumnTypeinSide[] = insideEffect.state.cols;

    let editmode = insideEffect.getProps().editmode ?? "none"
    if (insideEffect.editExcellRef[-1] == null)
        insideEffect.editExcellRef[-1] = {}
 
    let headerCols = cols.filter(t => (t.isHidden ?? false) == false).map((c, index) => {
        c.columnControllerType = c.columnControllerType ?? ControllerType.Input;
        let columnName: string | React.ReactNode = c.columnName;
        if (c.isNotFilter !== true && (insideEffect.getProps().filterType ?? "single") == "multiple") {
            let colObject: React.ReactNode = null

            switch (c.columnControllerType) {
                case ControllerType.Checkbox:

                    //  if (insideEffect.editExcellRef[-1][c.dataKey] == null)
                    //insideEffect.editExcellRef[-1][c.dataKey] = useRef<ICheckboxRef>(null);
                    colObject = <WebApi.Controller.Checkbox //ref={insideEffect.editExcellRef[-1][c.dataKey]} 
                        style={{ marginLeft: insideEffect.getProps().filterTypeLabelExcelModeIsShow == true ? 18 : null }} id={c.columnName} isLabelHidden={insideEffect.getProps().filterTypeLabelExcelModeIsShow !== true}  {...c.columnControllerProps}
                        placeholder={c.columnName}
                        label={insideEffect.getProps().filterTypeLabelExcelModeIsShow === true ? c.columnName : null} indeterminate
                        onChange={(e) => {
                            insideEffect.filterData[c.dataKey] = e
                            insideEffect.RederView();
                        }} />
                    break;
                case ControllerType.Date:
                    //if (insideEffect.editExcellRef[-1][c.dataKey] == null)
                    //insideEffect.editExcellRef[-1][c.dataKey] = useRef<IDateRef>(null);
                    colObject = <WebApi.Controller.Date //ref={insideEffect.editExcellRef[-1][c.dataKey]} 
                        id={c.columnName} mode={"range"} isLabelHidden={insideEffect.getProps().filterTypeLabelExcelModeIsShow !== true}   {...c.columnControllerProps}
                        placeholder={c.columnName}
                        label={insideEffect.getProps().filterTypeLabelExcelModeIsShow == true ? c.columnName : null}
                        onChange={(e, d, i, chancetype, value) => {

                            if (_.isDate(value)) {
                                return;
                            }
                            insideEffect.filterData[c.dataKey] = value
                            insideEffect.RederView();
                        }} />
                    break;
                case ControllerType.Select:
                    colObject =  <WebApi.Controller.Select id={c.columnName}  display="contents" isLabelHidden={insideEffect.getProps().filterTypeLabelExcelModeIsShow !== true}   {...c.columnControllerProps}
                        placeholder={c.columnName} isClearable
                        label={insideEffect.getProps().filterTypeLabelExcelModeIsShow == true ? c.columnName : null}
                        onChange={(e) => {
                            insideEffect.filterData[c.dataKey] = e
                            insideEffect.RederView();
                        }} isMulti />
                    break;
                case ControllerType.InputNumber:

                    // if (insideEffect.editExcellRef[-1][c.dataKey] == null)
                    // insideEffect.editExcellRef[-1][c.dataKey] = useRef<IInputNumberRef>(null);
                    colObject = <WebApi.Controller.InputNumber //ref={insideEffect.editExcellRef[-1][c.dataKey]}
                        mode="range" id={c.columnName} isLabelHidden={insideEffect.getProps().filterTypeLabelExcelModeIsShow !== true}   {...c.columnControllerProps} type="number"
                        placeholder={c.columnName}
                        label={insideEffect.getProps().filterTypeLabelExcelModeIsShow == true ? c.columnName : null} currencyOptions={null}
                        onChange={(e, src, val) => {
                            insideEffect.filterData[c.dataKey] = val; // = insideEffect.editExcellRef[-1][c.dataKey].current.getValue()
                            insideEffect.RederView();
                        }} />
                    break;
                case ControllerType.Input:

                    // if (insideEffect.editExcellRef[-1][c.dataKey] == null)
                    // insideEffect.editExcellRef[-1][c.dataKey] = useRef<IInputRef>(null);
                    colObject = <WebApi.Controller.Input //ref={insideEffect.editExcellRef[-1][c.dataKey]} 
                        id={c.columnName} isLabelHidden={insideEffect.getProps().filterTypeLabelExcelModeIsShow !== true}    {...c.columnControllerProps}
                        placeholder={c.columnName}
                        label={insideEffect.getProps().filterTypeLabelExcelModeIsShow == true ? c.columnName : null}
                        onChange={(e, val) => {

                            insideEffect.filterData[c.dataKey] = val;// insideEffect.editExcellRef[-1][c.dataKey].current.getValue();
                            insideEffect.RederView();
                        }}
                    />
                    break;
            }
            if (c.columnControllerType == ControllerType.Checkbox) {
                columnName = <div key={c.columnName} style={{ textAlign: "center" }}>{colObject}</div>
            } else if (colObject != null) {
                columnName = <div key={c.columnName} onClick={(e) => { e.stopPropagation(); e.preventDefault() }} style={{ textAlign: "center", flex: "1" }}>{colObject}</div>
            }

        } else {
            columnName = <div key={c.columnName} style={{ textAlign: "center", flex: "1" }}>{columnName}</div>
        }

        let col: TableColumn<any> = {
            name: columnName,
            omit: c.isHidden,
            sortable: c.columnControllerType == ControllerType.Checkbox ? false : c.isNotSort != true,
            wrap: true,
            button: c.columnControllerType == ControllerType.Checkbox,
            allowOverflow: true,
            compact: true,
            reorder: false,
            center: c.columnControllerType == ControllerType.Checkbox,
            id: c.dataKey,
            right: c.columnControllerType == ControllerType.InputNumber,
            cell: (row, rw, col, id) => { 
                let rowIndex = insideEffect.getBaseData().findIndex(t => t.GUID == row.GUID);
                // if (c.isNotEdit == true)
                //     return row[c.dataKey];
                let disabled = (c.isNotEdit === true);
                if (insideEffect.editExcellRef[rowIndex] == null) {
                    insideEffect.editExcellRef[rowIndex] = {};
                }

                switch (c.columnControllerType) {
                    case ControllerType.Checkbox:
                        let refCheckbox = useRef<ICheckboxRef>(null);
                        insideEffect.editExcellRef[rowIndex][c.dataKey] = refCheckbox;

                        return <WebApi.Controller.Checkbox disabled={disabled} ref={refCheckbox} id={c.columnName + rowIndex.toString()} isLabelHidden defaultValue={row[c.dataKey] ?? false} {...c.columnControllerProps}
                            onChange={(e) => {
                                insideEffect.EditView(row, c, refCheckbox.current.getValue())
                            }} />
                    case ControllerType.Date:

                        let refDateInput = useRef<IDateRef>(null);
                        insideEffect.editExcellRef[rowIndex][c.dataKey] = refDateInput;
                        return <WebApi.Controller.Date disabled={disabled} ref={refDateInput} id={c.columnName + rowIndex.toString()} isLabelHidden defaultValue={row[c.dataKey]} {...c.columnControllerProps} isHideClearButton={true} onChange={(e) => {
                            //row[c.dataKey] = refDateInput.current.getValue()
                            insideEffect.EditView(row, c, refDateInput.current.getValue())

                        }} />
                    case ControllerType.Select:
                        let refSelect = useRef<ISelectRef>(null);
                        insideEffect.editExcellRef[rowIndex][c.dataKey] = refSelect;
                        return <WebApi.Controller.Select ref={refSelect} disabled={disabled} id={c.columnName + rowIndex.toString()} isLabelHidden defaultValue={row[c.dataKey]} {...c.columnControllerProps}
                            onChange={(e) => { //row[c.dataKey] = e;  
                                insideEffect.EditView(row, c, e)
                            }} />
                    case ControllerType.InputNumber:
                        let refNumbers = useRef<IInputNumberRef>(null);

                        insideEffect.editExcellRef[rowIndex][c.dataKey] = refNumbers;

                        let data = row[c.dataKey];
                        let isNumberOnly = false;
                        if (_.isNumber(data)) {
                            data = { value: row[c.dataKey] };
                            isNumberOnly = true && c.columnControllerProps?.type != "currency";
                        }
                        return <WebApi.Controller.InputNumber disabled={disabled} ref={refNumbers} id={c.columnName + rowIndex.toString()} isLabelHidden defaultValue={data} {...c.columnControllerProps}
                            onChange={(e) => {
                                if (isNumberOnly == true && c.columnControllerProps?.type != "currency") {
                                    // row[c.dataKey] = refNumbers.current.getValue().value;
                                    insideEffect.EditView(row, c, refNumbers.current.getValue().value)
                                    return;
                                }
                                insideEffect.EditView(row, c, refNumbers.current.getValue())
                            }} />
                    case ControllerType.Input:
                    default:
                        if (disabled) {
                            return row[c.dataKey];
                        }
                        let refInput = useRef<IInputRef>(null);
                        insideEffect.editExcellRef[rowIndex][c.dataKey] = refInput;
                        return <WebApi.Controller.Input ref={refInput} id={c.columnName + rowIndex.toString()} isLabelHidden defaultValue={row[c.dataKey]} {...c.columnControllerProps}
                            onChange={(e) => {
                                // row[c.dataKey] = refInput.current.getValue();

                                insideEffect.EditView(row, c, refInput.current.getValue())
                            }}
                        />
                }
            }
        }

        if (editmode != "excel") {
            col.cell = (row, rowIndex) => {

                switch (c.columnControllerType) {
                    case ControllerType.Date:
                        return BaseDate.ViewText(row[c.dataKey], (c.columnControllerProps?.type) ?? "date");
                    case ControllerType.InputNumber:
                        return row[c.dataKey] == null ? "" : (_.isNumber(row[c.dataKey]) ? row[c.dataKey] : (row[c.dataKey].value + " " + row[c.dataKey].currency))
                    case ControllerType.Checkbox:
                        if (row[c.dataKey] == true)
                            return <Icon iconName={IconName.Check} />
                        return '';
                }
                //c.columnControllerType == ControllerType.Date ? BaseDate.ViewText(row[c.dataKey], (c.columnControllerProps?.type) ?? "date") : 


                return row[c.dataKey]?.toString();
            }
        }


        return col;
    })

    insideEffect.state.colsView = headerCols as TableColumn<any>[];

    let actions: ActionsProps[] = null
    if (insideEffect.getProps()?.actions != null) {
        actions = [...insideEffect.getProps()?.actions];
    }
    if (actions == null)
        actions = [];

    if (insideEffect.getProps()?.editmode == "modal") {
        actions.push({
            iconName: IconName.Edit, isColAction: false, label: "Edit", onClick: (row, that) => {
                insideEffect.EditInsertModal(row, ProcessType.Update);
            }
        })
    } 
    if (insideEffect.getProps().isNotDelete!==true && (insideEffect.getProps()?.editmode == "excel" || insideEffect.getProps()?.editmode == "modal")) {
        actions.push({
            iconName: IconName.Trash2, isColAction: false, label: "Delete", onClick: (row, that) => {
                insideEffect.DeleteExp((e)=> e.GUID== row.GUID);
            }
        })
    }
    if (actions.length > 0) {




        let col: TableColumn<any> = {
            name: ActionsButtons(actions, null, true, insideEffect, -1),
            sortable: false,
            wrap: true,
            button: true,
            allowOverflow: true,
            compact: true,
            reorder: false,
            center: true,
            id: "Actions",
            cell: (row, rowIndex, col, id) => {
                return ActionsButtons(actions, row, false, insideEffect, rowIndex);
            }
        }

        insideEffect.state.colsView = [col, ...insideEffect.state.colsView];


    }
    return insideEffect.state.colsView;
}


export const ColumnsDetailsHides = (insideEffect: InsideEffect) => {


    let cols: ColumnTypeinSide[] = insideEffect.state.cols;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [render, setRender] = useState(false);
    const [filter, setFilter] = useState("");
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    let filtCol = cols.filter(t => t.columnName.toLowerCase().includes(filter));
    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} hidden={cols.length < 6} >
            <DropdownToggle caret>#</DropdownToggle>
            <DropdownMenu>
                <DropdownItem header style={{ margin: 0, padding: 10 }}>
                    <Input id="search" isLabelHidden placeholder="Search" defaultValue={filter} onChange={(e) => { setFilter(e.target.value?.toLowerCase() ?? ""); }} />
                </DropdownItem>
                <DropdownItem divider />
                {
                    filtCol
                        .map(t => {
                            return (<div key={t.dataKey + (render ? "1" : "2")} >
                                <DropdownItem text style={{ display: "flex", flex: 1 }}>
                                    <Label style={{ flex: 1, display: "flex", alignItems: "center", textAlign: "center" }}
                                        onClick={() => {
                                            t.isHidden = !(t.isHidden ?? false);
                                            setRender(!render);
                                        }}>
                                        <Checkbox isLabelHidden id={t.dataKey} defaultValue={t.isHidden !== true} /> <span style={{ display: "flex" }}>&nbsp;&nbsp; {t.columnName} </span>
                                    </Label>
                                </DropdownItem>
                                <DropdownItem divider />
                            </div>)
                        })
                }
            </DropdownMenu>
        </Dropdown>
    );
}


export const SingleFilter = (insideEffect: InsideEffect) => {

    if ((insideEffect.getProps().filterType ?? "single") == "multiple") {
        return null;
    }
    const input = useRef<IInputRef>(null);
    const subHeaderComponentMemo = useMemo(() => {
        return (
            <Input id="FilterSingle" placeholder="Ara" isLabelHidden ref={input} onChange={() => { insideEffect.filterData["**"] = input.current.getValue(); insideEffect.RederView(); }} />
        );
    }, []);
    return subHeaderComponentMemo;
}