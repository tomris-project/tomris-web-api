import * as Form from "./form";
import * as Button from "./components/button";
export { type ButtonProps, type IButtonRef } from "./components/button";
import { Icon, IconName } from "./components/icon/icon";
import { Input } from "./components/input";
export { type IInputRef, type InputProps, type InputType } from "./components/input";
import { Checkbox } from "./components/checkbox";
export { type ICheckboxRef, type CheckboxProps } from "./components/checkbox";
import { Select, Radio } from "./components/select";
export { type SelectProps, type ISelectRef, type RadioProps, type IRadioRef } from "./components/select";
export * as Form from "./form";
export { type FormRef, type iFormProps } from "./form";
import * as Screen from "./screen";
import { View } from "./hocs/withLayout";
import { useUser } from "./context/userContext";
import MyApp, { DATA } from "./context/App";
import { DateView, IDateRef, DateTypeValue, DateProps } from "./components/date";
export { type IDateRef, type DateTypeValue, type DateProps }
import { PageContext } from "./context/pageContext";
export { CreateUser } from "./context/userContext";
export { Screen }
export { type ScreenRef, type iScreenProps } from "./screen";
import { InputNumber } from "./components/numberinput";
import { DataTable, useDataTable } from "./components/datatable";
export { type IDataTableProps, type DataTableValues, type IDataTableRef } from "./components/datatable";
import { TabMain, TabPanel, useTab } from "./tab/tab";
export { type IUTabMainRef } from "./tab/tab";
import { Confirm, Modal, useModal } from "./modal/modal";
import { AutoRender } from "./autorender/autorender"; 
import { Tree } from "./components/tree/tree";
import { DesignerPage } from "./autorender/designer";
export { type RenderProps, type RenderElement,type PropsApi } from "./autorender/autorender";
export { type IModalProps, type IModalRef, type UIModalRef } from "./modal/modal";
export { type ITabMainRef, type ITabMainProps, type ITabPanelProps } from "./tab/tab";
export { type InputNumberProps, type IInputNumberRef, type NumberInputType } from "./components/numberinput";
export { ControllerType } from "./utility/baseRef"
import   *  as Accordion   from "./accordion/accordion";
export { type IAccordionPanelProps, type IAccordionProps } from "./accordion/accordion";

export const WebApi = {
  AutoRender: AutoRender,
  DesignerPage:DesignerPage,
  Form: Form,
  Screen: Screen,
  Button: Button.Button,
  Tab: {
    TabMain: TabMain,
    TabPanel: TabPanel,
    useTab: useTab

  },
  Controller: {
    Input: Input,
    InputNumber: InputNumber,
    Select: Select,
    Radio: Radio,
    Checkbox: Checkbox,
    Date: DateView,
    DataTable: DataTable,
    useDataTable: useDataTable,
    Tree:Tree
  },
  Modal: {
    Modal: Modal,
    useModal: useModal,
    Confirm: Confirm
  },
  Accordion:Accordion,
  Icon: Icon,
  IconName: IconName,
  View: View,
  useUser: useUser,
  MyApp: {
    App: MyApp,
    DATA: DATA
  },
  PageContext: PageContext
};

