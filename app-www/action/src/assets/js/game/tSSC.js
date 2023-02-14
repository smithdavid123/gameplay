
import {Col1, simpleTrend, getDXDS, summaryTrend} from "./tCommon";

let names = ['万', '千', '百', '十', '个'];
let C1 = {'大': 1, '单': 1};
let groupName = '单号走势';
let method = {name:'万位',value:[1,0,0,0,0]};

let SSC = {
    nums: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    selectBits: [1,0,0,0,0],
    wUnit: 38,
    BIG: 5,
    selectData: [
        {name:'单号走势',value:[{name:'万位',value:[1,0,0,0,0]},{name:'千位',value:[0,1,0,0,0]},{name:'百位',value:[0,0,1,0,0]},
          {name:'十位',value:[0,0,0,1,0]},{name:'个位',value:[0,0,0,0,1]}], summary: 'all'
        },
        {name:'多号走势', value:[{name:'五星',value:[1,1,1,1,1]},{name:'后四',value:[0,1,1,1,1]},{name:'前四',value:[1,1,1,1,0]},
            {name:'后三',value:[0,0,1,1,1]}, {name:'中三',value:[0,1,1,1,0]}, {name:'前三',value:[1,1,1,0,0]}, 
            {name:'后二',value:[0,0,0,1,1]}, {name:'前二',value:[1,1,0,0,0]}], summary: 'all'
        },
        {name:'大小走势', value:[{name:'前三',value:[1,1,1,0,0]}, {name:'后三',value:[0,0,1,1,1]}], 
            summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'单双走势', value:[{name:'前三',value:[1,1,1,0,0]}, {name:'后三',value:[0,0,1,1,1]}],
            summary: [0, 0, 0, 1, 1, 1, 1, 1, 1]},
        {name:'五星和值', value:[{name:'大小单双',value:[1,1,1,1,1]}], summary: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1]},
        {name:'和值', value:[{name:'各类',value:[1,1,1,1,1]}], summary: null},
        {name:'跨度', value:[{name:'各类',value:[1,1,1,1,1]}], summary: null},
        {name:'龙虎和', value:[{name:'万千|万百',value:[0,1,0,2]}, {name:'万十|万个',value:[0,3,0,4]}, 
          {name:'千百|千十',value:[1,2,1,3]}, {name:'千个|百十',value:[1,4,2,3]}, {name:'百个|十个',value:[2,4,3,4]}],
          summary: [0, 0, 1, 1, 1, 0, 0, 1, 1, 1]
        },
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
                columns.push({ title: d, width: (window.screen.width - 55) / 10, align: 'center', cellAlign:'center'});
            });
        } else if (group == '大小走势' || group == '单双走势') {
            this.wUnit = (window.screen.width - 55) / 9;
            row.value.forEach((d, i) => {
                if (d) columns.push({ title: names[i], width: this.wUnit, align: 'center', cellAlign:'center'});
            });
            row.value.forEach((d, i) => {
                if (d) columns.push({ title: names[i] + "位", width: this.wUnit, align: 'center', 
                    cellAlign:'center', colspan: 2});
            });
        } else if (group == '五星和值') {
            this.wUnit = (window.screen.width - 55) / 10;
            names.forEach(d => {
                columns.push({ title: d, width: this.wUnit });
            });
            columns.push({ title: '五星和值', width: this.wUnit });
            columns.push({ title: '和值形态', width: this.wUnit, colspan: 4 });
        } else if (group == '和值') {
            this.wUnit = (window.screen.width - 55) / 10;
            names.concat(['前二和值', '前三和值', '中三和值', '后三和值', '后二和值']).forEach(d => {
                columns.push({ title: d, width: this.wUnit });
            });
        } else if (group == '跨度') {
            this.wUnit = (window.screen.width - 55) / 10;
            names.concat(['前二跨度', '前三跨度', '中三跨度', '后三跨度', '后二跨度']).forEach(d => {
                columns.push({ title: d, width: this.wUnit });
            });
        }  else if (group == '龙虎和') {
            this.wUnit = (window.screen.width - 55) / 10;
            let v = row.value;
            [names[v[0]], names[v[1]], '龙', '和', '虎', names[v[2]], names[v[3]], '龙', '和', '虎'].forEach(d => {
                columns.push({ title: d, width: this.wUnit });
            });
        }
        
        return columns;
    },
    getWXHZ (lines) {
        let last = [null, null];
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let sum = 0;
            let item = codes.map(d => {
                sum += parseInt(d);
                return {'high': 0, 'numb': d, 'times': 0};
            });
            let [flag1, flag2] = [sum < 23 ? '小' : '大', sum % 2 ? '单' : '双'];
            let numb1 = last[0] ? (last[0].flag == flag1 ? last[0].numb + 1 : 1) : 1;
            let numb2 = last[1] ? (last[1].flag == flag2 ? last[1].numb + 1 : 1) : 1;
            let cp1 = (flag1 in C1) ? [flag1, numb1] : [numb1, flag1];
            let cp2 = (flag2 in C1) ? [flag2, numb2] : [numb2, flag2];
            last = [{flag: flag1, numb: numb1}, {flag: flag2, numb: numb2}];
            item.push({'cls': 'tha', 'numb': sum, 'times': 0});
            item.push({'cls': (flag1 in C1) ? 'th1' : '', 'numb': cp1[0], 'times': 0});
            item.push({'cls': (flag1 in C1) ? '' : 'th2', 'numb': cp1[1], 'times': 0});
            item.push({'cls': (flag2 in C1) ? 'th3' : '', 'numb': cp2[0], 'times': 0});
            item.push({'cls': (flag2 in C1) ? '' : 'th4', 'numb': cp2[1], 'times': 0});
            e['item'] = item;
        });
        return lines;
    },
    getHZKD (lines, g) {
        let cls = ['th0', 'th2', 'th5', 'th6', 'th3'];
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let item = codes.map(d => ({'high': 0, 'numb': d, 'times': 0}));
            [[0, 1], [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4]].forEach((ds, j) => {
                let value = (g == '跨度') ? kuadu(codes, ds) : ds.reduce((a, b) => a + parseInt(codes[b]), 0);
                item.push({'cls': cls[j], 'numb': value, 'times': 0});
            });
            e['item'] = item;
        });
        return lines;
    },
    getLHH (lines) {
        let LHH = ['龙', '和', '虎'];
        let cls = ['th0', 'th4', 'th3'];
        let last = [null, null];
        lines.forEach(function (e, i) {
            let codes = e.code.split(','); 
            let v = method.value;
            let flags = [longhu(codes, [v[0], v[1]]), longhu(codes, [v[2], v[3]])];
            let cps = flags.map((f, j) => {
                let cp = [0, 1, 2].map(e => {
                    return f == e ? LHH[e] : (last[j] ? (last[j].flag == e ? 1 : last[j].numbs[e] + 1): 1);
                });
                last[j] = {flag: f, numbs: cp};
                return cp;
            }); 
            let item = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(j => {
                let [m, n] = [j < 6 ? 0 : 1, j % 5 - 2];
                if ((j % 5) < 2 ) return {'high': 0, 'numb': codes[v[parseInt(j / 5) * 2 + j % 5]], 'times': 0};
                return {'cls': n == last[m].flag ? cls[n] : '', 'numb': cps[m][n], 'times': 0};
            });
            e['item'] = item;
        });
        return lines;
    },
    _updateItems: function (lines, groupName) {
        let [$this, g] = [this, groupName];
        if (g == '单号走势' || g == '多号走势') return simpleTrend.apply(this, [lines]);
        if (g == '大小走势' || g == '单双走势') return getDXDS.apply(this, [lines, g]);
        if (g == '五星和值') return this.getWXHZ(lines);
        if (g == '和值' || g == '跨度') return this.getHZKD(lines, g);
        if (g == '龙虎和') return this.getLHH(lines);
    },
    updateItems: function (srcLines, groupName) {
        let lines = this._updateItems(srcLines, groupName);
        
        return summaryTrend.apply(this, [lines, groupName]);
    }
};

// 求数组指定区间跨度值
function kuadu (ary, part) {
    let [min, max] = [null, null];
    part.forEach(d => {
        d = parseInt(ary[d]);
        if (min == null) min = d;
        if (max == null) max = d;
        if (d < min) min = d;
        if (d > max) max = d;
    });
    return max - min;
}
// 龙和虎
function longhu (ary, part) {
    if (parseInt(ary[part[0]]) == parseInt(ary[part[1]])) return 1;
    return parseInt(ary[part[0]]) > parseInt(ary[part[1]]) ? 0 : 2;
}

export default SSC;