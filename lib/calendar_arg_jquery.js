(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'jquery' ], factory);
    }
    else {
        factory(jQuery);
    }
})(function($) {

    $.fn.argCalendar = function () {

        // Load at first the arg holidays through AJAX call and render the calendar for the 1st time
        calendar = new Calendar(); 
        calendar.loadArgDays();       
        calendar.initialRender();
    };

    function Calendar() {

        var t = this;
        // general public properties 
        t.cal_days_labels;
        t.cal_months_labels;
        t.cal_days_in_month;      
        t.month = '';
        t.year = '';
        t.today = '';       
        t.argNationalDays = [];        

        // properties to keep current state
        t.activeMonth;
        t.monthName;
        t.firstDay ;
        t.startingDay;
        t.monthLength;   
        t.leapYear;    
        
        // root html element to append the calendar to
        t.el = $('#calendar');

        // private constructor 
        var __construct = function(that) {
            //alert("Object Created.");
            that.cal_days_labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            that.cal_months_labels = ['January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'];       
            that.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];            
            
            var cal_current_date = new Date();
            that.month = cal_current_date.getMonth();
            that.year = cal_current_date.getFullYear();
            that.today = cal_current_date.getDate();
            that.activeMonth = that.month;
            that.monthName = that.cal_months_labels[that.activeMonth];
            that.monthLength = that.cal_days_in_month[that.activeMonth];
            if ((that.year%4) == 0){
                that.leapYear = true;
                that.cal_days_in_month[1] =29;
            }

            that.firstDay = new Date(that.year, that.activeMonth, 1);
            that.startingDay = that.firstDay.getDay();
            that.monthLength = that.cal_days_in_month[t.activeMonth];            

        }(this)

        // Do the initial render
        t.initialRender = function () {            
            t.renderHeader();
            t.renderView();

        };

        // Function to load national argentian holidays
        t.loadArgDays = function(){

            // Need to be Sync call. We need wait for the call to be completed, so the first calendar load already has accurate data
            jQuery.ajaxSetup({async:false})
            $.ajax({
                url: "http://nolaborables.com.ar/API/v1/actual",                
            })
                .done(function( data ) {                   
                    $.each(data, function(i, item) {
                        t.argNationalDays.push(new nationalDay(item["dia"], item["mes"], item["motivo"]));
                    });
                });
        }

        // Main functions to construct the HTML DOM and render the calendar

        // Function to render the header, that contains info about the month and buttons to navigate through the months
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

            buttonNext = $( 
                '<button type="button" class="button">' + '>' + '</button>'
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

        // Function to render the main view that list all days inside each month
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

        // Function to clear view before moving to another month
        t.clearView = function(){
            $(".monthView").remove();
            $(".bottom-explanation").remove();

        };

        // Adding the legend at the bottom of the page
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

        // Functions to move accross the months
        function loadPrevMonth ()  {
            t.activeMonth = (t.month -1)%12
            if (t.activeMonth === -1){
                t.year = t.year -1;                
                  // If entering a leap year, need to update feb data
                checkLeapYear(t.year); 
                t.activeMonth = t.activeMonth + 12
            }
            // Update variables and order a new render 
            t.month = t.activeMonth
            t.firstDay = new Date(t.year, t.activeMonth, 1);            
            t.monthName = t.cal_months_labels[t.activeMonth];
            t.monthLength = t.cal_days_in_month[t.activeMonth];
            calculateStartingDay(t.firstDay);         
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
                  // If entering a leap year, need to update feb data
                checkLeapYear(t.year);              
            }
            // Update variables and order a new render 
            t.firstDay = new Date(t.year, t.activeMonth, 1);            
            calculateStartingDay(t.firstDay);  
            updateTitle(t.monthName  +' '+ t.year)
            t.renderView();
        }

        // Date helper functins
        function calculateStartingDay(firstDay){
            var startingDay = firstDay.getDay();
            // Take into account that american weeks start on Sunday
            if (startingDay == 0){ 
                t.startingDay = 7;
            }
            else{
                t.startingDay = startingDay;
            }
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

        // Check if are in a LeapYear -> February has 29 days
        function checkLeapYear(year){
          if ((year%4) == 0){
                t.leapYear = true;
                t.cal_days_in_month[1] =29;
            }
            else{
                t.leapYear = false;
                t.cal_days_in_month[1] =28;
            }
        }

        // Function to determine if today is the current day
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

        // Function to loop through national holidays and determine whether we are in a national holiday
        function isNationalDay(day){
            var realMonth = t.month + 1; // Array of months starts from 0
            for (var i = 0; i < t.argNationalDays.length; i++) {
                if (realMonth == t.argNationalDays[i]["month"] && day == t.argNationalDays[i]["day"] ){
                    return true;
                }
            }
        }        

        // Object constructor to store the data relative to national holidays
        var nationalDay = function (day, month, reason){
            this.day = day;
            this.month = month;
            this.reason = reason;
        }

    }

});

