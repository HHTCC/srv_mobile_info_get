let lockMoss = function(){
    const myDate = new Date();
    let y = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    let m = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    let d = myDate.getDate();        //获取当前日(1-31)
    //用来存放随机的位置 数据判断不允许重复数字出现
    let randPosAry = [];
    let randNum = 0;
    const passwordLength = 10;
    //
    for (let i = 0; i < 5; i++) {
        //不重复随机 区间[1,9] 不需要0是因为防止第一位为0
        let rand_One_Nine = 0;
        do {
            rand_One_Nine = Math.floor(Math.random() * 9) + 1;
        } while (randPosAry.includes(rand_One_Nine));
        randPosAry.push(rand_One_Nine);
        //
        randNum *= 10;
        randNum += rand_One_Nine;
    }
    console.log(randPosAry, randNum);
    //固定算法刻度记录
    let calcArray = [];
    calcArray[0] =(y - m - d) % 10;
    calcArray[1] =(y + m + d) % 10;
    calcArray[2] =(y * m * d) % 10;
    calcArray[3] =(y + m * d) % 10;
    calcArray[4] =(y * m - d) % 10;
    let calcCount = 0;
    for (let i = 0; i < passwordLength; i++) {
        randNum *= 10;
        //是否为随机数
        if (randPosAry.includes(i)) {
            //随机[0,9]
            randNum += Math.floor(Math.random() * 10);
        } else {
            //固定数
            randNum += calcArray[calcCount++];
        }
    }
    return randNum;
}

let mossMap = {};
let unlockMoss = function(mossNum) {
    //补0
    const PrefixInteger = function (num, m) {
        return (Array(m).join(0) + num).slice(-m);
    }
    if(!mossNum){
        return '未传入moss密码';
    }
    if(mossMap[mossNum]){
        return '该moss密码已经被使用过';
    }
    const myDate = new Date();
    let y = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    let m = myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    let d = myDate.getDate();        //获取当前日(1-31)
    let randLeft = String(Math.floor(mossNum / 1e10));
    let randRight = String(mossNum % 1e10);
    randRight = PrefixInteger(randRight, 10);
    console.log(randLeft, randRight);
    let calcArray = [];
    calcArray[0] =(y - m - d) % 10;
    calcArray[1] =(y + m + d) % 10;
    calcArray[2] =(y * m * d) % 10;
    calcArray[3] =(y + m * d) % 10;
    calcArray[4] =(y * m - d) % 10;
    let calcCount = 0;
    for(let i = 0; i < randRight.length; i++){
        //随机值不判断正确与否
        if(!randLeft.includes(String(i))){
            //比较固定值
            if(randRight[i] != calcArray[calcCount++]){
                return 'moss密码有误';
            }
        }
    }

    mossMap[mossNum] = true;
    return null;
}

exports.lockMoss = lockMoss;
exports.unlockMoss = unlockMoss;