var initLottery = function () {
    var lottery = $('select[name="lottery"]');
    if (lottery.length > 0) {
        GameLotteryCtrl.request('STATIC_INFO', {
            success: function (res) {
                $.each(res, function (i, v) {
                    if(v.showName!="韩国时时彩" && v.showName!="东京时时彩"){
                    	lottery.append('<option value="' + v.shortName + '">' + v.showName + '</option>')
					}
                });
            }
        });
    }
};

var initDatePicker = function (element) {
    var datePicker = $('input[data-init="date-picker"]');
    if (element) {
        datePicker = element.find('input[data-init="date-picker"]');
    }
    if (datePicker.length > 0) {
        datePicker.datepicker({
            format: "yyyy-mm-dd",
            language: "zh-CN",
            orientation: "bottom auto",
            autoclose: true
        });
    }
};