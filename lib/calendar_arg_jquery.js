(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery' ], factory);
    }
    else {
        factory(jQuery);
    }
})(function($) {

    $.fn.argCalendar = function () {

        calendar = new Calendar();
        calendar.initialRender();
    };

    function Calendar() {
        var t = this;
        var header;
        var currentView;
        t.cal_days_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        t.cal_months_labels = ['January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];
        t.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        t.cal_current_date = new Date();
        t.month = t.cal_current_date.getMonth();
        t.year = t.cal_current_date.getFullYear();
        t.today = t.cal_current_date.getDate();
        t.activeMonth = t.month;

        t.firstDay = new Date(t.year, t.activeMonth, 1);
        t.startingDay = t.firstDay.getDay();
        t.monthLength = t.cal_days_in_month[t.activeMonth];

        t.monthName = t.cal_months_labels[t.activeMonth];
        t.argNationalDays = new Array();
        t.el = $('#calendar');

        t.initialRender = function () {
            loadArgDays();
            t.renderHeader();
            t.renderView();

        };

        t.renderHeader = function(){
            t.el.append('<div class="month">');
            $(".month").append('<div class="month-prev">');
            $(".month").append('<div class="month-title">');
            $(".month").append('<div class="month-next">');

            buttonPrev = $(
                '<button type="button" class="button">' + '<' + '</button>'
            ).click(function (ev) {
                buttonClickPrev(ev);
            });

            $(".month-prev").append(buttonPrev);
            $(".month-title").append('<span>' + t.monthName + '&nbsp;' + t.year + '</span>');

            buttonNext = $( // type="button" so that it doesn't submit a form
                '<button type="button">' + '>' + '</button>'
            ).click(function (ev) {
                buttonClickNext(ev);

            });
            $(".month-next").append(buttonNext);

            buttonClickPrev = function () {
                loadPrevMonth()
            };
            buttonClickNext = function () {
                loadNextMonth()
            };

        };

        t.renderView = function () {
            t.clearView();
            t.el.append('<div class="monthView">');
            $(".monthView").append('<table class="monthTable">');
            $(".monthView table").append('<thead class="weekdays">');
            $(".weekdays").append('<tr>');
            for (var i = 0; i < t.cal_days_labels.length; i++) {
                $(".weekdays tr").append('<th class="weekday">' + t.cal_days_labels[i] + '</th>');
            }
            var day = 1;
            $(".monthView table").append('<tbody class="days">');
            $(".days").append('<tr class="daysRow">');
            for (var j = 1; j < t.startingDay + t.monthLength; j++) {
                if (j >= t.startingDay) {
                    addDay(day)
                    day++;
                }
                else{
                    $(".days:last-child").append('<td>');
                }
                if(j%7 ===0){
                    $(".days").append('<tr class="daysRow">');
                }
            }
            t.addBottom();
        };

        t.clearView = function(){
            $(".monthView").remove();
            $(".bottom-explanation").remove();

        };

        t.addBottom = function(){
            var bottom = $('bottom-explanation')[0];
            if (!bottom) {
                var todayText = "This is today";
                var nationalHolidayText = "This is an argentinian national holiday"
                t.el.append('<div class="bottom-explanation">');
                $(".bottom-explanation").append('<table>');
                $(".bottom-explanation table").append('<tr class="bottom-explanation-day">');
                $(".bottom-explanation-day").append('<td class="botton-today">');
                $(".bottom-explanation-day").append('<td class="bottom-text">' + todayText + '</td>');
                $(".bottom-explanation-day").append('<td class="botton-national">');
                $(".bottom-explanation-day").append('<td class="bottom-text">' + nationalHolidayText + '</td>');
            }
          }

        function loadPrevMonth ()  {
            t.activeMonth = (t.month -1)%12
            if (t.activeMonth === -1){
                t.year = t.year -1;
                t.activeMonth = t.activeMonth + 12
            }
            t.month = t.activeMonth
            t.firstDay = new Date(t.year, t.activeMonth, 1);
            t.monthName = t.cal_months_labels[t.activeMonth];
            t.monthLength = t.cal_days_in_month[t.activeMonth];
            t.startingDay = t.firstDay.getDay();
            updateTitle(t.monthName  +' '+ t.year);
            t.renderView();
        };

        function loadNextMonth () {
            t.activeMonth = (t.month +1)%12
            t.month = t.activeMonth
            t.monthName = t.cal_months_labels[t.activeMonth]
            t.monthLength = t.cal_days_in_month[t.activeMonth];
            if (t.activeMonth === 0){
                t.year = t.year +1
            }
            t.firstDay = new Date(t.year, t.activeMonth, 1);
            t.startingDay = t.firstDay.getDay()
            updateTitle(t.monthName  +' '+ t.year)
            t.renderView();
        }

        function updateTitle (text) {
            $('.month-title')
                .text(text)
        }

        function addDay(day){
            var dayType = 'regular';
            if (isToday(day)){
                dayType = 'today'
            }

            if (isNationalDay(day)){
                dayType = 'national'
            }
            $(".days:last-child").append('<td class="days-cell-'+ dayType +'">'+ day +'</td>');

        }

        function isToday(day){
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth();
            var currentYear = currentDate.getFullYear();
            var today = currentDate.getDate();

            if (t.year == currentYear && t.month == currentMonth && day == today){
                return true;
            }
            else{
                return false;
            }
        }

        function isNationalDay(day){
            var realMonth = t.month + 1; // Array of months starts from 0
            for (var i = 0; i < t.argNationalDays.length; i++) {
                if (realMonth == t.argNationalDays[i]["month"] && day == t.argNationalDays[i]["day"] ){
                    return true;
                }
            }
        }

        function loadArgDays(){
            $.ajax({
                url: "http://nolaborables.com.ar/API/v1/actual"
            })
                .done(function( data ) {
                    $.each(data, function(i, item) {
                        t.argNationalDays.push(new nationalDay(item["dia"], item["mes"], item["motivo"]));
                    });
                });
        }

        var nationalDay = function (day, month, reason){
            this.day = day;
            this.month = month;
            this.reason = reason;
        }

    }

});

