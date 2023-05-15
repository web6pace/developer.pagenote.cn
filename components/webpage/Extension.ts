import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'

import Component from './LightItem'

export default Node.create({
    name: 'lightItem',

    group: 'block',

    content: 'inline*',

    // atom: true,

    addAttributes(this) {
        return {
            light: {
                default: {},
            },
            lightId:{
                default: '',
            }
        }
    },

    parseHTML() {
        return [
            {
                tag: 'light-item',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['light-item', mergeAttributes(HTMLAttributes), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(Component)
    },
})
