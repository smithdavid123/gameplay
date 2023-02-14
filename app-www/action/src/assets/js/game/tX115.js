
import {Col1, simpleTrend, getDXDS, summaryTrend} from "./tCommon";

let names = ['一', '二', '三', '四', '五'];
let groupName = '单号走势';
let method = {name:'第一名',value:[1,0,0,0,0]};
let hmds = ['5:0', '4:1', '3:2', '2:3', '1:4', '0:5'];

let X115 = {
    nums: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    selectBits: [1,0,0,0,0],
    wUnit: 38,
    BIG: 6,
    selectData: [
        {name:'单号走势',value:[{name:'第一名',value:[1,0,0,0,0]},{name:'第二名',value:[0,1,0,0,0]},{name:'第三名',value:[0,0,1,0,0]},
          {name:'第四名',value:[0,0,0,1,0]},{name:'第五名',value:[0,0,0,0,1]},{name:'中位',value:[0,0,1,0,0]}], summary: 'all'
        },
        {name:'多号走势', value:[{name:'五星',value:[1,1,1,1,1]}, {name:'前二',value:[1,1,0,0,0]},{name:'前三',value:[1,1,1,0,0]}], 
            summary: 'all'
        },
        {name:'大小走势', value:[{name:'一二三',value:[1,1,1,0,0]}, {name:'三四五',value:[0,0,1,1,1]}], 
            summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'单双走势', value:[{name:'一二三',value:[1,1,1,0,0]}, {name:'三四五',value:[0,0,1,1,1]}],
            summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'号码单双', value:[{name:'个数比',value:[1,1,1,1,1]}], summary: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]}
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
                columns.push({ title: d, width: (window.screen.width - 55) / 11, align: 'center', cellAlign:'center'});
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
        } else if (group == '号码单双') {
            this.wUnit = (window.screen.width - 55) / 11;
            names.concat(hmds).forEach(d => {
                columns.push({ title: d, width: this.wUnit });
            });
        }
        
        return columns;
    },
    getCommon (lines) {
        if (method.name == '中位') {
            lines.forEach(line => {
                line.code = line.code.split(",").map(d => parseInt(d)).sort((a, b) => a - b).join(",");
            });
        }
        return simpleTrend.apply(this, [lines]);
    },
    getHMDS (lines) {
        let cls = ['th0', 'th2', 'th5', 'th6', 'th3'];
        let last = null;
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let item = codes.map(d => ({'high': 0, 'numb': d, 'times': 0}));
            let ds = [0, 0];
            codes.forEach(d => { ds[parseInt(d) % 2]++; })
            let flag = ds[1] + ":" + ds[0];
            let cps = hmds.map((d, j) => {
                let value = (d == flag) ? d : (last ? (last.flag == d ? 1 : last.numbs[j] + 1) : 1);
                item.push({'cls': (d == flag) ? cls[j] : '', 'numb': value, 'times': 0});
                return value;
            });
            last = {flag: flag, numbs: cps};
            
            console.log(cps);
            e['item'] = item;
        });
        return lines;
    },
    _updateItems: function (lines, groupName) {
        let [$this, g] = [this, groupName];
        if (g == '单号走势' || g == '多号走势') return this.getCommon(lines);
        if (g == '大小走势' || g == '单双走势') return getDXDS.apply(this, [lines, g]);
        if (g == '号码单双') return this.getHMDS(lines);
    },
    updateItems: function (srcLines, groupName) {
        let lines = this._updateItems(srcLines, groupName);

        return summaryTrend.apply(this, [lines, groupName]);
    }
};

export default X115;