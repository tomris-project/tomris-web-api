import _ from "lodash";
import { useMemo, useRef } from "react"
import { Input, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { ControllerType } from "../../components";
import { Icon, IconName } from "../icon/icon"
import { IInputNumberRef, InputNumber, NumberInputType } from "../numberinput";
import { Select } from "../select";
import { ColumnTypeinSide, IDataTableProps, InsideEffect } from "./datatable"
import Moment from 'moment';
import { BaseDate } from "../../utility/BaseDate";


export const ColumnsGetDataDetails = (insinsideEffect: InsideEffect ) => {


    let cols: ColumnTypeinSide[]=insinsideEffect.state.cols;
    let viewData: any[] = insinsideEffect.state.data;

     let dataView = useMemo(() => {
        if (cols.filter(t => t.Sorted != null).length > 0) {
            let sort = cols.filter(t => t.Sorted != null)[0];
            if (sort.columnControllerType == ControllerType.Number) {

                if (sort.Sorted == "down")
                    viewData = viewData.sort((a, b) => { return (a[sort.dataKey].value > b[sort.dataKey].value) ? -1 : 0 })
                if (sort.Sorted == "up")
                    viewData = viewData.sort((a, b) => { return (a[sort.dataKey].value > b[sort.dataKey].value) ? 0 : -1 })
            } else {
                if (sort.Sorted == "down")
                    viewData = viewData.sort((a, b) => { return (a[sort.dataKey] > b[sort.dataKey]) ? -1 : 0 })
                if (sort.Sorted == "up")
                    viewData = viewData.sort((a, b) => { return (a[sort.dataKey] > b[sort.dataKey]) ? 0 : -1 })
            }
        }

        if (Object.keys(insinsideEffect.filterData).length > 0) {
            let filterData = null;
            if (insinsideEffect.filterData["**"] != null && (insinsideEffect.filterData["**"] as string).length > 0) {
                let seacrhData = cols.filter(t => t.isNotFilter !== true).map(t => t.dataKey);
                let seacrhText = (insinsideEffect.filterData["**"] as string).toLowerCase();
                if (seacrhData.length > 0) {
                    filterData = (t: any) => {
                        for (let index = 0; index < seacrhData.length; index++) {
                            let columnName = seacrhData[index];
                            if (_.isString(t[columnName])) {
                                if ((t[columnName] as string).toLowerCase().includes(seacrhText) == true) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                }
            } else {

                let searchcols = Object.keys(insinsideEffect.filterData);

                let searchCols = cols.filter(col => {


                    let status = col.isNotFilter !== true && searchcols.includes(col.dataKey) === true;
                    if (status == false)
                        return false;
                    let searchData = insinsideEffect.filterData[col.dataKey];
                    if (null == searchData || (_.isString(searchData) && _.isEmpty(searchData))) {
                        return false;
                    }

                    switch (col.columnControllerType) {
                        case ControllerType.Checkbox:
                            // if (rowData == searchData) {
                            //     return true;
                            // }
                            break;
                        case ControllerType.Input:
                            if (searchData != null && (searchData as string).length == 0) {
                                return false;
                            }
                            break;
                    }
                    return status

                }).map(t => t);
                if (searchCols.length > 0)
                    filterData = (t: any) => {
                        let status = true;
                        for (let index = 0; index < searchCols.length; index++) {
                            let col = searchCols[index];
                            let rowData = t[col.dataKey];
                            let searchData = insinsideEffect.filterData[col.dataKey];
                            switch (col.columnControllerType) {
                                case ControllerType.Checkbox:
                                    if (rowData != searchData) {
                                        status = false;
                                    }
                                    break;
                                case ControllerType.Input:
                                    if (!(searchData != null && (searchData as string).length && rowData.toLowerCase().includes((searchData as string).toLowerCase()))) {
                                        status = false;
                                    }
                                    break;
                                case ControllerType.Date:
                                    if (col.columnControllerProps?.type == "time") {
                                        if (searchData != null) {
                                            if (searchData.StartDate != null && searchData.StopDate != null) {
                                                if (!BaseDate.Method.isBetweenCompareTimeIsAfter(rowData, searchData.StartDate, searchData.StopDate, true)) {
                                                    status = false;
                                                }
                                            } else if (searchData.StartDate != null && searchData.StopDate == null) {
                                                if (!BaseDate.Method.CompareTimeIsAfter(rowData, searchData.StartDate, true)) {
                                                    status = false;
                                                }
                                            } else if (searchData.StartDate == null && searchData.StopDate != null) {
                                                if (!BaseDate.Method.CompareTimeIsAfter(searchData.StopDate, rowData, true)) {
                                                    status = false;
                                                }
                                            }
                                        }
                                    } else {
                                        let date = (rowData as Date)
                                        let StartDate = (searchData.StartDate as Date)
                                        let StopDate = (searchData.StopDate as Date)
                                        if (!(Moment(date).isBetween(StartDate, StopDate))) {
                                            status = false;
                                        }
                                    }
                                    break;
                                case ControllerType.Number:
                                    debugger
                                    let inputVal = searchData as NumberInputType;
                                    let val = _.isNumber(rowData) ? rowData : rowData.value;

                                    if (inputVal.Start != null && inputVal.Stop != null && !(val >= inputVal.Start && inputVal.Stop >= val)) {
                                        status = false;
                                    } else if (inputVal.Start != null && inputVal.Stop == null && !(val >= inputVal.Start)) {
                                        status = false;
                                    } else if (inputVal.Start == null && inputVal.Stop != null && !(inputVal.Stop >= val)) {
                                        status = false;
                                    }
                                    break;
                                case ControllerType.Select:
                                    if (!(rowData != null && null != searchData && rowData.value == searchData.value)) {
                                        status = false;
                                    }
                                    break;
                            }

                        }
                        return status;
                    }



            }

            if (filterData != null) {
                viewData = viewData.filter(filterData);
            }


        }
        insinsideEffect.state.filterCount=viewData.length; 
        let size=insinsideEffect.state.page.selectPageSize;
        let Page=insinsideEffect.state.page.currentPage;
        viewData = viewData.slice(size * (Page - 1), (Page) * size)  
        insinsideEffect.ViewData = viewData;
        return viewData;
    }, [insinsideEffect.renderCols,insinsideEffect.state.page.currentPage, insinsideEffect.state.page.selectPageSize])

   return dataView;
}

export interface Paging {
    view: JSX.Element;
    event: {
        getPage: () => number;
        getSize: () => number;
    }
}

export const ColumnsGetPage = (props: IDataTableProps, insideEffect: InsideEffect): Paging => {

 

    if(insideEffect.state.page.currentPage==null)
    {
        insideEffect.state.page.currentPage = insideEffect.state.page.currentPage == 0 ? 1 : insideEffect.state.page.currentPage
    }
    
    let sizeList = props.pageSize ?? [10, 20, 50, 100]; 
    if (insideEffect.state.page.selectPageSize==null)
    {
        insideEffect.state.page.selectPageSize=props.pageSizeDefault ?? sizeList[0];
    } 
    let lastPage = Math.ceil((insideEffect.state.filterCount??0) / insideEffect.state.page.selectPageSize);
    if (lastPage == 0)
        lastPage = 1; 
    const SetPage = (page: number) => {
        if (page == 0)
            page = 1;
        if (page > lastPage) {
            page = lastPage;
        }
        insideEffect.state.page.currentPage = page;
        pageInput.current.setValue({ value: insideEffect.state.page.currentPage });
        insideEffect.state.page.currentPage = insideEffect.state.page.currentPage == 0 ? 1 : insideEffect.state.page.currentPage 
        insideEffect.RederView();
    }



    const pageInput = useRef<IInputNumberRef>(null);

     let page = useMemo(() => {
       return  (<Pagination style={{ padding: 0, margin: 0 }}>
            <PaginationItem>
                <PaginationLink
                    first
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); SetPage(1) }}
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                    previous
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); SetPage(insideEffect.state.page.currentPage - 1) }}
                />
            </PaginationItem>
            <PaginationItem style={{ width: 60 }}>
                <InputNumber id="Numbers" isLabelHidden bsSize="lg" className="page-link rounded-0" defaultValue={{ value: insideEffect.state.page.currentPage == 0 ? 1 : insideEffect.state.page.currentPage }} ref={pageInput} onKeyUp={(e) => { if (e.key == "13" || e.key === 'Enter') { SetPage(pageInput.current.getValue()?.value ?? 0) } }} onBlur={(e) => { SetPage(pageInput.current.getValue()?.value ?? 0) }} />
            </PaginationItem>
            <PaginationItem>
                <div className="page-link">
                    / {lastPage}
                </div>
            </PaginationItem>
            <PaginationItem onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <div className="page-link" style={{ padding: 2, paddingBottom: 3 }}>
                    <Select id={"select"} feedBackBorder="both" noBorder defaultValue={{ label: insideEffect.state.page.selectPageSize.toString(), value: insideEffect.state.page.selectPageSize }} options={sizeList.map(t => { return { value: t, label: t.toString() } as any; })} isLabelHidden onChange={(e) => { insideEffect.state.page.selectPageSize = e.value;  SetPage(1); }} />
                </div>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); SetPage(insideEffect.state.page.currentPage + 1) }}
                    next
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); SetPage(lastPage) }}
                    last
                />
            </PaginationItem>
        </Pagination>)

    }, [insideEffect.state.page.selectPageSize, insideEffect.state.filterCount ])

    return { view: page, event: { getPage: () => insideEffect.state.page.currentPage, getSize: () => insideEffect.state.page.selectPageSize } };
}