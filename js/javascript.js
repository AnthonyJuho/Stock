var korean = document.getElementById("korean");
var english = document.getElementById("english");
var math = document.getElementById("math");
var social = document.getElementById("social");
var science = document.getElementById("science");

var baseinfo = [];
for(let num = 0;num<30;num++) {
    baseinfo.push(0);
}

var pricechange = 50000;

var koreanInfo = {
    name : 'Korean',
    firstprice: 0,
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    },
    isdelist : false,
    priceinfo : [...baseinfo]
};
var englishInfo = {
    name : 'English',
    firstprice: 0,
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    },
    isdelist : false,
    priceinfo : [...baseinfo]
};
var mathInfo = {
    name : 'Math',
    firstprice: 0,
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    },
    isdelist : false,
    priceinfo : [...baseinfo]
};
var socialInfo = {
    name : 'Social',
    firstprice: 0,
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    },
    isdelist : false,
    priceinfo : [...baseinfo]
};
var scienceInfo = {
    name : 'Science',
    firstprice: 0,
    price: 100000,
    holding: 0,
    profit: {
        percent : 0,
        price : 0
    },
    isdelist : false,
    priceinfo : [...baseinfo]
};

let ElementArray = [korean,english,math,social,science];
let InfoArray = [koreanInfo,englishInfo,mathInfo,socialInfo,scienceInfo];

let interval = setInterval(function() {
    for(let num = 0;num<InfoArray.length;num++) {
        var Info = InfoArray[num];
        if(!Info.isdelist) {
            var random = Math.round(Math.random()*pricechange*2-pricechange);
            Info.price += random;
            if(Info.price <= 0) {
                Info.holding = 0;
                Info.profit.percent = 0;
                Info.profit.price = 0;
                Info.price = 0;
                Info.isdelist = true;
                DeList(Info);
                Info.priceinfo = [...baseinfo];
            } else {
                addStockInfo(Info.priceinfo,Info.price);
                if(holding > 0) {
                    Info.profit.percent = Info.price/Info.firstprice;
                    Info.profit.price = (Info.price-Info.firstprice)*Info.holding;
                }
            }
        }
        ShowDiv();
        google.charts.setOnLoadCallback(Chart);
    }
},1000);

function addStockInfo(array,price) {
    array.shift();
    array.push(price);
}

function DeList(info) {
    setTimeout(function() {
        info.price = 100000;
        info.isdelist = false;
    },5000);
}

function ShowDiv() {
    for(let num = 0;num<ElementArray.length;num++){
        var Element = ElementArray[num];
        var Info = InfoArray[num];
        for(let i = 0; i<= 3;i++) {
            var child = Element.childNodes[1].childNodes[1].childNodes[1].childNodes[2*i+1].childNodes[1];
            if(child.id == "price") {
                    var price = child;
            } else if(child.id == "holding") {
                    var holding = child;
            } else if(child.id == "profit") {
                    var profit = child;
            }
        }

        if(Info.isdelist) {
            price.innerText = "현재가: 성장폐지 ";
            holding.innerText = "보유: "+priceToString(Info.holding)+"주";
            profit.innerText = "이율: "+priceToString(setpoint(Info.profit.percent))+"% ("+priceToString(setpoint(Info.profit.price))+"원)"

        } else {
            price.innerText = "현재가: "+priceToString(setpoint(Info.price))+"원";
            holding.innerText = "보유: "+priceToString(Info.holding)+"주";
            profit.innerText = "이율: "+priceToString(setpoint(Info.profit.percent))+"% ("+priceToString(setpoint(Info.profit.price))+"원)"
        }

    }
}

function setpoint(number) {
    return Math.round(number*10)/10;
}

function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(Chart);

function Chart() {
    for(let num = 0;num<InfoArray.length;num++) {
        drawChart(InfoArray[num]);
    }
}

function drawChart(Info) {
    var dataArray = [['Time',Info.name]];
    for(let num = 0; num<Info.priceinfo.length;num++) {
       dataArray.push(
           [num+1,Info.priceinfo[num]]
        );
    }
    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: 'Stock',
        hAxis: {
            title: 'Year',
            baselineColor: 'white',
            titleTextStyle: {color: 'white'}
        },
        vAxis: {
            minValue: 0,
            maxValue: 200000
        },
        backgroundColor: {
            fill: '#222'
        }

    };

    var chart = new google.visualization.AreaChart(document.getElementById(Info.name+'_chart'));
    chart.draw(data, options);
}