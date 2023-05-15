import {Step} from "@pagenote/shared/lib/@types/data";
import {Editor, NodeViewWrapper,NodeViewContent} from '@tiptap/react'
import React from "react";


export default function LightItem(props: { node: {attrs:{light: Partial<Step>,lightId?:string}}, editor: Editor }) {
    const {light={},lightId} = props.node.attrs || {};
    const editRef = React.useRef<HTMLDivElement>(null);
    function onclick() {
        console.log(editRef.current,'editRef.current');
        // props.editor.commands.focus('end',{
        //     scrollIntoView: true,
        // })
        // editRef.current.focus({preventScroll: true})
        const result = props.editor.commands.selectNodeBackward()
        console.log(result,'result');
        props.editor.commands.focus()
    }
    return (
        <NodeViewWrapper className="react-component-with-content">
            <div className="p-1 my-1" onClick={onclick} contentEditable={false}>
                <span className={'badge badge-xs'} style={{backgroundColor: light.bg}}></span>
                <span style={{borderColor: light.bg}} className={'border-b'}>
                <span>{light.text}</span>
                    {
                        light.images?.map((image, index) => (
                            <img key={index} className={'w-32 h-32'} src={image.src} alt={image.alt}/>
                        ))
                    }
                </span>
            </div>
            {/*<div ref={editRef}>*/}
            {/*    <NodeViewContent  className={'content'}/>*/}
            {/*</div>*/}
        </NodeViewWrapper>
    )
}
