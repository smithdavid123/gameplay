
export let Col1 = { title: '期数', width: 55, align: 'center', cellAlign:'center'};
let C1 = {'大': 1, '单': 1};
// let names = ['万', '千', '百', '十', '个'];


// 单号多号
export function simpleTrend (lines) {
    let $this = this;
    let notAppear = $this.nums.reduce((a, b) => { a[b] = 0; return a; }, {});
    lines.forEach(function (e, i) {
      let codes = e.code.split(',').filter((d, i) => $this.selectBits[i]).map(d => parseInt(d).toString());
      // 全局累加
      let cache = new Set(codes);
      $this.nums.forEach(d => {
        notAppear[d] = cache.has(d) ? 0 : notAppear[d] + 1;
      });
      // 单行赋值
      let ec = {};
      let item = $this.nums.map((d, i) => {
        ec[d] = i;
        return {'high': 0, 'numb': notAppear[d], 'times': 0};
      });
      // 开奖号码
      codes.forEach(d => {
        item[ec[d]].high = 1;
        item[ec[d]].times++;
        item[ec[d]].numb = d;
      });
      e['item'] = item;
    });
    return lines;
};

// 大小单双
export function getDXDS (lines, g) {
    let $this = this;
    let last = {};
    lines.forEach(function (e, i) {
        let codes = e.code.split(','); 
        let item = [];
        codes.forEach((d, j) => {
            if ($this.selectBits[j]) item.push({'high': 0, 'numb': d, 'times': 0});
        })
        codes.forEach((d, j) => {
            if (!$this.selectBits[j]) return;
            d = parseInt(d);
            let flag = (g == '单双走势') ? (d % 2 ? '单' : '双') : (d < $this.BIG ? '小' : '大');
            let numb = last[j] ? (last[j].flag == flag ? last[j].numb + 1 : 1) : 1;
            let cp = (flag in C1) ? [flag, numb] : [numb, flag];
            last[j] = {flag: flag, numb: numb};
            item.push({'cls': (flag in C1) ? 'th1' : '', 'numb': cp[0], 'times': 0});
            item.push({'cls': (flag in C1) ? '' : 'th2', 'numb': cp[1], 'times': 0});
        })
        e['item'] = item;
    });
    return lines;
};

export function summaryTrend (lines, groupName) {
  let summary = null;
  for (let i = 0; i < this.selectData.length; i++ ) {
      if (this.selectData[i].name == groupName) {
          summary = this.selectData[i].summary;
          break;
      }
  }
  if (!summary) return lines;
  // 出现次数、最大连出、最大遗漏
  let [sHigh, mSerial, serial, sFlags, mMiss, amLast, amMiss, amTimes] = [[], [], [], [], [], [], [], []];
  lines.forEach((line, i) => {
      if (sHigh.length == 0) {
          line.item.map((d, j) => {
              let v = (summary == 'all' || summary[j]) ? 0 : '空';
              sHigh.push(v); 
              serial.push(v);  
              mSerial.push(v);
              sFlags.push(v);
              mMiss.push(v);
              amLast.push(v);
              amMiss.push(v);
              amTimes.push(v);
          })
      }
      line.item.forEach((d, j) => {
          if (summary == 'all' || summary[j]) { 
              let flag = d.high || (d.cls && d.cls != '');
              if (flag) {
                  sHigh[j]++;
                  // 连出统计
                  serial[j] = sFlags[j] ? serial[j] + 1 : 1;
                  // 最大连出统计
                  if (serial[j] > mSerial[j]) mSerial[j] = serial[j];
                  // 平均遗漏计算
                  if (amLast[j]) {
                    amMiss[j] += amLast[j];
                    amTimes[j]++;
                  }
                  amLast[j] = 0;
              } else {
                  // 最大遗漏统计
                  if (d.numb > mMiss[j]) mMiss[j] = d.numb;
                  amLast[j] = parseInt(d.numb);
              }
              // 连出状态记录
              sFlags[j] = flag;
          }
      });    
  });
  lines.push({'issue': '出现次数', 'item': sHigh.map(d => ({'numb': d})), 'special': 1});
  lines.push({'issue': '最大连出', 'item': mSerial.map(d => ({'numb': d})), 'special': 1});
  lines.push({'issue': '最大遗漏', 'item': mMiss.map(d => ({'numb': d})), 'special': 1});
  
  lines.push({'issue': '平均遗漏', 'item': 
    amMiss.map((d, i) => ({'numb': d == '空' ? '空' : parseInt((d || mMiss[i]) / (amTimes[i] || 2))})), 'special': 1
  });
  return lines;
}