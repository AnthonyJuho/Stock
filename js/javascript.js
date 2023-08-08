var list = ['삼성전자', 'LG에너지솔루션', 'SK하이닉스', '삼성바이오로직스', 'POSCO홀딩스', '삼성전자우', 'LG화학', '삼성SDI', '현대차', 'NAVER', '포스코퓨처엠', '기아', '카카오', '셀트리온', '현대모비스', 'KB금융', '삼성물산', '신한지주', 'SK이노베이션', 'LG전자', '포스코인터내셔널', '삼성생명', '카카오뱅크', 'LG', '한국전력', 'HD현대중공업', '삼성화재', 'KT&G', '하나금융지주', '하이브'];


//설정
var number_of_item = 5;
var big_bounce = 250000;
var small_bounce = 10000;
var max_time = 10;
var start_price = 500000;
var chart_value_count = 50;
var start_property = 5000000;








//랜덤으로 고르는 함수
function getRandomArray(arr, numElements) {
    if (numElements > arr.length) {
      throw new Error("Number of requested elements exceeds array length.");
    }
    
    var shuffledArray = arr.slice(); // clone array
    for (var i = shuffledArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // 요소 위치 교환
    }
    
    return shuffledArray.slice(0, numElements);
}

//값을 배열에 밀어넣기
function AddChartValue(arr, newValue) {
    if (arr.length > 0) {
      // 배열 요소 한 칸씩 앞으로 옮기기
      for (var i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
      }
      
      // 맨 끝에 새로운 값을 추가
      arr[arr.length - 1] = newValue;
    }
}
//숫자 배열 만들기
function createNumberArray(n) {
    var numberArray = [];
    for (var i = 1; i <= n; i++) {
      numberArray.push(i);
    }
    return numberArray;
  }
//두 배열 합치기
function zipArrays(array1, array2) {
    if (array1.length !== array2.length) {
      throw new Error("Arrays must have the same length.");
    }
  
    var resultArray = [];
    for (var i = 0; i < array1.length; i++) {
      resultArray.push([array1[i], array2[i]]);
    }
  
    return resultArray;
  }
//배열에서 최솟값과 최댓값 찾기
  function findMin(arr) {
    if (arr.length === 0) {
      return undefined; //존재하지 않는 경우
    }
    
    var minValue = arr[0];
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] < minValue) {
        minValue = arr[i];
      }
    }
    
    return minValue;
  }
  
  function findMax(arr) {
    if (arr.length === 0) {
      return undefined; //존재하지 않는 경우
    }
    
    var maxValue = arr[0];
    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > maxValue) {
        maxValue = arr[i];
      }
    }
    
    return maxValue;
  }

//숫자 3칸마다 ','찍기
  function changeNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

//글자에 색입히기
function TextColor(text,color) {
    return "<label class='"+color+"'>"+text+"</label>";
}
//값 변화와 시간 확률함수
function getProbability() {

    var random = Math.random()*2-1;
    var value = Math.pow(random, 2);
    if(random <0) {
        value *= -1;
    }
    return value;

}

function getTime() {
    var random = Math.random();
    var value = (-Math.pow(random,2)+1)*(max_time/2);
    var random2 = Math.random();
    if(random2 <0.5) {
        value = max_time - value;
    }
    var result = Math.round(value);
    if(result == 0) {
        return getTime();
    } else {
        return result;
    }

}






//차트에 필요한 x축 배열 만들기
var x_array = createNumberArray(chart_value_count);
x_array.unshift("Time");



//차트 그리는 함수
google.charts.load('current', {'packages':['corechart']});

function drawChart(Info,i) {
    var y_array = Info.chart_array.slice();
    y_array.unshift(Info.name);
    var chart_data = zipArrays(x_array,y_array);
    var data = google.visualization.arrayToDataTable(chart_data);

    var options = {
        title: Info.name+" 주가",
        legend: {position: 'bottom'},
        vAxis: {
            minValue: findMin(y_array),
            maxValue: findMax(y_array)
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById("chart"+i));

    chart.draw(data, options);
}





//종목 div 만들기
var items = document.getElementById('items');
for(var i = 0; i<number_of_item; i++) {
    var item = document.createElement("div");
    item.setAttribute("class","item");
    item.setAttribute("id","item"+(i+1));
    items.appendChild(item);

}




//랜덤으로 종목 이름 고르기
var StockList = getRandomArray(list, number_of_item);


var startchartarray = new Array(chart_value_count).fill(start_price);
//종목 Object 생성
var subinfo = {
    name : '',
    startprice : start_price,
    price : start_price,
    future : 0,
    time : 0,
    now_time : 0,
    chart_array : 0,
    shares: 0
}

var Info = []
for(var i = 0; i<number_of_item; i++) {
    subinfo.name = StockList[i];
    subinfo.chart_array = startchartarray.slice();
    Info.push(Object.assign({}, subinfo));
}

//종목 div 배열 만들기
var itemList = [];
for(var i = 0; i<number_of_item; i++) {
    itemList.push(document.getElementById('item'+(i+1)));
}

//각 종목에 들어갈 부가적인 기능들
for(var i = 0; i < itemList.length; i++) {
    var item = itemList[i];

    var newP = document.createElement("label");

    newP.textContent = Info[i].name+" : "+Info[i].price;
    newP.setAttribute("id", "iteminfo"+(i+1));
    item.appendChild(newP);
    
    var buyall = document.createElement("button");
    buyall.setAttribute("id","buyall"+(i+1));
    buyall.innerHTML = "모두 사기";
    item.appendChild(buyall);

    var sellall = document.createElement("button");
    sellall.setAttribute("id","sellall"+(i+1));
    sellall.innerHTML = "모두 팔기";
    item.appendChild(sellall);

    var buy = document.createElement("button");
    buy.setAttribute("id","buy"+(i+1));
    buy.innerHTML = "사기";
    item.appendChild(buy);
    
    var sell = document.createElement("button");
    sell.setAttribute("id","sell"+(i+1));
    sell.innerHTML = "팔기";
    item.appendChild(sell);

    var select = document.createElement("select");
    var option = document.createElement("option");
    var option2 = document.createElement("option");
    option.setAttribute("value", "money");
    option.innerHTML = "금액";
    select.appendChild(option);
    option2.setAttribute("value", "count");
    option2.innerHTML = "주";
    select.appendChild(option2);
    select.setAttribute("id","select"+(i+1));
    item.appendChild(select);

    var number = document.createElement("input");
    number.setAttribute("type","number");
    number.setAttribute("min","0");
    number.setAttribute("step","1");
    number.setAttribute("id","number"+(i+1));
    item.appendChild(number);

    var noti = document.createElement("label");
    noti.setAttribute("id", "noti"+(i+1));
    item.appendChild(noti);


    var chart = document.createElement("div");
    chart.setAttribute("id","chart"+(i+1));
    item.appendChild(chart);
    
}









//주가 변동

 function UpdatePrice() {
    for(var i = 0;i < Info.length; i++) {

        var iteminfo = Info[i];

        if(iteminfo.time != -1) { //상장폐지인지 판단

            //변동 후
            if(iteminfo.now_time == iteminfo.time) {
                iteminfo.startprice = iteminfo.price;
                iteminfo.now_time = 0;
                iteminfo.time = getTime();
                iteminfo.future = Math.round(getProbability()*big_bounce);
            }
            
            //주가 변화
            var price = iteminfo.future/iteminfo.time;
            price = Math.round(price);
            iteminfo.startprice += price;
            price += Math.round(getProbability()*small_bounce);
            iteminfo.price = iteminfo.startprice+price;
            if(iteminfo.price <=0 ){
                iteminfo.time = -1;
                iteminfo.price="0";
            }
            iteminfo.now_time++;
            AddChartValue(iteminfo.chart_array, iteminfo.price);
            
            
        } else {
            //상장폐지 후
        }

    
    
    }
 }

//종목 보이기
function UpdateItem() {
    for(var i = 0; i< itemList.length; i++) {
        var p = document.getElementById('iteminfo'+(i+1));

        var price;

        if(Info[i].price == 0) {
            price = "상장폐지";
        } else {
            price = changeNumber(Info[i].price);
        }

        p.innerHTML = Info[i].name+" : "+price+"<br>- "+Info[i].shares+"주 보유";

        //차트 그리기
        
        google.charts.setOnLoadCallback(drawChart(Info[i],i+1));

    }

}



var mine = {
    balance : start_property,
    property : start_property
}


//자산 보이기
var balance = document.getElementById('balance');
var property = document.getElementById('property');

function UpdateProperty() {

    var price = 0;
    for(var i = 0;i<number_of_item;i++) {
        price += Info[i].shares * Info[i].price;
    }

    mine.property = mine.balance+price;

    balance.innerHTML = "보유 금액 : "+changeNumber(mine.balance)+"원";
    property.innerHTML = "보유 자산 : "+changeNumber(mine.property)+"원";
}





//사고 파는 기능 만들기

//input 배열 만들기
var inputs = {

}
for(var i = 1;i<=number_of_item;i++) {
    inputs['buyall'+i] = document.getElementById('buyall'+i);
    inputs['sellall'+i] = document.getElementById('sellall'+i);
    inputs['buy'+i] = document.getElementById('buy'+i);
    inputs['sell'+i] = document.getElementById('sell'+i);
    inputs['select'+i] = document.getElementById('select'+i);
    inputs['number'+i] = document.getElementById('number'+i);
    inputs['label'+i] = document.getElementById('noti'+i);
    
}

//기능

function Buy(i,count,label) {
    var price = Info[i].price;
    mine.balance -= count*price;
    Info[i].shares += count;
    label.innerHTML = Info[i].name+" "+count+"주를 구입하셨습니다. (보유 금액 "+TextColor("-"+changeNumber(count*price),'red')+"원, "+TextColor("+"+changeNumber(count),'green')+"주)";

}
function Sell(i,count,label) {
    var price = Info[i].price;
    mine.balance += count*price;
    Info[i].shares -= count;
    label.innerHTML = Info[i].name+" "+count+"주를 판매하셨습니다. (보유 금액 "+TextColor("+"+changeNumber(count*price),'green')+"원, "+TextColor("-"+changeNumber(count),'red')+"주)";

}

for(var index = 0;index<number_of_item;index++) {
    (function(i) {


        var buyall = inputs['buyall'+(i+1)];
        var buy = inputs['buy'+(i+1)];
        var sellall = inputs['sellall'+(i+1)];
        var sell = inputs['sell'+(i+1)];
        var select = inputs['select'+(i+1)];
        var number = inputs['number'+(i+1)];
        var label = inputs['label'+(i+1)];
    
        buyall.addEventListener("click", function() {

            if(Info[i].time != -1) {
                var price = Info[i].price;
                var count = Math.floor(mine.balance/price);
                Buy(i,count,label);
            }
        });
        sellall.addEventListener("click", function() {
            if(Info[i].time != -1) {
                var price = Info[i].price;
                var count = Info[i].shares;
                Sell(i,count,label);
            }
        });
        buy.addEventListener("click", function() {
            if(Info[i].time != -1) {
                var price = Info[i].price;
                var selectvalue = select.value;
                var numbervalue = number.value;
                console.log(selectvalue,numbervalue);
                if(selectvalue == "money") {
                    if(mine.balance >= numbervalue) {
                        var count = Math.floor(numbervalue/price);
                        Buy(i,count,label);
                    } else {
                        label.innerHTML = TextColor("금액이 부족합니다",'red');
                    }
                    console.log("금액");
                } else if(selectvalue == "count") {
                    console.log("주");
                    if(I)
                    Buy(i,count,label);
                }
            }
        });

    })(index);


}




//종목의 수익률 표시하기

//상장폐지 후 처리



//아래껀 어떻게 하는지 아직 ㅁㄹ
//저장 및 불러오기 - 아마도 file이나 DB이용할 예정

//로그인 기능


setInterval(() => {
    UpdatePrice();
    UpdateItem();
    UpdateProperty();
}, 1000);

