import React from "react";
import './index.scss';
import COMP_CONFIG from "./comps.config";

const CommonPainter = () => {

    return <div className='common-painter'>
        {
            COMP_CONFIG.map(({msg, comp}, index) => {
                const Comp = comp;
                return <div className='painter-container' key={index} title={msg}>
                    <Comp/>
                </div>
            })
        }
    </div>
}
export default CommonPainter;