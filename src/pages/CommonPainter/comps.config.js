import MultiPoint from "./compontents/MultiPoint";
import RectangularFace from "./compontents/RectangularFace";
import SinglePoint from "./compontents/SinglePoint";

const COMP_CONFIG = [{
    msg: '单点绘制',
    comp: SinglePoint
}, {
    msg: '多点绘制',
    comp: MultiPoint
}, {
    msg: '简单面绘制',
    comp: RectangularFace
}];

export default COMP_CONFIG;