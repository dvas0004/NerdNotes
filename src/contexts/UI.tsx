import React from 'react'

const UIContext = React.createContext({
    label: "",
    changeLabel: (s: string) => {}
})

export default UIContext