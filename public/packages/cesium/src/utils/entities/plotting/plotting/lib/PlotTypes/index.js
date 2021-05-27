const PlottingTypes = {
    POINT_MARKER: 100,          // Y |100|MARKER|点|
    POLYLINE: 101,              // N |101|POLYLINE|线|
    CURVE: 102,                 // N |102|CURVE|曲线|
    FREEHAND_LINE: 103,         // N |103|FREEHAND_LINE|自由线|
    POLYGON: 104,               // Y |104|POLYGON|面|
    FREEHAND_POLYGON: 105,      // N |105|FREEHAND_POLYGON|自由面|
    CIRCLE: 106,                // Y |106|CIRCLE|圆|
    ELLIPSE: 107,               // Y |107|ELLIPSE|椭圆|
    RECTANGLE: 108,             // Y |108|RECTANGLE|矩形|
    ARC: 109,                   // N |109|ARC|弓形线|
    CLOSED_CURVE: 110,          // Y r|110|CLOSED_CURVE|闭合曲面|
    LUNE: 111,                  // N |111|LUNE|弓形|
    SECTOR: 112,                // Y |112|SECTOR|扇形|
    GATHERING_PLACE: 113,       // Y |113|GATHERING_PLACE|集结地|
    ASSAULT_DIRECTION: 114,     // Y |114|ASSAULT_DIRECTION|粗单直箭头|
    ATTACK_ARROW: 115,          // Y |115|ATTACK_ARROW|进攻方向|
    TAILED_ATTACK_ARROW: 116,   // Y |116|TAILED_ATTACK_ARROW|进攻方向（尾）|
    SQUAD_COMBAT: 117,          // Y |117|SQUAD_COMBAT|分队战斗行动|
    TAILED_SQUAD_COMBAT: 118,   // Y |118|TAILED_SQUAD_COMBAT|分队战斗行动（尾）|
    FINE_ARROW: 119,            // Y |119|FINE_ARROW|细单直箭头|
    DOUBLE_ARROW: 120,          // Y |120|DOUBLE_ARROW|钳击|
    RECTANGLE_FLAG: 121,        // Y |121|DOUBLE_ARROW|矩形旗|
    TRIANGLE_FLAG: 122,         // Y |122|DOUBLE_ARROW|三角旗|
    WAVE_FLAG: 123,             // Y |123|DOUBLE_ARROW|波浪旗|
}
export default PlottingTypes
