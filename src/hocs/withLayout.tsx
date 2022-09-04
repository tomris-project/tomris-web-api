import React from "react";
import { Col, Container, Row } from "reactstrap";

export interface ResponsiveType {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
}
export interface ResponsiveMainType {
    col: number
}
export class iLayoutTypeProps {
    spacer?: true | boolean
    responsiveSize?: ResponsiveMainType | ResponsiveType
    responsive?: ResponsiveType
}
export interface iLayout extends iLayoutTypeProps {
    children: React.ReactNode | React.ReactNode[] | JSX.Element | JSX.Element[]
}

export interface iLayoutExtend extends iLayout {
    classext?:string
}
export const withLayout = <T extends iLayout>(WrappedComponent: React.ComponentType<T>) => {

    const enhanced = React.forwardRef(<K extends T & iLayout & iLayoutExtend, P>(props: K, ref: P) => {
        let responsiveSize: ResponsiveType[] = [];
        let count = React.Children.count(props.children);
        if (props.responsiveSize == null || (props.responsiveSize as ResponsiveMainType).col != null) {
            let col = 12;
            if (props.responsiveSize != null)
                col = Math.ceil(12 / (props.responsiveSize as ResponsiveMainType)?.col);
            for (let index = 0; index < count; index++) {
                responsiveSize.push({ xs: 12, sm: 12, lg: col, md: col, xl: col })
            }
        } else {
            for (let index = 0; index < count; index++) {
                responsiveSize.push(props.responsiveSize as ResponsiveType);
            }
        }
        const children = (props: K) => {
            let element: JSX.Element[] = [];
            React.Children.forEach(props.children, (child: JSX.Element | React.ReactNode, index) => {
                let childJsx = child as JSX.Element;
                if (childJsx != null && childJsx.props != null && childJsx.props.responsive != null) {
                    responsiveSize[index] = childJsx.props.responsive;
                }
                element.push(<Col key={`colkey${index}`} {...responsiveSize[index]} className={props.classext??""}//style={{display:"grid",alignItems:"flex-end",width: "fit-content"}}
                >{child}</Col>)
                if (childJsx != null && childJsx.props != null && childJsx.props.spacer === true) {
                    element.push(<Col key={`colkeyspacer${index}`} xl="12" xs="12" xxl="12" lg="12" sm="12" md="12" >{" "}</Col>)
                }
            });
            return element;
        }
        return (<>
            <Col {...props.responsive}>
                <WrappedComponent  {...props} ref={ref} >
                    <Row>{children(props)}</Row>
                </WrappedComponent>
            </Col>
        </>)

    })
    return enhanced
}


export const View = withLayout((props: iLayoutExtend) => {

    return (<div>{props.children}</div>)
})