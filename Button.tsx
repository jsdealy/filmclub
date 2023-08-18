import React from 'react'
export default function Button({onClick, id, display}: {onClick: React.MouseEventHandler<HTMLButtonElement>, id: string, display: string}) {
    return <button className="button-50" role="button" onClick={onClick} key={id} id={id}>{display}</button>
}
