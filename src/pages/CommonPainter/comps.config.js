import MultiPoint from "./compontents/MultiPoint";
import RectangularFace from "./compontents/RectangularFace";
import SinglePoint from "./compontents/SinglePoint";
import MultiColorPoint from "./compontents/MultipColorPoint";
import TextureMap from "./compontents/TextureMap";

const COMP_CONFIG = [
    {
        msg: '单点绘制',
        comp: SinglePoint
    },
    {
        msg: '多点单色',
        comp: MultiPoint
    },
    {
        msg: '简单面绘制',
        comp: RectangularFace
    },
    {
        msg: '多点异色,数据合一',
        comp: MultiColorPoint
    },
    {
        msg: '纹理贴图',
        comp: TextureMap
    }
];

export default COMP_CONFIG;
