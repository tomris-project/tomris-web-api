import { CheckboxProps, ControllerType, DateProps, FormRef, InputNumberProps, InputProps, SelectProps } from "../../component";
import { AutoRender, RenderElement, RenderMethod } from "../../autorender/autorender";
import { ButtonProps } from "../button";
import { IconName } from "../icon/icon";
import { IDataTableRef, InsideEffect, ProcessType } from "./datatable";
import { useEffect, useState } from "react";


export const AutoRenderForms = (insideEffect: InsideEffect, that: IDataTableRef) => {




    let props = insideEffect.getProps();


    let [ReturnModal] = useState<{ SearchForm: RenderMethod, ModalForm: RenderMethod }>(
        {
            SearchForm: null,
            ModalForm: null
        });

    let ProccessTypeRenderForms: any[] = [{ form: props.SearchForm, setType: "SearchForm", modeForce: "range", BtnLabel: "Search", iconName: IconName.Search ,col:3,indeterminate:true }]
    //let ProccessTypeRenderForms = [{ form: props.SearchForm, setType: "SearchForm", modeForce: "range", BtnLabel: "Search", iconName: IconName.Search }]
    if (that.getProps().editmode == "modal") {
        let editProps = { ...props.EditForm };

        const SaveData = (form: FormRef, that: IDataTableRef, data: any) => { 
            if (props.EditForm.event != null) {
                data = props.EditForm.event(form, that, data);
            } 
            let row = form.getHiddenData();
            if (row.row != null && row.type != null) {
                switch (row.type) {
                    case ProcessType.Update:
                        that.RowUpdateExp(t => t.GUID == row.row.GUID, data);
                        break;
                    case ProcessType.Insert:
                        that.Add(data, 0);
                        break;
                }
                insideEffect.editModal.isOpen(false);
            }
        }

        editProps.event = SaveData;

        useEffect(() => {
            insideEffect.editModal.setBody(<ReturnModal.ModalForm.View />)
            insideEffect.EditInsertModal = (row, type) => {
                insideEffect.editModal.isOpen(true).then(() => { 
                    console.log(row);
                    let updateRow=row;
                    Object.keys(row).map(key=>{
                        if(updateRow[key]==null)
                            delete updateRow[key];
                    })
                    let form = ReturnModal.ModalForm.getForm();
                    form.setHiddenData({ row: row, type: type });
                    form.setValue(updateRow);
                })
            }
        })
        ProccessTypeRenderForms.push({ form: editProps, setType: "ModalForm", BtnLabel: "Save", iconName: IconName.Save,col:3 ,indeterminate:false });



    }
 
    ProccessTypeRenderForms.map(forms => {

        if (forms.form != null) {


            let com: RenderElement = { ...forms.form.formComponents };

            if (forms.form.formComponents == null) {
                com = {
                    objectName: forms.setType, objectType: "Form", props: ({ name: forms.setType, responsiveSize: { col: forms.col } }),
                    children: []
                };

                props.columns.map((col, index) => {

                    let row: RenderElement = { objectName: col.dataKey, objectType: "Input", props: {}, children: [] };
                    col.columnControllerType = col.columnControllerType ?? ControllerType.Input;
                    switch (col.columnControllerType) {
                        case ControllerType.Input:
                            row.objectType = "Input"
                            row.props = { id: col.dataKey, label: col.columnName, ...col.columnControllerProps } as InputProps
                            com.children.push(row)
                            break;
                        case ControllerType.Checkbox:
                            row.objectType = "Checkbox"
                            row.props = { id: col.dataKey, label: col.columnName, ...col.columnControllerProps, indeterminate: forms.indeterminate } as CheckboxProps
                            com.children.push(row)
                            break;
                        case ControllerType.Date:
                            row.objectType = "Date"
                            row.props = { id: col.dataKey, label: col.columnName, mode: forms.modeForce, ...col.columnControllerProps } as DateProps
                            com.children.push(row)
                            break;
                        case ControllerType.InputNumber:
                            row.objectType = "InputNumber"
                            row.props = { id: col.dataKey, label: col.columnName, mode: forms.modeForce, ...col.columnControllerProps } as InputNumberProps
                            com.children.push(row)
                            break;
                        case ControllerType.Select:
                            row.objectType = "Select"
                            row.props = { id: col.dataKey, label: col.columnName, mode: forms.modeForce, ...col.columnControllerProps } as SelectProps
                            com.children.push(row)
                            break;
                    }
                })
            }

            if (com.objectType != "Form")
                throw "Fisrt Search Component Only Form Start";

            if (com.children == null)
                com.children = [];
            if (com.children.length > 0) {
                if (com.children[com.children.length - 1].props == null)
                    com.children[com.children.length - 1].props = {};
                com.children[com.children.length - 1].props.spacer = true

                com.children.push({
                    objectName: "SearchButton", objectType: "Button", props: {
                        id: "SearchBtn", isLabelHidden: true, label: forms.BtnLabel, className: "mt-2", icon: { iconName: forms.iconName },
                        onClick: () => {
                            forms.form?.event((ReturnModal as any)[forms.setType].getForm(), that, (ReturnModal as any)[forms.setType].getForm()?.getValues?.())
                        }
                    } as ButtonProps
                })
            }

            (ReturnModal as any)[forms.setType] = AutoRender({ RenderData: com, onChange: forms.form.onChange });

        }


    })



    return ReturnModal;

}