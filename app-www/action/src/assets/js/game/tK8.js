
import {Col1, simpleTrend, getDXDS, summaryTrend} from "./tCommon";

let selectData = [
    {name:'和值1',value:[{name:'大小单双', cols: ['和值', '单', '双', '大', '小', '和', '大单', '大双', '小单', '小双']}], 
        summary: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    },
    {name:'和值2', value:[{name:'五行', cols: ['和值', '金', '木', '水', '火', '土']}], summary: [0, 1, 1, 1, 1, 1]
    },
    {name:'奇偶上下', value:[{name:'个数比', cols: ['奇偶个数', '奇', '和', '偶', '上下个数', '上', '中', '下']}], 
        summary: [0, 1, 1, 1, 0, 1, 1, 1]
    }
];
let groupName = selectData[0].name;
let method = selectData[0].value[0];
let C1 = {'大': 1, '单': 1};
let BIG = 810;

let K8 = {
    nums: ['1', '2', '3', '4', '5', '6'],
    selectBits: [1,0,0],
    wUnit: 38,
    
    selectData: selectData,
    changeMethod: function (group, row) {
        if (row) {
            this.selectBits = row.value;
            groupName = group;
            method = row;
        }
        let columns = [Col1];
        let wCell = (window.screen.width - 55) / method.cols.length;
        method.cols.forEach(d => {
            columns.push({ title: d, width: wCell, align: 'center', cellAlign:'center'});
        });
        return columns;
    },
    getHZ1 (lines) {
        let cls = ['th10', 'th2', 'th6', 'th8', 'th9', 'th5', 'th7', 'th3', 'th4', 'th0'];
        let last = {};
        let DXDS = ['大单', '大双', '小单', '小双'];
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let sum = codes.reduce((a, b) => a + parseInt(b), 0);
            let item = [{'cls': cls[0], 'numb': sum, 'times': 0}];
            let flags = [sum % 2 ? '单' : '双', sum >= BIG ? '大' : '小', sum == BIG];      
            let f4 = flags[1] + flags[0];

            // 大小单双
            let ds = getItem(last, '0', flags[0], [cls[1], cls[2]]);
            let dx = getItem(last, '1', flags[1], [cls[3], cls[4]]);
            item.push(ds[0], ds[1], dx[0], dx[1]);

            // 和
            let se = last['2'] ? (last['2'].flag == flags[2] ? last['2'].numb + 1 : 1) : 1;
            last['2'] = {flag: flags[2], numb: se};
            item.push({'cls': flags[2] ? cls[5] : '', 'numb': flags[2] ? '和': se, 'times': 0});
            
            // 后四
            let cp = DXDS.map((e, j) => {
                let v = (f4 == e) ? e : (last['3'] ? (last['3'].flag == e ? 1 : last['3'].numbs[j] + 1): 1);
                item.push({'cls': f4 == e ? cls[6 + j] : '', 'numb': v, 'times': 0});
                return v;
            });
            last['3'] = {flag: f4, numbs: cp};

            e['item'] = item;
        });
        return lines;
    },
    _updateItems: function (lines, groupName) {
        let [$this, g] = [this, groupName];
        if (g == '和值1') return this.getHZ1(lines);

        // if (g == '和值2') return getDXDS.apply(this, [lines, g]);
        // if (g == '奇偶上下') return this.getHZXT(lines);
    },
    updateItems: function (srcLines, groupName) {
        let lines = this._updateItems(srcLines, groupName);

        return summaryTrend.apply(this, [lines, groupName]);
    }
};

// 二列互补统计通用逻辑
function getItem (last, key, flag, cls) {
    let numb = last[key] ? (last[key].flag == flag ? last[key].numb + 1 : 1) : 1;
    let cp = (flag in C1) ? [flag, numb] : [numb, flag];
    last[key] = {flag: flag, numb: numb};
    return [
        {'cls': (flag in C1) ? cls[0] : '', 'numb': cp[0], 'times': 0},
        {'cls': (flag in C1) ? '' : cls[1], 'numb': cp[1], 'times': 0}
    ];
}

export default K8;