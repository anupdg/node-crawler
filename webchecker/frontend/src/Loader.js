import React from 'react'

export default function Loader(props) {
    return (
        <React.Fragment>
            {props.loading && <div className="lds-container"><div className="center"><div className="lds-roller"><div /><div /><div /><div /><div /><div /><div /><div /></div></div></div>}
        </React.Fragment>
    )
}
