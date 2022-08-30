import * as Form from "./form";
import * as Button from "./components/button";
export { type ButtonProps, type IButtonRef } from "./components/button";
import { Icon, IconName } from "./components/icon/icon";
import { Input } from "./components/input";
export { type IInputRef, type InputProps, type InputType } from "./components/input";
import { Checkbox } from "./components/checkbox";
export { type ICheckboxRef, type CheckboxProps } from "./components/checkbox";
import { Select,Radio } from "./components/select";
export { type SelectProps, type ISelectRef ,type RadioProps, type IRadioRef } from "./components/select";
export * as Form from "./form";
export { type FormRef } from "./form";
import * as Screen from "./screen";
import { View } from "./hocs/withLayout";
import { useUser } from "./context/userContext";
import MyApp, { DATA } from "./context/App";
import { DateView,IDateRef,DateTypeValue,DateProps  } from "./components/date";
export { type IDateRef,type DateTypeValue ,type DateProps  }  
import { PageContext } from "./context/pageContext";
export { CreateUser } from "./context/userContext";
export { Screen }
export { type ScreenRef } from "./screen";

import { InputNumber } from "./components/numberinput";
import { DataTable } from "./components/datatable";
export { type InputNumberProps, type IInputNumberRef,type NumberInputType } from "./components/numberinput";

export {  ControllerType } from "./utility/baseRef"
export const WebApi = {
  Form: Form,
  Screen: Screen,
  Button: Button.Button,
  Controller: {
    Input: Input,
    InputNumber: InputNumber,
    Select: Select,
    Radio: Radio,
    Checkbox: Checkbox,
    Date: DateView,
    DataTable:DataTable
  },
  Icon: Icon,
  IconName: IconName,
  View: View,
  useUser: useUser,
  MyApp: {
    App: MyApp,
    DATA: DATA
  },
  PageContext:PageContext
};

