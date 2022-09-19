import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Row, Col, Table, Card, CardBody, CardHeader, CardFooter, ButtonGroup, InputGroup, Label } from "reactstrap"
import { BaseProps, ControllerType, ScreenControllerType, BaseControllerValueRef, ControllerClassType } from "../../utility/baseRef"
import { ColumnsGetDataDetails, ColumnsGetPage } from "./datatableGetData"
import { ColumnsDetails, ColumnsDetailsHides, SingleFilter } from "./datatableHeader"
import DataTableView, { SortOrder, type TableStyles, createTheme } from "react-data-table-component"
import { type RenderElement, type PropsApi } from "../../component"
import _ from "lodash"
import { BaseDate } from "../../utility/BaseDate"
import { Button } from "../button"
import { ScreenRef } from "../../screen"

import { TableColumn } from "react-data-table-component"
import { iLayoutTypeProps } from "../../hocs/withLayout"
import { WithController, WithScreenController } from "../../hocs/withController"
import { FormRef, iForm } from "../../form"
import { AutoRenderForms } from "./datatableAutoRender"
import { IconName, IconProps } from "../icon/icon"
import { UIModalRef, useModal } from "../../modal/modal"
export interface ColumnType {
    dataKey: string
    columnName: string
    columnIndex?: Number
    columnControllerType?: ControllerType
    columnControllerProps?: PropsApi
    isHidden?: boolean
    isNotEdit?: boolean
    isNotFilter?: boolean
    isNotInsert?: boolean
    isNotSort?: boolean

}
export interface ColumnTypeinSide extends ColumnType {
    ViewMode?: boolean
    ColIconRef?: { up: any, down: any } | any
    Sorted?: "up" | "down"
}

export interface ActionsProps extends IconProps {
    id?: string
    label: string
    onClick: (row: any, that: IDataTableRef, isHeader?: boolean) => void,
    isColAction?: boolean
}
export interface IDataTableProps extends iLayoutTypeProps {
    name: string
    id?: string
    columns: ColumnType[]
    header?: string | React.ReactNode | JSX.Element
    data?: any[]
    isNotPage?: boolean
    isNotDelete?: boolean
    isNotSort?: boolean
    filterType?: "multiple" | "single"
    filterTypeLabelExcelModeIsShow?: boolean
    selectLoadExp?: (row: any) => boolean
    editmode?: "none" | "excel" | "modal"
    currentPage?: number;
    pageSize?: number[];
    pageSizeDefault?: number;
    maxHeight?: number
    testButtons?: boolean
    selectableRows?: boolean
    selectableRowsSingle?: boolean
    selectableRowDisabled?: (row: any) => boolean
    expandableRowDisabled?: (row: any) => boolean
    expandableRowsComponent?: (row: any) => any
    screencontroller?: ScreenRef
    actions?: ActionsProps[]
    onChange?: (row: any, dataKey: string, RowIndex: Number, newvalue: any, OldValue: any) => void
    SearchForm?: {
        /**
         * Search Form Search Button
         */
        event: (form: FormRef, that: IDataTableRef) => void,
        /**
         * Search Form Components
         */
        formComponents?: RenderElement,
        /**
         * Change Render Props
         */
        onChange?: (props: RenderElement, before: RenderElement) => PropsApi
    }
    EditForm?: {
        /**
         * Edit Form Search Button
         */
        event?: (form: FormRef, that: IDataTableRef, data: any) => any,
        /**
         * Edit Form Components
         */
        formComponents?: RenderElement,
        /**
         * Change Render Props
         */
        onChange?: (props: RenderElement, before: RenderElement) => PropsApi
    }
    isformcontroller?: boolean
    controller?: FormRef
    returntype?: "data" | "advance"
}

export interface UIDataTableRef extends IDataTableRef {
    View: (props: IDataTableProps, refs?: React.ForwardedRef<IDataTableRef>) => JSX.Element
}
interface StateFull {
    cols: ColumnTypeinSide[];
    data: any[];
    ViewData: any[];
    filterCount?: number;
    deleteData: any[];
    colsView?: TableColumn<any>[];
    filterData: Record<string, any>;
    editExcellRef: Record<number, any>;
    page: {
        currentPage: number,
        selectPageSize: number
    }
}
export interface DataTableValuesType {
    Selected: any[]
    BaseData: any[]
    SearchForm: any
    Value: {
        Insert: any[],
        Delete: any[],
        Update: any[],
        ViewData: any[],
        ExpandData: any[]
    }
}

export type DataTableValues = DataTableValuesType | any[]
export interface InsideEffect {
    RederView: () => void
    state: StateFull,
    editExcellRef: Record<number, any>
    renderCols: boolean
    filterData: Record<string, any>
    ViewData: any[]
    getProps: () => IDataTableProps,
    getBaseData: () => any[],
    getCopyClearExport: (data: any[]) => any[],
    getValue: () => DataTableValues,
    Add: (newRow: any, addIndex?: number) => void
    EditView: (Row: any, col: ColumnType, val: any) => void
    EditRow: (Row: any, Process: ProcessType) => any
    GetIndexs: (exp: (t: any) => boolean) => number[]
    UpdateCell: (RowIndex: number, dataKey: string, value: any, isRender?: boolean) => void
    UpdateCellExp: (exp: (t: any) => boolean, dataKey: string, value: any) => void
    RowUpdate: (RowIndex: number, row: any, isRender?: boolean) => void
    RowUpdateExp: (exp: (t: any) => boolean, row: any) => void
    Selected: (RowIndex: number, selectVal: boolean, isRender?: boolean) => void
    SelectedExp: (exp: (t: any) => boolean, selectVal: boolean) => void
    Delete: (RowIndex: number, isRender?: boolean) => void
    DeleteExp: (exp: (t: any) => boolean) => void
    getCol: (dataKey: string) => ColumnTypeinSide,
    DataTableViewSelectUser: (selected: { allSelected: boolean, selectedCount: number, selectedRows: any[] }) => void
    that: () => IDataTableRef,
    EditInsertModal: (row: any, type: ProcessType) => void
    editModal: UIModalRef

}
export enum ProcessType {
    None = 1,
    Insert = 2,
    Update = 3,
    Delete = 4,
}
export interface IDataTableRef extends Omit<BaseControllerValueRef<DataTableValues, IDataTableProps>, "type" | "setValue" | "getProps">//extends ScreenControllerAction<IDataTableProps> 
{
    Add: (newRow: any, addIndex?: number) => void

    UpdateCell: (RowIndex: number, dataKey: string, value: any, isRender?: boolean) => void
    UpdateCellExp: (exp: (t: any) => boolean, dataKey: string, value: any, isRender?: boolean) => void
    RowUpdate: (RowIndex: number, row: any, isRender?: boolean) => void
    RowUpdateExp: (exp: (t: any) => boolean, row: any) => void
    Selected: (RowIndex: number, selectVal: boolean, isRender?: boolean) => void
    SelectedExp: (exp: (t: any) => boolean, selectVal: boolean) => void
    Delete: (RowIndex: number, isRender?: boolean) => void
    DeleteExp: (exp: (t: any) => boolean) => void
    getProps: () => IDataTableProps
    getValue: () => DataTableValues
    getSearchForm: () => FormRef
    type: ScreenControllerType | ControllerType
    setValue: (value: []) => boolean
}

export const DataTable = WithController<IDataTableProps, IDataTableRef>(React.forwardRef<IDataTableRef, IDataTableProps>((props: IDataTableProps, ref?: React.ForwardedRef<IDataTableRef>) => {

    if (props.columns == null || props.columns.length == 0) {
        return <>DataTable Designer</>
    }
    let [load, SetLoad] = useState(false)
    let [renderCols, setRenderCols] = useState(false)
    const [toggledClearRows, setToggleClearRows] = useState(false);
    const CleanData = (val: any, c: ColumnType) => {
        switch (c.columnControllerType) {
            case ControllerType.Date:
                if (val == null) {
                    return val;
                }
                if (c.columnControllerProps?.type == "time" && _.isString(val)) {
                    let vald = (val as string)
                    vald = BaseDate.ViewText(vald, "time")
                    return vald
                } else if (_.isString(val)) {
                    return new Date(val);
                }
                break;
            case ControllerType.Checkbox:
                return val == true;
            case ControllerType.InputNumber:
                if (props.editmode != "excel") {
                    if (_.isNumber(val)) {
                        return val;
                    } else if (c.columnControllerProps?.type == "currency") {
                        return val
                    }
                    else {
                        return val?.value;
                    }
                }
                if (_.isNumber(val)) {
                    val = { value: val }
                }
                return val;
        }
        return val;
    }

    const createData = (data: any[], GUIDIndex: number = 0): any[] => {
        let colCheck = props.columns.filter(t => t.columnControllerType == ControllerType.Date || t.columnControllerType == ControllerType.Checkbox || ControllerType.InputNumber);

        let createData = (data != null ? [...data] : []).map((t, index) => {
            t.GUID = index + GUIDIndex;
            colCheck.map(c => {
                t[c.dataKey] = CleanData(t[c.dataKey], c);
            })
            if (t.DATATABLE == null)
                t.DATATABLE = {
                    isSelected: false,
                    isExpand: false,
                    Process: ProcessType.None
                }
            if (load == false) {
                t.DATATABLE.isSelected = props.selectLoadExp?.(t) ?? false;
            }
            return t
        })
        return createData;
    }

    const editModal = useModal();
    let [FullStateData] = useState<StateFull>({
        cols: (
            props.columns
                .map((t: ColumnTypeinSide, Index: number) => {
                    if (t.columnIndex == null) {
                        t.columnIndex = Index
                    }
                    t.columnControllerType = t.columnControllerType ?? ControllerType.Input;
                    if (_.isString(t.columnControllerType)) {
                        t.columnControllerType = ControllerType[t.columnControllerType as any] as any;
                    }
                    t.ViewMode = useState(false)[0]; t.ColIconRef = { up: useRef(null), down: useRef(null) }; return t;
                })
                .sort((a, b) => { return (a.columnIndex > b.columnIndex) ? 0 : -1 })
        ),
        data: createData(props.data ?? []),
        ViewData: [],
        deleteData: [],
        filterData: Object.create({}),
        editExcellRef: Object.create({}),
        page: { currentPage: 1, selectPageSize: 10 }
    })
    const handleClearRows = () => {
        load = true;
        SetLoad(load);
        setToggleClearRows(!toggledClearRows);
    }
    const RederView = () => {
        insideEffect.renderCols = renderCols = !renderCols
        setRenderCols(renderCols);
    }
    const insideEffect: InsideEffect = {
        editModal: editModal,
        EditInsertModal: null,
        that: () => { return thatFnc },
        RederView: RederView,
        state: FullStateData,
        editExcellRef: FullStateData.editExcellRef,
        ViewData: FullStateData.ViewData,
        getBaseData: () => FullStateData.data,
        renderCols: renderCols,
        filterData: FullStateData.filterData,
        getProps: () => props,
        getCopyClearExport: (data: any[]) => {
            let newData: any[] = [];
            let colCheck = props.columns.filter(t => t.columnControllerType == ControllerType.InputNumber || t.columnControllerType == ControllerType.Select);

            data.map(t => {
                let row = { ...t };
                colCheck.map(col => {

                    switch (col.columnControllerType) {
                        case ControllerType.InputNumber:
                            if (col.columnControllerProps == null || col.columnControllerProps?.type == "number") {
                                if (row[col.dataKey] != null && !_.isNumber(row[col.dataKey])) {
                                    row[col.dataKey] = row[col.dataKey].value;
                                }
                            }
                            break;
                        case ControllerType.Select:
                            if (row[col.dataKey] != null && col.columnControllerProps != null) {
                                if (col.columnControllerProps.returntype == "value") {
                                    row[col.dataKey] = row[col.dataKey].value;
                                } else if (t.columnControllerProps.returntype == "data") {
                                    row[col.dataKey] = row[col.dataKey].data;
                                }
                            }
                            break;
                    }
                })
                delete row.GUID;
                delete row.DATATABLE;
                newData.push(row);
            })
            return newData;
        },
        getValue: () => {
            if (props.returntype == "data") {
                return insideEffect.getCopyClearExport(FullStateData.data)
            }
            let SendData = {
                Selected: insideEffect.getCopyClearExport(FullStateData.data.filter(t => t.DATATABLE.isSelected == true)),
                BaseData: props.data ?? [],
                SearchForm: thatFnc.getSearchForm?.()?.getValue?.(),
                Value: {
                    Insert: insideEffect.getCopyClearExport(FullStateData.data.filter(t => t.DATATABLE.Process == ProcessType.Insert)),
                    Delete: insideEffect.getCopyClearExport(FullStateData.deleteData),
                    Update: insideEffect.getCopyClearExport(FullStateData.data.filter(t => t.DATATABLE.Process == ProcessType.Update)),
                    ViewData: insideEffect.getCopyClearExport(insideEffect.ViewData),
                    ExpandData: insideEffect.getCopyClearExport(FullStateData.data.filter(t => t.DATATABLE.isExpand == true))
                }
            }
            return SendData;
        },
        Add: (newRow, addIndex?) => {
            let inData = createData([newRow], FullStateData.data.length + 1)[0];
            inData.DATATABLE.Process = ProcessType.Insert;
            if (addIndex == null) {
                addIndex = 0;
            }
            if (addIndex >= FullStateData.data.length) {
                addIndex = FullStateData.data.length
            }
            if (FullStateData.data.length == 0) {
                FullStateData.data.push(inData);

            } else
                FullStateData.data.splice(addIndex, 0, inData);
            insideEffect.RederView();
        },
        getCol: (dataKey: string): ColumnTypeinSide => {
            let col = FullStateData.cols.filter(t => t.dataKey == dataKey);
            if (col.length > 0)
                return col[0];
            return null;
        },
        EditView: (Row: any, col: ColumnType, val: any) => {
            Row[col.dataKey] = val;
            insideEffect.EditRow(Row, ProcessType.Update);
        },
        EditRow: (Row: any, Process: ProcessType) => {
            if (Process == ProcessType.Update) {

                if (Row != null && Row.DATATABLE != null && Row.DATATABLE.Process != ProcessType.Insert) {
                    Row.DATATABLE.Process = ProcessType.Update;
                }
            }
            return Row
        },
        GetIndexs: (exp: (t: any) => boolean): number[] => {
            return FullStateData.data.filter(exp).map((row) => {
                return FullStateData.data.findIndex(a => a.GUID == row.GUID);
            }).sort((a, b) => { return a < b ? 0 : -1 })
        },
        UpdateCell: (RowIndex: number, dataKey: string, value: any, isRender: boolean = true) => {
            try {

                if (FullStateData.data.length < RowIndex || RowIndex < 0 || FullStateData.data.length == 0) {
                    return false;
                }
                let col = insideEffect.getCol(dataKey);
                if (col != null) {
                    value = CleanData(value, col);
                }
                props.onChange?.(FullStateData.data[RowIndex][dataKey], dataKey, RowIndex, value, FullStateData.data[RowIndex][dataKey])
                FullStateData.data[RowIndex][dataKey] = value;

                if (isRender == true) {
                    insideEffect.RederView();
                }
                if (props.editmode == "excel" && insideEffect.editExcellRef[RowIndex] != null && insideEffect.editExcellRef[RowIndex][dataKey] != null && insideEffect.editExcellRef[RowIndex][dataKey].current != null) {
                    try {
                        insideEffect.editExcellRef[RowIndex][dataKey].current.setValue(FullStateData.data[RowIndex][dataKey]);
                    } catch (e) {

                    }
                }
            } catch (error) {

            }
        },
        UpdateCellExp: (exp, dataKey, value) => {
            insideEffect.GetIndexs(exp).map(t => {
                insideEffect.UpdateCell(t, dataKey, value, false);
            })
            insideEffect.RederView();
        },
        RowUpdate: (RowIndex: number, row: any, isRender: boolean = true) => {
            if (FullStateData.data.length < RowIndex || RowIndex < 0 || FullStateData.data.length == 0) {
                return false;
            }
            if (row != null) {
                let dataKey = Object.keys(row).filter(t => !(t == "GUID" || t == "DATATABLE"));
                for (let index = 0; index < dataKey.length; index++) {
                    insideEffect.UpdateCell(RowIndex, dataKey[index], row[dataKey[index]], false);
                }
                if (isRender == true) {
                    insideEffect.RederView();
                }
            }
        },
        RowUpdateExp: (exp: (t: any) => boolean, row: any) => {
            insideEffect.GetIndexs(exp).map(t => {
                insideEffect.RowUpdate(t, row, false);
            })
            insideEffect.RederView();
        },
        Selected: (RowIndex: number, status: boolean, isRender: boolean = true) => {
            if (FullStateData.data.length < RowIndex || RowIndex < 0 || FullStateData.data.length == 0) {
                return false;
            }
            FullStateData.data[RowIndex].DATATABLE.isSelected = status;
            if (isRender == true) {
                //setData(FullStateData.data);
                handleClearRows();
            }
        },
        SelectedExp: (exp: (t: any) => boolean, status: boolean) => {
            insideEffect.GetIndexs(exp).map(t => {
                insideEffect.Selected(t, status, false);
            })
            handleClearRows();
        },
        Delete: (RowIndex: number, isRender?: boolean) => {
            if (FullStateData.data.length < RowIndex || RowIndex < 0 || FullStateData.data.length == 0) {
                return false;
            }
            if (FullStateData.data[RowIndex].DATATABLE.Process != ProcessType.Insert) {
                FullStateData.deleteData.push({ ...dataRow[RowIndex] });
            }
            FullStateData.data = FullStateData.data.filter(t => !(t.GUID == FullStateData.data[RowIndex].GUID));
            //setData(data);
            if ((isRender ?? true) == true) {
                insideEffect.RederView();
            }
        },
        DeleteExp: (exp) => {
            insideEffect.GetIndexs(exp).map(t => {
                insideEffect.Delete(t, false);
            })
            insideEffect.RederView();
        },
        DataTableViewSelectUser: (selected: { allSelected: boolean, selectedCount: number, selectedRows: any[] }) => {

            FullStateData.data.filter(t => t?.DATATABLE?.isSelected == true && selected?.selectedRows.filter(x => x.GUID == t.GUID).length == 0).map(t => {
                t.DATATABLE.isSelected = false;
            })
            FullStateData.data.filter(t => t?.DATATABLE?.isSelected == false && selected?.selectedRows.filter(x => x.GUID == t.GUID).length > 0).map(t => {
                t.DATATABLE.isSelected = true;
            })
        }
    }


    let height = props.maxHeight ?? 400;

    let thatFnc: IDataTableRef = {
        getProps: () => props,
        type: ScreenControllerType.DataTable,
        Add: insideEffect.Add,
        UpdateCell: insideEffect.UpdateCell,
        UpdateCellExp: insideEffect.UpdateCellExp,
        RowUpdate: insideEffect.RowUpdate,
        RowUpdateExp: insideEffect.RowUpdateExp,
        Delete: insideEffect.Delete,
        DeleteExp: insideEffect.DeleteExp,
        Selected: insideEffect.Selected,
        SelectedExp: insideEffect.SelectedExp,
        getSearchForm: null,
        controllerClass: ControllerClassType.Input,
        getValue: insideEffect.getValue,
        isDisable: null,
        isHide: null,
        setDisable: null,
        setHide: null,
        setValue: (value: any[]) => {
            insideEffect.state.data = value;
            insideEffect.RederView();
            return true
        }
    }


    const columns = ColumnsDetails(insideEffect);
    const columnsHides = ColumnsDetailsHides(insideEffect);
    const dataRow = ColumnsGetDataDetails(insideEffect);
    const paging = ColumnsGetPage(props, insideEffect);
    const autoRenderForms = AutoRenderForms(insideEffect, thatFnc);
    thatFnc.getSearchForm = () => {
        return autoRenderForms.SearchForm?.getForm()
    }

    const singleFilterMemo = SingleFilter(insideEffect);

    React.useImperativeHandle(ref, () => (thatFnc));

    props.screencontroller?.register(thatFnc);
    if (props.isformcontroller == true && props.controller != null) {
        thatFnc.type = ControllerType.DataTable;
        props.controller?.register(thatFnc as any, props.name)
    }

    const customStyles: TableStyles = {
        rows: {
            style: {
                border: "1px solid #a7a7a7",
            },
        },
        headCells: {
            style: {
                paddingLeft: '0px', // override the cell padding for head cells
                paddingRight: '0px',
                borderLeft: "1px solid #a7a7a7",
                borderRight: "1px solid #a7a7a7",
                backgroundColor: '#e4e4e4',
            },
        },
        head: {
            style: {
                paddingLeft: '0px', // override the cell padding for data cells
                paddingRight: '0px',
                border: "1px solid #a7a7a7",
                borderBottom: "0px", 
                backgroundColor: '#e4e4e4',
                

            },
        },
        cells: {
            style: {
                paddingLeft: '0px', // override the cell padding for data cells
                paddingRight: '0px',
                borderLeft: "1px solid #a7a7a7",
                borderRight: "1px solid #a7a7a7",
            },
        },
        table: {
            style: {
                height: height / 2
            }
        }

    };
    load = true;
    createTheme('solarized', {
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
        },
        background: {
            default: '#FFFFFF',
        },

        context: {
            background: '#e3f2fd',
            text: 'rgba(0, 0, 0, 0.87)',
        },
        divider: {
            default: 'rgba(0,0,0,.12)',
        },

        action: {
            button: 'rgba(0,0,0,.54)',
            hover: 'rgba(0,0,0,.08)',
            disabled: 'rgba(0,0,0,.12)',
        },
        button: {
            default: 'rgba(0,0,0,.54)',
            focus: 'rgba(0,0,0,.12)',
            hover: 'rgba(0,0,0,.12)',
            disabled: 'rgba(0, 0, 0, .18)',
        },
        selected: {
            default: '#e3f2fd',
            text: 'rgba(0, 0, 0, 0.87)',
        },
        highlightOnHover: {
            default: '#EEEEEE',
            text: 'rgba(0, 0, 0, 1)',
        },
        striped: {
            default: '#FAFAFA',
            text: 'rgba(0, 0, 0, 1)',
        },

    }, 'default');
 
    return (
        <>
            <editModal.View autoClear={true} backdrop size="xl" header={props.header} />
            <Card >
                {(autoRenderForms.SearchForm != null) && (
                    <div style={{ marginBottom: 20 }}>
                        {<autoRenderForms.SearchForm.View />}
                    </div>
                )}
                <CardHeader>
                    <Row hidden={(props.testButtons ?? false) !== true}>
                        <Col>Events {' - '}
                            <ButtonGroup>
                                <Button isLabelHidden color="info" onClick={(e) => { console.log(FullStateData.data); }} label="GetRawData" id="GetRawData" />
                                <Button isLabelHidden color="info" onClick={(e) => { FullStateData.cols[0].isHidden = true; insideEffect.RederView(); }} label="GetRawData" id="GetRawData" />
                                <Button isLabelHidden color="info" onClick={(e) => { console.log(thatFnc.getValue()); console.log(JSON.stringify(thatFnc.getValue())); }} label="GetData" id="GetData" />
                                <Button color="danger" onClick={(e) => {
                                    let sayi: any = prompt("SAYI Giriniz", "0");
                                    sayi = _.toNumber(sayi);
                                    thatFnc.Add({ CheckBox: false, "name": "SELAM 1", "phone": "00000000", "email": "pharetra.nam@protonmail.edu", "region": "Hatay", "country": "TURKIYE", "text": "sollicitudin adipiscing ligula. Aenean gravida nunc sed pede. Cum sociis", "numberrange": 3, "currency": { value: 5462.04, currency: "USD" }, "alphanumeric": "VOB92CFL7GL", "postalZip": "65152-271", "date": "2022.08.30 8:30:11", "time": "07:25:01" }, sayi)
                                }} label="AddInsert" id="AddInsert" />

                                <Button isLabelHidden color="danger" onClick={(e) => {
                                    thatFnc.UpdateCell(14, "numberrange", 12, false);
                                    thatFnc.UpdateCell(4, "currency", { value: 12, currency: "EUR" }, false);
                                    thatFnc.UpdateCell(4, "email", "SALTUK 1", false);
                                    thatFnc.UpdateCell(1, "CheckBox", true, false);
                                    thatFnc.UpdateCell(2, "name", "SALTUK 1", false);
                                    thatFnc.UpdateCell(3, "phone", "00000000", true);
                                    thatFnc.UpdateCell(0, "date", "2023.08.30 0:12:11", true);
                                    thatFnc.UpdateCell(0, "time", "15:20", true);
                                }} label="Update Cell Index" id="UpdateInsert" />
                                <Button isLabelHidden color="danger" onClick={(e) => {
                                    thatFnc.UpdateCellExp((t => t.GUID < 5), "numberrange", 12, false);
                                    thatFnc.UpdateCellExp((t => t.GUID == 5), "currency", { value: 12, currency: "EUR" }, false);
                                    thatFnc.UpdateCellExp((t => t.GUID == 5), "email", "SALTUK 1", false);
                                    thatFnc.UpdateCellExp((t => t.GUID > 5), "CheckBox", true, false);
                                    thatFnc.UpdateCellExp((t => t.GUID == 6), "name", "SALTUK 1", false);
                                    thatFnc.UpdateCellExp((t => t.GUID == 7), "phone", "00000000", true);
                                    thatFnc.UpdateCellExp((t => t.GUID == 8), "date", "2023.08.30 0:12:11", true);
                                    thatFnc.UpdateCellExp((t => t.GUID == 9), "time", "15:20", true);
                                }} label="Update Cell Exp" id="UpdateInsert" />

                                <Button isLabelHidden color="primary" onClick={(e) => {
                                    thatFnc.RowUpdate(0, {
                                        CheckBox: true,
                                        "name": "Aspen Hewitt",
                                        "phone": "1-948-676-0204",
                                        "email": "sem.nulla@icloud.couk",
                                        "region": "Şanlıurfa",
                                        "country": "Sweden",
                                        "text": "Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu",
                                        "numberrange": 1,
                                        "currency": 57593.38,
                                        "alphanumeric": "LVA72IJL5SI",
                                        "postalZip": "2328",
                                        "date": "2022.04.23 5:27:33",
                                        "time": "9:03:17"
                                    }, true);
                                }} label="Update Row Index" id="UpdateInsert" />
                                <Button isLabelHidden color="primary" onClick={(e) => {

                                    thatFnc.RowUpdateExp((t => t.GUID < 5), {
                                        CheckBox: true,
                                        "name": "Aspen Hewitt",
                                        "phone": "1-948-676-0204",
                                        "email": "sem.nulla@icloud.couk",
                                        "region": "Şanlıurfa",
                                        "country": "Sweden",
                                        "text": "Quisque fringilla euismod enim. Etiam gravida molestie arcu. Sed eu",
                                        "numberrange": 1,
                                        "currency": 57593.38,
                                        "alphanumeric": "LVA72IJL5SI",
                                        "postalZip": "2328",
                                        "date": "2022.04.23 5:27:33",
                                        "time": "9:03:17"
                                    });
                                }} label="Update Row Exp" id="UpdateInsert" />

                                <Button isLabelHidden color="secondary" onClick={(e) => {
                                    thatFnc.Delete(0, true);
                                }} label="Delete Row Index" id="UpdateInsert" />
                                <Button isLabelHidden color="secondary" onClick={(e) => {

                                    thatFnc.DeleteExp((t => t.GUID > 5));
                                }} label="Delete Row Exp" id="UpdateInsert" />

                                <Button isLabelHidden color="success" onClick={(e) => {
                                    thatFnc.Selected(0, true);
                                }} label="Select Row Index" id="UpdateInsert" />
                                <Button isLabelHidden color="success" onClick={(e) => {
                                    thatFnc.SelectedExp((t => t.GUID > 5), true);
                                }} label="Select Row Exp" id="UpdateInsert" />
                            </ButtonGroup>
                        </Col>
                    </Row>
                    <Row>
                        {!_.isEmpty(props.header) && (<Col><Label>{props.header}</Label></Col>)}
                        <Col
                            xl={_.isEmpty(props.header) ? 12 : 2}
                            md={_.isEmpty(props.header) ? 12 : 3}
                            xs={12} xxl={_.isEmpty(props.header) ? 12 : 2}
                            lg={_.isEmpty(props.header) ? 12 : 2}>
                            <InputGroup style={{ float: "right", display: singleFilterMemo == null ? "block" : "flex", textAlign: "right" }}>
                                {
                                    (props.editmode == "modal" || props.editmode == "excel") && (
                                        <Button isLabelHidden id="Add" style={{ height: 38 }} label={null} icon={{ iconName: IconName.Plus }}
                                            onClick={() => {
                                                if (props.editmode == "modal")
                                                    insideEffect.EditInsertModal({}, ProcessType.Insert);
                                                else {
                                                    thatFnc.Add({}, 0)
                                                }
                                            }} />)
                                }{columnsHides}{singleFilterMemo}
                            </InputGroup>
                        </Col>
                    </Row>
                </CardHeader>
                <div >

                    <Row>
                        <Col xl={12} sm={12} xs={12} xxl={12} md={12} lg={12}  >
                            <DataTableView
                                keyField={"GUID"}
                                theme="solarized"
                                customStyles={customStyles}
                                data={dataRow}
                                pagination={false}
                                dense={true}
                                striped
                                persistTableHead
                                selectableRowsSingle={props.selectableRowsSingle}
                                selectableRowDisabled={props.selectableRowDisabled}
                                selectableRows={props.selectableRows === true}
                                expandableRows={props.expandableRowsComponent == null ? false : true}
                                expandableRowsComponent={(e) => {
                                    return props.expandableRowsComponent?.(e);
                                }}
                                expandableRowExpanded={(e) => { return e?.DATATABLE?.isExpand == true }}
                                expandableRowDisabled={props.selectableRowDisabled}
                                onRowExpandToggled={(e, rowData) => {
                                    rowData.DATATABLE.isExpand = e;
                                }}
                                clearSelectedRows={toggledClearRows}
                                onSelectedRowsChange={insideEffect.DataTableViewSelectUser}
                                noDataComponent={(<div>-</div>)}
                                highlightOnHover
                                selectableRowSelected={(e) => { return e?.DATATABLE?.isSelected == true }}
                                pointerOnHover
                                responsive
                                paginationResetDefaultPage={renderCols}
                                columns={columns}
                                onSort={(e, sort: SortOrder) => {
                                    FullStateData.cols.filter(t => t.dataKey != e.id).map(t => { t.Sorted = null });
                                    FullStateData.cols.filter(t => t.dataKey == e.id).map(t => { t.Sorted = ((sort == "asc") ? "up" : "down"); });
                                    setRenderCols(!renderCols);
                                }}
                                fixedHeader={height > 0}
                                fixedHeaderScrollHeight={height != null ? `${height}px` : undefined}
                            />
                        </Col>
                    </Row>
                </div>
                <CardFooter>
                    <Col xl={12} sm={12} xs={12} xxl={12} md={12} lg={12}>
                        <div style={{ flex: 1, float: "right" }}>
                            {paging.view}
                        </div>
                    </Col>
                </CardFooter>
            </Card>
        </>)
}), "DataTable")



export const useDataTable = () => {
    let ref = useRef<IDataTableRef>(null);
    const enhanced = WithScreenController(WithController(React.forwardRef((props: IDataTableProps, refs?: React.ForwardedRef<IDataTableRef>) => {
        if (refs != null)
            useEffect(() => {
                ref = refs as any
            }, [refs])
        else
            refs = ref;
        return <DataTable {...props} ref={refs} />
    }), "DataTable"))
    let methods: UIDataTableRef = Object.create({});
    useEffect(() => {
        if (ref.current != null) {
            let keys = Object.keys(ref.current)
            for (let index = 0; index < keys.length; index++) {
                (methods as any)[keys[index]] = (ref.current as any)[keys[index]];
            }
        }

    }, [ref]);
    (enhanced as any).IsController = true;
    (enhanced as any).SubTypeName = "DataTable";
    methods.View = enhanced;
    return useState(methods)[0]
}