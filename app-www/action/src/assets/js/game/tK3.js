
import {Col1, simpleTrend, getDXDS, summaryTrend} from "./tCommon";

let names = ['一', '二', '三'];
let groupName = '单号走势';
let method = {name:'一位',value:[1,0,0]};

let K3 = {
    nums: ['1', '2', '3', '4', '5', '6'],
    selectBits: [1,0,0],
    wUnit: 38,
    BIG: 4,
    selectData: [
        {name:'单号走势',value:[{name:'一位',value:[1,0,0]},{name:'二位',value:[0,1,0]},{name:'三位',value:[0,0,1]}],
          summary: 'all'
        },
        {name:'多号走势', value:[{name:'三码',value:[1,1,1]}, {name:'前二',value:[1,1,0]},{name:'后二',value:[0,1,1]}], 
            summary: 'all'
        },
        {name:'大小走势', value:[{name:'三码',value:[1,1,1]}], summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'单双走势', value:[{name:'三码',value:[1,1,1]}], summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'和值|形态', value:[{name:'三码',value:[1,1,1]}], summary: [0, 0, 0, 0, 1, 1, 1]}
    ],
    changeMethod: function (group, row) {
        if (row) {
            this.selectBits = row.value;
            groupName = group;
            method = row;
        }
        let columns = [Col1];
        if (group == undefined || group == '单号走势' || group == '多号走势') {
            this.nums.forEach(d => {
                columns.push({ title: d, width: (window.screen.width - 55) / 9, align: 'center', cellAlign:'center'});
            });
        } else if (group == '大小走势' || group == '单双走势') {
            this.wUnit = (window.screen.width - 55) / 9;
            row.value.forEach((d, i) => {
                if (d) columns.push({ title: names[i], width: this.wUnit, align: 'center', cellAlign:'center'});
            });
            row.value.forEach((d, i) => {
                if (d) columns.push({ title: "第" + names[i] + "位", width: this.wUnit, align: 'center', 
                    cellAlign:'center', colspan: 2});
            });
        } else if (group == '和值|形态') {
            this.wUnit = (window.screen.width - 55) / 10;
            names.concat(['和值', '三同号', '三不同号', '二同号']).forEach((d, i) => {
                columns.push({ title: d, width: i < 4 ? this.wUnit : this.wUnit * 2});
            });
        }

        return columns;
    },
    getHZXT (lines) {
        let cls = ['th3', 'th6', 'th2'];
        let last = null;
        let tps = ['三同号', '三不同号', '二同号'];
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let item = codes.map(d => ({'high': 0, 'numb': d, 'times': 0}));
            let sum = codes.reduce((a, b) => a + parseInt(b), 0)

            let flag = ['三同号', '二同号', '三不同号'][(new Set(codes)).size - 1];
            console.log((new Set(codes)).size);

            item.push({'cls': 'tha', 'numb': sum, 'times': 0});
            let cps = tps.map((d, j) => {
                let value = (d == flag) ? d : (last ? (last.flag == d ? 1 : last.numbs[j] + 1) : 1);
                item.push({'cls': (d == flag) ? cls[j] : '', 'numb': value, 'times': 0});
                return value;
            });
            last = {flag: flag, numbs: cps};
            
            e['item'] = item;
        });
        return lines;
    },
    _updateItems: function (lines, groupName) {
        let [$this, g] = [this, groupName];
        if (g == '单号走势' || g == '多号走势') return simpleTrend.apply(this, [lines]);
        if (g == '大小走势' || g == '单双走势') return getDXDS.apply(this, [lines, g]);
        if (g == '和值|形态') return this.getHZXT(lines);
    },
    updateItems: function (srcLines, groupName) {
        let lines = this._updateItems(srcLines, groupName);

        return summaryTrend.apply(this, [lines, groupName]);
    }
};


export default K3;