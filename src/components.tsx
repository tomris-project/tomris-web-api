import * as Form from "./form";
import * as Button from "./components/button";
export { type ButtonProps, type IButtonRef } from "./components/button";
import { Icon, IconName } from "./components/icon/icon";
import { Input } from "./components/input";
export { type IInputRef, type InputProps, type InputType } from "./components/input";
import { Checkbox } from "./components/checkbox";
export { type ICheckboxRef, type CheckboxProps } from "./components/checkbox";
import { Select } from "./components/select";
export { type SelectProps, type ISelectRef } from "./components/select";
export * as Form from "./form";
export { type FormRef } from "./form";
import * as Screen from "./screen";
import { View } from "./hocs/withLayout";
export { Screen } 
export { type ScreenRef } from "./screen";
 
export const WebApi = {
  Form: Form,
  Screen : Screen,
  Button: Button.Button,
  Input: Input,
  Select: Select,
  Checkbox: Checkbox,
  Icon: Icon,
  IconName: IconName,
  View:View
};

