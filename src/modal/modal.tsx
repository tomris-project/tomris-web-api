import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactDom from "react-dom/client";
import { Modal as ModalView, ModalHeader, ModalBody, ModalFooter, type ModalProps, Col, ButtonGroup } from 'reactstrap';
import { Button, ButtonCollor } from '../components/button';
import { WithController } from '../hocs/withController';

export type ModalSize = "sm" | "lg" | "xl";
export interface IModalProps {
    isOpen?: boolean,
    size?: ModalSize
    header?: string | React.ReactNode,
    body?: string | ((that: IModalRef) => React.ReactNode)
    footerbody?: (that: IModalRef) => React.ReactNode
    backdrop?: boolean
    hiddenCloseButton?: boolean
    autoClear?: boolean
    fullscreen?: boolean
    onChange?: (that: IModalRef, status: boolean) => boolean
    onOpen?: (that: IModalRef) => boolean
    onLoad?: (that: IModalRef) => void
    onClose?: (that: IModalRef) => boolean
}
export interface IModalRef {
    isOpen: (status: boolean) => Promise<void>
    toggle: () => void
    setBody: React.Dispatch<React.SetStateAction<string | React.ReactNode | ((that: IModalRef) => React.ReactNode)>>
}
export const Modal = WithController<IModalProps, IModalRef>(React.forwardRef((props: IModalProps, ref: React.ForwardedRef<IModalRef>) => {
    const [modal, setModal] = useState(props.isOpen);
    let [loaded] = useState(false);
    let [Body, setBody] = useState<any>(null);
    let [doneVal, setDone] = useState<any>(null);
    const thatevent: IModalRef = {
        isOpen: async (status: boolean) => {
            return new Promise((done) => {
                if (loaded == false && status == true) {
                    loaded = true;
                    props.onLoad?.(thatevent);
                }
                if (props.onChange?.(thatevent, status) === false) {
                    return;
                }
                if (status == true && props.onOpen?.(thatevent) === false) {
                    return;
                }
                if (status == false && props.onClose?.(thatevent) === false) {
                    return;
                }
                setModal(status);
                doneVal = done;
                setDone(doneVal);
            })

        },
        setBody: setBody,
        toggle: () => thatevent.isOpen(!modal)
    }
    useEffect(() => {
        if (modal == true && doneVal != null) {
            doneVal();
            doneVal = null;
        }
    }, [modal])
    React.useImperativeHandle(ref, () => (thatevent));
    return (
        <div>
            <ModalView keyboard={false} scrollable fullscreen={props.fullscreen} size={props.size ?? "lg"} isOpen={modal} toggle={thatevent.toggle} backdrop={props.backdrop == true ? "static" : true} unmountOnClose={props.autoClear !== false}>
                <ModalHeader close={props.hiddenCloseButton == true ? <span></span> : null} toggle={thatevent.toggle} title='selam'>{props.header}</ModalHeader>
                {Body != null && (
                    <ModalBody>
                        {React.isValidElement(Body) ? Body : (_.isString(Body) ? Body : (_.isFunction(Body) ? Body(thatevent) : ""))}
                    </ModalBody>)

                }
                {
                    Body == null && (
                        <ModalBody>
                            {_.isString(props.body) ? props.body : (_.isFunction(props.body) ? props.body(thatevent) : "")}
                        </ModalBody>)
                }
                {
                    (props.footerbody != null) && (
                        <ModalFooter>
                            {props.footerbody(thatevent)}
                        </ModalFooter>)
                }
            </ModalView>
        </div>
    );
}), "Modal")
export interface UIModalRef extends IModalRef {
    View: (props: IModalProps, refs?: React.ForwardedRef<IModalRef>) => JSX.Element
}
export const useModal = () => {
    let ref = useRef<IModalRef>(null);
    const enhanced = React.forwardRef((props: IModalProps, refs?: React.ForwardedRef<IModalRef>) => {
        if (refs != null)
            useEffect(() => {
                ref = refs as any
            }, [refs])
        else
            refs = ref;
        return <Modal {...props} ref={refs} />
    })
    let methods: UIModalRef = Object.create({});
    useEffect(() => {
        if (ref.current != null) {
            let keys = Object.keys(ref.current)
            for (let index = 0; index < keys.length; index++) {
                (methods as any)[keys[index]] = (ref.current as any)[keys[index]];
            }
        }

    }, [ref]);
    methods.View = enhanced;
    return useState(methods)[0]
}

export interface SelectOption {
    Label: string
    Value: any
    Position?: "Left" | "Right"
    Color?: ButtonCollor
}
export interface SelectConfirm {
    options: SelectOption[]
    body: string
    header: string
    ScreenCode: string
    FormCode: string
}

let root: ReactDom.Root = null;
const ConfirmSelect = async (props: SelectConfirm) => {
    let promise = new Promise<any>((done) => {

        if (typeof window === 'undefined') {
            return;
        }
        const SelectButton = (that: IModalRef, option: SelectOption) => { 
            that.isOpen(false);
            root.unmount()
            done(option.Value);
        }

        const Buttons = (that: IModalRef) => {
            let bodyFooter: { letf: any[], right: any[] } = { letf: [], right: [] };
            props.options.map((t,index) => {
                let c = <Button isLabelHidden color={t.Color} id={index.toString()} key={index.toString()} label={t.Label} onClick={() => { SelectButton(that, t) }} />;

                if ((t.Position ?? "Right") == "Right") {
                    bodyFooter.right.push(c);
                } else {
                    bodyFooter.letf.push(c);
                }


            })
            return (
                <div style={{ display: "flex", flex: 1 }}>
                    <Col>
                        <ButtonGroup>{bodyFooter.letf}</ButtonGroup>
                    </Col>
                    <Col>
                        <div style={{ float: "right" }}>
                            <ButtonGroup>{bodyFooter.right}</ButtonGroup>
                        </div>
                    </Col>
                </div>)

        }
        const view = (<Modal
            autoClear
            hiddenCloseButton
            size={props.options.length > 2 ? "lg" : "sm"}
            backdrop
            isOpen={true}
            body={props.body}
            header={props.header}
            footerbody={Buttons}
        />);
        root = ReactDom.createRoot(document.createElement('div'));
        root.render(view);
    })
    return await promise;
}
export const Confirm = {
    ConfirmSelect: ConfirmSelect,
    ConfirmBoolean: async (Header: string, Body: string, TrueButton: string, FalseButton?: string, ScreenCode?: string, FormCode?: string) => {
        let obj: SelectConfirm = {
            ScreenCode: ScreenCode,
            body: Body,
            FormCode: FormCode,
            header: Header,
            options: [
                { Label: TrueButton, Value: true, Color: "success", Position: "Left" }
            ]
        };
        if (FalseButton != null) {
            obj.options.push({ Label: FalseButton, Value: false, Color: "danger", Position: "Right" });
        }
        return await ConfirmSelect(obj)
    },
}