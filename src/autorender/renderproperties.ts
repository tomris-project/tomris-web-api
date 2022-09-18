import {
  CheckboxProps,
  IAccordionPanelProps,
  IAccordionProps,
  InputNumberProps,
  SelectProps,
  IDataTableProps,
  ControllerType,
} from "../component";
import { IRenderProperties, RenderElement } from "./autorender";
import { OptionsData, Options } from "../components/select/select";
import { IconName } from "../components/icon/icon";
import _ from "lodash";
import { ActionsProps, ColumnType } from "../components/datatable";

const FastDataComponent = {
  TextData: (
    name: string,
    id: string,
    label: string,
    defaultValue: string,
    autorenderformname: string,
    type: string = ""
  ): RenderElement => {
    return {
      objectName: name,
      objectType: "Input",
      autorenderformname: autorenderformname,
      props: { defaultValue: defaultValue, id: id, label: label, type: type },
    };
  },
  NumberData: (
    name: string,
    id: string,
    label: string,
    defaultValue: number,
    autorenderformname: string
  ): RenderElement => {
    return {
      objectName: name,
      objectType: "InputNumber",
      autorenderformname: autorenderformname,
      props: {
        defaultValue: defaultValue,
        id: id,
        label: label,
        type: "number",
        mode: "input",
      } as InputNumberProps,
    };
  },
  Select: (
    name: string,
    id: string,
    label: string,
    options: OptionsData,
    defaultValue: Options,
    autorenderformname: string,
    returntype: "object" | "value" | "data" = "value"
  ): RenderElement => {
    return {
      objectName: name,
      objectType: "Select",
      autorenderformname: autorenderformname,
      props: {
        id: id,
        label: label,
        defaultValue: defaultValue,
        returntype: returntype,
        options: options,
      } as SelectProps,
    };
  },
  BooleanData: (
    name: string,
    id: string,
    label: string,
    defaultValue: boolean,
    autorenderformname: string,
    indeterminate: boolean = false
  ): RenderElement => {
    return {
      objectName: name,
      autorenderformname: autorenderformname,
      objectType: "Checkbox",
      props: {
        defaultValue: defaultValue,
        id: id,
        label: label,
        indeterminate: indeterminate,
      } as CheckboxProps,
    };
  },
  ControllerBase: (NoText: boolean = false) => {
    let cnt: any = [];

    if (NoText == false) {
      cnt.push(
        FastDataComponent.TextData("label", "label", "Label", "", "label")
      );
      cnt.push(
        FastDataComponent.TextData(
          "placeholder",
          "placeholder",
          "Place Holder",
          "",
          "placeholder"
        )
      );
    }
    cnt.push(
      FastDataComponent.BooleanData(
        "hidden",
        "hidden",
        "Hidden",
        false,
        "hidden"
      ),
      FastDataComponent.BooleanData(
        "disabled",
        "disabled",
        "Is Disabled",
        false,
        "disabled"
      )
    );

    return [...cnt];
  },
  Divider: (name: string): RenderElement => {
    return {
      objectName: name,
      objectType: "Divider",
      props: {
        name,
        responsive: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
        },
      },
    };
  },
  Accordion: (
    props: any,
    panel: { props: any; children: RenderElement[] }[],objectName:string="Accordion"
  ): RenderElement => {
    let Acordion: RenderElement = {
      objectName: objectName,
      objectType: "Accordion",
      props: { ...props },
      children: [],
    };

    panel.map((t) => {
      Acordion.children.push({
        objectName: "AccordionPanel",
        objectType: "AccordionPanel",
        props: { ...t.props },
        children: t.children,
      });
    });
    return Acordion;
  },
  iResponsiveType: (name: string): RenderElement[] => {
    let layout: RenderElement[] = [];
    layout.push(
      FastDataComponent.NumberData(
        `${name}.xs`,
        `${name}.xs`,
        "xs",
        null,
        `${name}.xs`
      )
    );
    layout.push(
      FastDataComponent.NumberData(
        `${name}.sm`,
        `${name}.sm`,
        "sm",
        null,
        `${name}.sm`
      )
    );
    layout.push(
      FastDataComponent.NumberData(
        `${name}.md`,
        `${name}.md`,
        "md",
        null,
        `${name}.md`
      )
    );
    layout.push(
      FastDataComponent.NumberData(
        `${name}.lg`,
        `${name}.lg`,
        "lg",
        null,
        `${name}.lg`
      )
    );
    layout.push(
      FastDataComponent.NumberData(
        `${name}.xl`,
        `${name}.xl`,
        "xl",
        null,
        `${name}.xl`
      )
    );
    return layout;
  },
  iconProps: (name: string = "icon"): RenderElement[] => {
    if (name != "") {
      name += ".";
    }
    let ic: RenderElement[] = [];
    ic.push(
      FastDataComponent.TextData(
        `${name}color`,
        `${name}color`,
        "Color",
        "#000",
        `${name}color`,
        "color"
      )
    );
    ic.push(
      FastDataComponent.NumberData(
        `${name}size`,
        `${name}size`,
        "size",
        null,
        `${name}.size`
      )
    );

    let key = Object.keys(IconName as any)
      .filter((t) => {
        return _.isNumber(IconName[t as any]) !== false;
      })
      .map((t) => {
        return { value: t, label: t };
      });

    ic.push(
      FastDataComponent.Select(
        `${name}iconName`,
        `${name}iconName`,
        "Icon Name",
        key,
        null,
        `${name}iconName`,
        "value"
      )
    );
    return ic;
  },
  iLayoutTypeProps: (
    responsiveSize: boolean = true,
    responsive: boolean = true
  ): RenderElement[] => {
    let layout: RenderElement[] = [];

    let ResponsiveSize = {
      props: {
        name: "ResponsiveSize - Global",
        responsiveSize: { col: 2 },
      },
      children: [
        FastDataComponent.NumberData(
          "responsiveSize.col",
          "responsiveSize.col",
          "Col",
          null,
          "responsiveSize.col"
        ),
        ...FastDataComponent.iResponsiveType("responsiveSize"),
      ],
    };
    let panel: any[] = [];
    let Responsive = {
      props: {
        name: "responsive - this Component",
        responsiveSize: { col: 2 },
      },
      children: [
        FastDataComponent.BooleanData(
          "spacer",
          "spacer",
          "Spacer",
          false,
          "spacer"
        ),
        ...FastDataComponent.iResponsiveType("responsive"),
      ],
    };
    if (responsive == true) panel.push(Responsive);
    if (responsiveSize == true) panel.push(ResponsiveSize);

    layout.push(
      FastDataComponent.Accordion(
        { responsive: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 } },
        panel,"iLayoutTypeProps"
      )
    );
    return layout;
  },
  LoopGetFormName: (Data: RenderElement[]): string[] => {
    let pushArray: string[] = [];

    const loop = (Data: RenderElement[]) => {
      Data.map((t) => {
        if (t.autorenderformname != null) {
          pushArray.push(t.autorenderformname);
        }
        if (t.children?.length > 0) {
          loop(t.children);
        }
      });
    };

    loop(Data);

    return pushArray;
  },
  DataList: (
    columns: ColumnType[],
    id: string,
    autorenderformname: string,
    value: any[],
    Height: number = null,
    actions: ActionsProps[] = null,
    onChange: (
      row: any,
      dataKey: string,
      RowIndex: Number,
      newvalue: any,
      OldValue: any
    ) => void = null
  ): RenderElement => {
    let table: RenderElement = {
      objectName: id,
      objectType: "DataTable",
      autorenderformname: autorenderformname,
      props: {
        columns: columns,
        actions: actions,
        onChange: onChange,
        EditForm: {},
        name: id,
        editmode: "excel",
        maxHeight: Height,
        data: value,
        returntype: "data",
        isformcontroller: true,
        responsive: { lg: 12, md: 12, sm: 12, xl: 12, xs: 12 },
      } as IDataTableProps,
    };
    return table;
  },
};

export const ComponentProps = {
  Screen: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData(
        "screencode",
        "screencode",
        "Screen Code",
        "",
        "screencode"
      ),
      FastDataComponent.BooleanData(
        "alert",
        "alert",
        "Is Alert Header Show",
        false,
        "alert"
      ),
      ...FastDataComponent.iLayoutTypeProps(),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Form: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("name", "name", "Form Name", "", "name"),
      FastDataComponent.BooleanData(
        "alert",
        "alert",
        "Is Alert Header Show",
        false,
        "alert"
      ),
      ...FastDataComponent.iLayoutTypeProps(),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Input: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      FastDataComponent.TextData(
        "defaultValue",
        "defaultValue",
        "Input defaultValue",
        "",
        "defaultValue"
      ),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  TabMain: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),

      FastDataComponent.TextData(
        "SelectTabId",
        "SelectTabId",
        "Input SelectTabId",
        null,
        "SelectTabId"
      ),

      FastDataComponent.BooleanData(
        "isWizard",
        "isWizard",
        "Is isWizard",
        false,
        "isWizard",
        true
      ),

      FastDataComponent.BooleanData(
        "isVertical",
        "isVertical",
        "Is isVertical",
        false,
        "isVertical",
        true
      ),
      ...FastDataComponent.ControllerBase(true),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  TabPanel: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Tab Id", "", "id"),
      FastDataComponent.TextData("name", "name", "Tab Name", "", "name"),
      FastDataComponent.NumberData(`index`, `index`, "index", null, `index`),
      ...FastDataComponent.ControllerBase(true),
      ...FastDataComponent.iLayoutTypeProps(true, false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Accordion: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData(
        "SelectTabId",
        "SelectTabId",
        "Input SelectTabId",
        null,
        "SelectTabId"
      ),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  AccordionPanel: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("name", "name", "Tab Name", "", "name"),
      ...FastDataComponent.iLayoutTypeProps(true, false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  NumberInput: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      FastDataComponent.NumberData(
        "defaultValue",
        "defaultValue",
        "Input defaultValue",
        null,
        "defaultValue"
      ),
      FastDataComponent.Select(
        "bsSize",
        "bsSize",
        "bsSize",
        [
          { value: "lg", label: "lg" },
          { value: "sm", label: "sm" },
        ],
        { value: "sm", label: "sm" },
        "bsSize"
      ),
      FastDataComponent.Select(
        "mode",
        "mode",
        "mode",
        [
          { value: "input", label: "input" },
          { value: "range", label: "range" },
        ],
        { value: "input", label: "input" },
        "mode"
      ),
      FastDataComponent.Select(
        "type",
        "type",
        "type",
        [
          { value: "currency", label: "currency" },
          { value: "number", label: "number" },
        ],
        { value: "number", label: "number" },
        "type"
      ),
      FastDataComponent.Select(
        "currencyOptions",
        "currencyOptions",
        "currencyOptions",
        [
          { data: "currency", label: "currency", value: ["TRY", "EUR", "$"] },
          { value: "TRY", label: "TRY", data: "TRY" },
        ],
        null,
        "currencyOptions",
        "data"
      ),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Button: (): IRenderProperties => {
    let colors = [
      "primary",
      "secondary",
      "success",
      "info",
      "warning",
      "danger",
      "link",
    ];
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      FastDataComponent.TextData(
        "value",
        "value",
        "Input value",
        null,
        "value"
      ),
      FastDataComponent.BooleanData(
        "disabled",
        "disabled",
        "Is disabled",
        false,
        "disabled"
      ),
      FastDataComponent.BooleanData(
        "outline",
        "outline",
        "Is outline",
        true,
        "outline"
      ),
      FastDataComponent.BooleanData(
        "block",
        "block",
        "Is block",
        false,
        "block"
      ),
      FastDataComponent.BooleanData(
        "close",
        "close",
        "Is close",
        false,
        "close"
      ),
      FastDataComponent.BooleanData(
        "active",
        "active",
        "Is active",
        false,
        "active"
      ),

      FastDataComponent.Select(
        "iconPosition",
        "iconPosition",
        "iconPosition",
        [
          { value: "left", label: "left" },
          { value: "right", label: "right" },
        ],
        { value: "left", label: "left" },
        "iconPosition"
      ),
      FastDataComponent.Select(
        "color",
        "color",
        "color",
        colors.map((t) => {
          return { value: t, label: t };
        }),
        null,
        "color"
      ),

      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iconProps(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Icon: (): IRenderProperties => {
    let RenderElement = [...FastDataComponent.iconProps("")];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Checkbox: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      FastDataComponent.Select(
        "bsSize",
        "bsSize",
        "bsSize",
        [
          { value: "lg", label: "lg" },
          { value: "sm", label: "sm" },
        ],
        { value: "sm", label: "sm" },
        "bsSize"
      ),
      FastDataComponent.BooleanData(
        "indeterminate",
        "indeterminate",
        "Is indeterminate",
        false,
        "indeterminate"
      ),
      FastDataComponent.BooleanData(
        "defaultValue",
        "defaultValue",
        "defaultValue",
        false,
        "defaultValue",
        true
      ),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Date: (): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      FastDataComponent.Select(
        "type",
        "type",
        "type",
        [
          { value: "date", label: "date" },
          { value: "datetime", label: "datetime" },
          { value: "time", label: "time" },
        ],
        { value: "date", label: "date" },
        "type"
      ),
      FastDataComponent.Select(
        "mode",
        "mode",
        "mode",
        [
          { value: "single", label: "single" },
          { value: "range", label: "range" },
          { value: "time", label: "time" },
        ],
        { value: "single", label: "single" },
        "mode"
      ),
      FastDataComponent.Select(
        "bsSize",
        "bsSize",
        "bsSize",
        [
          { value: "lg", label: "lg" },
          { value: "sm", label: "sm" },
        ],
        { value: "sm", label: "sm" },
        "bsSize"
      ),
      FastDataComponent.BooleanData(
        "enableSeconds",
        "enableSeconds",
        "enableSeconds",
        false,
        "enableSeconds",
        true
      ),
      FastDataComponent.BooleanData(
        "isHideClearButton",
        "isHideClearButton",
        "isHideClearButton",
        false,
        "isHideClearButton",
        true
      ),
      FastDataComponent.BooleanData(
        "isOpenButtonHide",
        "isOpenButtonHide",
        "isOpenButtonHide",
        false,
        "isOpenButtonHide",
        true
      ),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  Select: (isRadio: boolean): IRenderProperties => {
    let RenderElement = [
      FastDataComponent.TextData(
        "defaultValue.value",
        "defaultValue.value",
        "defaultValue.value",
        null,
        "defaultValue.value"
      ),
      FastDataComponent.TextData(
        "defaultValue.label",
        "defaultValue.label",
        "defaultValue.label",
        null,
        "defaultValue.label"
      ),
      FastDataComponent.BooleanData(
        "isClearable",
        "isClearable",
        "isClearable",
        null,
        "isClearable",
        true
      ),
      FastDataComponent.BooleanData(
        "isSearchable",
        "isSearchable",
        "isSearchable",
        null,
        "isSearchable",
        true
      ),
      FastDataComponent.BooleanData(
        "isMulti",
        "isMulti",
        "isMulti",
        null,
        "isMulti",
        true
      ),
      FastDataComponent.BooleanData(
        "noBorder",
        "noBorder",
        "noBorder",
        null,
        "noBorder",
        true
      ),
      FastDataComponent.Select(
        "returntype",
        "returntype",
        "returntype",
        [
          { value: "object", label: "object - value & object" },
          { value: "value", label: "value - only value" },
          { value: "data", label: "data - only hide data" },
        ],
        { value: "object", label: "object" },
        "returntype"
      ),
      FastDataComponent.DataList(
        [
          { columnName: "value", dataKey: "value" },
          { columnName: "label", dataKey: "label" },
        ],
        "options",
        "options",
        []
      ),
      FastDataComponent.TextData("id", "id", "Input Id", "", "id"),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
  DataTable: (): IRenderProperties => {
    let objectType = Object.keys(ControllerType as any)
      .filter(
        (t) =>
          t != "DataTable" && !_.isNumber(ControllerType[t as any]) == false
      )
      .map((t) => {
        return { value: t, label: t };
      });

    let actions: ActionsProps[] = [
      {
        iconName: IconName.Settings,
        label: "Settings",
        id: "Settings",
        onClick: (row, that) => {},
        isColAction: false,
      },
    ];
    let RenderElement = [
      FastDataComponent.TextData("id", "id", "Id", "", "id"),
      FastDataComponent.TextData("name", "name", "name", "", "name"),
      FastDataComponent.TextData("header", "header", "header", "", "header"),
      FastDataComponent.BooleanData(
        "isNotDelete",
        "isNotDelete",
        "Is NotDelete",
        null,
        "indeterminate"
      ),
      FastDataComponent.BooleanData(
        "isNotPage",
        "isNotPage",
        "Is NotPage",
        null,
        "indeterminate"
      ),
      FastDataComponent.BooleanData(
        "isNotSort",
        "isNotSort",
        "Is NotSort",
        null,
        "indeterminate"
      ),
      FastDataComponent.BooleanData(
        "filterTypeLabelExcelModeIsShow",
        "filterTypeLabelExcelModeIsShow",
        "Is filterTypeLabelExcelModeIsShow",
        null,
        "indeterminate"
      ),
      FastDataComponent.Select(
        "filterType",
        "filterType",
        "filterType",
        [
          { value: "multiple", label: "multiple" },
          { value: "single", label: "single" },
        ],
        { value: "multiple", label: "multiple" },
        "filterType"
      ),
      FastDataComponent.Select(
        "editmode",
        "editmode",
        "editmode",
        [
          { value: "none", label: "none" },
          { value: "excel", label: "excel" },
          { value: "modal", label: "modal" },
        ],
        { value: "modal", label: "modal" },
        "editmode"
      ),
      FastDataComponent.NumberData(
        `maxHeight`,
        `maxHeight`,
        "maxHeight",
        500,
        `maxHeight`
      ),
      FastDataComponent.BooleanData(
        "selectableRows",
        "selectableRows",
        "selectableRows",
        true,
        "selectableRows",
        true
      ),
      FastDataComponent.BooleanData(
        "selectableRowsSingle",
        "selectableRowsSingle",
        "selectableRowsSingle",
        null,
        "selectableRowsSingle",
        true
      ),
      FastDataComponent.Select(
        "returntype",
        "returntype",
        "returntype",
        [
          { value: "data", label: "data" },
          { value: "advance", label: "advance" },
        ],
        { value: "advance", label: "advance" },
        "returntype"
      ),
      FastDataComponent.DataList(
        [
          { columnName: "dataKey", dataKey: "dataKey" },
          { columnName: "columnName", dataKey: "columnName" },
          {
            columnName: "columnIndex",
            dataKey: "columnIndex",
            columnControllerType: ControllerType.InputNumber,
            columnControllerProps: { type: "number" } as InputNumberProps,
          },
          {
            columnName: "Type",
            dataKey: "columnControllerType",
            columnControllerType: ControllerType.Select,
            columnControllerProps: {
              options: objectType as any,
              returntype: "value",
            } as SelectProps,
          },
          {
            columnName: "isHidden",
            dataKey: "isHidden",
            columnControllerType: ControllerType.Checkbox,
            columnControllerProps: { indeterminate: true },
          },
          {
            columnName: "isNotEdit",
            dataKey: "isNotEdit",
            columnControllerType: ControllerType.Checkbox,
            columnControllerProps: { indeterminate: true },
          },
          {
            columnName: "isNotFilter",
            dataKey: "isNotFilter",
            columnControllerType: ControllerType.Checkbox,
            columnControllerProps: { indeterminate: true },
          },
          {
            columnName: "isNotInsert",
            dataKey: "isNotInsert",
            columnControllerType: ControllerType.Checkbox,
            columnControllerProps: { indeterminate: true },
          },
          {
            columnName: "isNotSort",
            dataKey: "isNotSort",
            columnControllerType: ControllerType.Checkbox,
            columnControllerProps: { indeterminate: true },
          },
        ],
        "columns",
        "columns",
        [],
        500,
        actions,
        (row, dataKey) => {
          if (dataKey == "columnControllerType") {
            row.columnControllerProps = {};
          }
        }
      ),
      ...FastDataComponent.ControllerBase(),
      ...FastDataComponent.iLayoutTypeProps(false),
    ];
    return {
      RenderElement: RenderElement,
      FormName: FastDataComponent.LoopGetFormName(RenderElement),
    };
  },
};
