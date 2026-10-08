// 儲存五題測驗資料
const questions = [
  {
    // 設定第一題題目
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    // 設定第一題的四個選項
    options: ["createCanvas()", "drawCanvas()", "makeCanvas()", "canvasCreate()"],
    // 設定第一題的正確答案索引
    answer: 0
  },
  {
    // 設定第二題題目
    question: "在 p5.js 中，哪一個函式會持續重複執行？",
    // 設定第二題的四個選項
    options: ["setup()", "draw()", "loopOnce()", "repeat()"],
    // 設定第二題的正確答案索引
    answer: 1
  },
  {
    // 設定第三題題目
    question: "哪一個指令可以設定背景顏色？",
    // 設定第三題的四個選項
    options: ["background()", "bgColor()", "setBackground()", "colorBackground()"],
    // 設定第三題的正確答案索引
    answer: 0
  },
  {
    // 設定第四題題目
    question: "哪一個指令可以畫出圓形？",
    // 設定第四題的四個選項
    options: ["circle()", "ellipse()", "round()", "drawCircle()"],
    // 設定第四題的正確答案索引
    answer: 1
  },
  {
    // 設定第五題題目
    question: "哪一個指令可以設定填滿顏色？",
    // 設定第五題的四個選項
    options: ["fill()", "insideColor()", "paint()", "colorFill()"],
    // 設定第五題的正確答案索引
    answer: 0
  }
];

// 設定目前題目的索引值
let currentQuestion = 0;

// 設定答對題數
let score = 0;

// 設定是否已經作答
let hasAnswered = false;

// 設定使用者選擇的選項索引值
let selectedOption = -1;

// 儲存畫布物件
let canvasElement;

// 儲存選項位置資料
let optionRects = [];

// 儲存下一題按鈕位置資料
let nextButtonRect;

// 儲存重新開始按鈕位置資料
let restartButtonRect;

// 設定答錯動畫開始時間
let animationStartTime = 0;

// 設定動畫持續時間
const animationDuration = 1000;

// 設定背景顏色
const pageColor = "#f8edeb";

// 設定正確答案顏色
const correctColor = "#edafb8";

// 設定錯誤答案顏色
const wrongColor = "#80ced7";

// 設定按鈕顏色
const buttonColor = "#555555";

// 設定按鈕文字顏色
const buttonTextColor = "#ffffff";

// 建立畫布
function setup() {
  // 建立符合視窗大小的畫布
  canvasElement = createCanvas(windowWidth, windowHeight);

  // 設定畫布顯示為區塊元素
  canvasElement.style("display", "block");

  // 設定畫布不產生外部空白
  canvasElement.style("margin", "0");

  // 設定觸控操作不觸發瀏覽器滑動
  canvasElement.style("touch-action", "none");

  // 設定頁面文字字體
  textFont("Arial, sans-serif");

  // 設定文字水平與垂直置中
  textAlign(CENTER, CENTER);

  // 設定矩形從左上角開始繪製
  rectMode(CORNER);

  // 計算響應式版面
  calculateLayout();
}

// 每一幀繪製畫面
function draw() {
  // 設定頁面背景顏色
  background(pageColor);

  // 設定文字水平與垂直置中
  textAlign(CENTER, CENTER);

  // 確認題目尚未完成
  if (currentQuestion < questions.length) {
    // 顯示題目內容
    drawQuiz();

    // 顯示選項
    drawOptions();

    // 顯示下一題按鈕
    drawNextButton();
  } else {
    // 顯示測驗結果
    drawResult();

    // 顯示重新開始按鈕
    drawRestartButton();
  }
}

// 計算響應式版面
function calculateLayout() {
  // 取得目前畫面最短邊
  const shortestSide = min(width, height);

  // 判斷是否為小型裝置
  const isSmallScreen = shortestSide < 500;

  // 設定左右留白
  const sidePadding = isSmallScreen ? width * 0.06 : width * 0.1;

  // 設定選項寬度
  const optionWidth = min(width - sidePadding * 2, 720);

  // 設定選項高度
  const optionHeight = constrain(
    isSmallScreen ? height * 0.07 : height * 0.075,
    44,
    70
  );

  // 設定選項之間的間距
  const optionGap = constrain(
    isSmallScreen ? height * 0.018 : height * 0.025,
    8,
    24
  );

  // 設定手機橫向時的選項起始位置
  const isSmallLandscape = isSmallScreen && width > height;

  // 設定選項起始 Y 座標
  const optionsTopY = isSmallLandscape ? height * 0.43 : height * 0.43;

  // 清空選項位置陣列
  optionRects = [];

  // 計算四個選項的位置
  for (let i = 0; i < questions[currentQuestion].options.length; i++) {
    // 計算選項 X 座標
    const optionX = width / 2 - optionWidth / 2;

    // 計算選項 Y 座標
    const optionY = optionsTopY + i * (optionHeight + optionGap);

    // 儲存選項位置與大小
    optionRects.push({
      x: optionX,
      y: optionY,
      width: optionWidth,
      height: optionHeight
    });
  }

  // 設定下一題按鈕寬度
  const nextWidth = constrain(width * 0.28, 110, 190);

  // 設定下一題按鈕高度
  const nextHeight = constrain(height * 0.065, 42, 58);

  // 計算下一題按鈕位置
  nextButtonRect = {
    x: width / 2 - nextWidth / 2,
    y: height - nextHeight - max(12, height * 0.025),
    width: nextWidth,
    height: nextHeight
  };

  // 設定重新開始按鈕寬度
  const restartWidth = constrain(width * 0.32, 130, 210);

  // 設定重新開始按鈕高度
  const restartHeight = constrain(height * 0.065, 42, 58);

  // 計算重新開始按鈕位置
  restartButtonRect = {
    x: width / 2 - restartWidth / 2,
    y: height * 0.68,
    width: restartWidth,
    height: restartHeight
  };
}

// 顯示測驗題目
function drawQuiz() {
  // 取得目前題目
  const quiz = questions[currentQuestion];

  // 設定文字顏色
  fill("#333333");

  // 設定畫面最短邊
  const shortestSide = min(width, height);

  // 判斷是否為小型螢幕
  const isSmallScreen = shortestSide < 500;

  // 設定標題文字大小
  const titleSize = constrain(
    isSmallScreen ? min(width * 0.055, 28) : min(width * 0.045, 36),
    20,
    36
  );

  // 設定標題文字大小
  textSize(titleSize);

  // 顯示測驗標題
  text("p5.js 程式設計簡易測驗", width / 2, height * 0.08);

  // 設定題數文字大小
  const counterSize = constrain(
    isSmallScreen ? min(width * 0.035, 18) : min(width * 0.025, 22),
    16,
    22
  );

  // 設定題數文字大小
  textSize(counterSize);

  // 顯示題數
  text(
    "第 " + (currentQuestion + 1) + " 題 / 共 " + questions.length + " 題",
    width / 2,
    height * 0.15
  );

  // 設定題目文字大小
  const questionSize = constrain(
    isSmallScreen ? min(width * 0.045, 22) : min(width * 0.035, 28),
    17,
    28
  );

  // 設定題目文字行高
  const lineHeight = questionSize * 1.35;

  // 設定題目最大寬度
  const maxQuestionWidth = width * 0.86;

  // 將題目文字自動分行
  const questionLines = wrapText(
    quiz.question,
    maxQuestionWidth,
    questionSize
  );

  // 計算題目總高度
  const totalQuestionHeight = questionLines.length * lineHeight;

  // 設定手機橫向題目中心位置
  const isSmallLandscape = isSmallScreen && width > height;

  // 設定題目垂直中心位置
  const questionCenterY = isSmallLandscape ? height * 0.29 : height * 0.25;

  // 設定題目文字大小
  textSize(questionSize);

  // 逐行繪製題目文字
  for (let i = 0; i < questionLines.length; i++) {
    // 計算目前文字行的 Y 座標
    const lineY =
      questionCenterY -
      totalQuestionHeight / 2 +
      lineHeight / 2 +
      i * lineHeight;

    // 將題目文字繪製於畫布水平中心
    text(questionLines[i], width / 2, lineY);
  }

  // 判斷使用者是否已作答
  if (hasAnswered) {
    // 設定結果文字大小
    textSize(constrain(isSmallScreen ? width * 0.04 : width * 0.026, 16, 22));

    // 判斷使用者是否答對
    if (selectedOption === quiz.answer) {
      // 設定答對文字顏色
      fill("#438a5e");

      // 顯示答對訊息
      text("答對了！", width / 2, height * 0.36);
    } else {
      // 設定答錯文字顏色
      fill("#b24c5d");

      // 顯示答錯訊息
      text("答錯了！正確答案已標示。", width / 2, height * 0.36);
    }
  }
}

// 將文字自動分行
function wrapText(message, maxWidth, fontSizeValue) {
  // 設定文字大小
  textSize(fontSizeValue);

  // 建立文字行陣列
  const lines = [];

  // 設定目前文字行
  let currentLine = "";

  // 將文字拆成單一字元
  const characters = Array.from(message);

  // 逐一處理文字
  for (let i = 0; i < characters.length; i++) {
    // 測試加入下一個字元
    const testLine = currentLine + characters[i];

    // 判斷是否超過最大寬度
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 儲存目前文字行
      lines.push(currentLine);

      // 重新開始下一行
      currentLine = characters[i];
    } else {
      // 繼續增加文字
      currentLine = testLine;
    }
  }

  // 儲存最後一行文字
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // 回傳文字行陣列
  return lines;
}

// 顯示四個選項
function drawOptions() {
  // 取得目前題目
  const quiz = questions[currentQuestion];

  // 設定畫面最短邊
  const shortestSide = min(width, height);

  // 判斷是否為小型裝置
  const isSmallScreen = shortestSide < 500;

  // 設定選項文字大小
  const optionTextSize = constrain(
    isSmallScreen ? min(width * 0.042, 20) : min(width * 0.028, 23),
    16,
    23
  );

  // 設定選項文字大小
  textSize(optionTextSize);

  // 逐一繪製四個選項
  for (let i = 0; i < optionRects.length; i++) {
    // 取得選項位置資料
    const option = optionRects[i];

    // 設定水平動畫位移
    let offsetX = 0;

    // 設定垂直動畫位移
    let offsetY = 0;

    // 判斷是否播放動畫
    if (hasAnswered && selectedOption !== quiz.answer) {
      // 計算動畫經過時間
      const elapsedTime = millis() - animationStartTime;

      // 計算動畫進度
      const progress = min(elapsedTime / animationDuration, 1);

      // 讓正確答案上下跳動
      if (i === quiz.answer) {
        // 計算上下移動量
        offsetY = sin(elapsedTime * 0.02) * 12 * (1 - progress);
      }

      // 讓錯誤答案左右移動
      if (i === selectedOption) {
        // 計算左右移動量
        offsetX = sin(elapsedTime * 0.025) * 16 * (1 - progress);
      }
    }

    // 設定選項背景顏色
    if (hasAnswered && i === quiz.answer) {
      // 設定正確答案顏色
      fill(correctColor);
    } else if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== quiz.answer
    ) {
      // 設定錯誤答案顏色
      fill(wrongColor);
    } else {
      // 設定預設背景顏色
      fill("#ffffff");
    }

    // 繪製選項背景
    rect(
      option.x + offsetX,
      option.y + offsetY,
      option.width,
      option.height,
      14
    );

    // 設定選項文字顏色
    fill("#333333");

    // 設定選項文字大小
    textSize(optionTextSize);

    // 顯示選項文字
    text(
      quiz.options[i],
      option.x + option.width / 2 + offsetX,
      option.y + option.height / 2 + offsetY
    );
  }
}

// 顯示下一題按鈕
function drawNextButton() {
  // 尚未作答時不顯示按鈕
  if (!hasAnswered) {
    return;
  }

  // 取得下一題按鈕資料
  const button = nextButtonRect;

  // 設定按鈕背景顏色
  fill(buttonColor);

  // 繪製下一題按鈕
  rect(button.x, button.y, button.width, button.height, 12);

  // 設定按鈕文字顏色
  fill(buttonTextColor);

  // 設定按鈕文字大小
  textSize(constrain(min(width * 0.04, 22), 16, 22));

  // 顯示按鈕文字
  text("下一題", width / 2, button.y + button.height / 2);
}

// 顯示重新開始按鈕
function drawRestartButton() {
  // 取得重新開始按鈕資料
  const button = restartButtonRect;

  // 設定按鈕背景顏色
  fill(buttonColor);

  // 繪製重新開始按鈕
  rect(button.x, button.y, button.width, button.height, 12);

  // 設定按鈕文字顏色
  fill(buttonTextColor);

  // 設定按鈕文字大小
  textSize(constrain(min(width * 0.04, 22), 16, 22));

  // 顯示按鈕文字
  text("重新開始", width / 2, button.y + button.height / 2);
}

// 顯示測驗結果
function drawResult() {
  // 設定文字顏色
  fill("#333333");

  // 設定結果標題文字大小
  textSize(constrain(min(width * 0.075, 48), 24, 48));

  // 顯示測驗完成文字
  text("測驗完成！", width / 2, height * 0.3);

  // 設定成績文字大小
  textSize(constrain(min(width * 0.06, 36), 20, 36));

  // 顯示分數
  text(
    "你答對了 " + score + " / " + questions.length + " 題",
    width / 2,
    height * 0.45
  );

  // 設定鼓勵文字大小
  textSize(constrain(min(width * 0.045, 25), 16, 25));

  // 根據分數顯示鼓勵訊息
  if (score === questions.length) {
    // 顯示滿分訊息
    text("太棒了！全部答對！", width / 2, height * 0.56);
  } else if (score >= 3) {
    // 顯示良好表現訊息
    text("表現很好，繼續加油！", width / 2, height * 0.56);
  } else {
    // 顯示鼓勵訊息
    text("再多練習幾次，一定會進步！", width / 2, height * 0.56);
  }
}

// 判斷座標是否位於矩形內
function isInside(pointX, pointY, rectangle) {
  // 回傳座標是否在矩形範圍內
  return (
    pointX >= rectangle.x &&
    pointX <= rectangle.x + rectangle.width &&
    pointY >= rectangle.y &&
    pointY <= rectangle.y + rectangle.height
  );
}

// 處理滑鼠點擊
function mousePressed() {
  // 處理滑鼠座標
  handleInput(mouseX, mouseY);

  // 停止瀏覽器預設行為
  return false;
}

// 處理手指觸控
function touchStarted() {
  // 確認目前有觸控點
  if (touches.length > 0) {
    // 使用第一個觸控點處理操作
    handleInput(touches[0].x, touches[0].y);
  }

  // 停止瀏覽器預設行為
  return false;
}

// 統一處理滑鼠與觸控
function handleInput(pointX, pointY) {
  // 判斷是否已完成測驗
  if (currentQuestion >= questions.length) {
    // 判斷是否點擊重新開始按鈕
    if (isInside(pointX, pointY, restartButtonRect)) {
      // 重新開始測驗
      restartQuiz();
    }

    // 結束處理
    return;
  }

  // 判斷是否已經作答
  if (hasAnswered) {
    // 判斷是否點擊下一題按鈕
    if (isInside(pointX, pointY, nextButtonRect)) {
      // 前往下一題
      goToNextQuestion();
    }

    // 防止重複選答
    return;
  }

  // 檢查四個選項
  for (let i = 0; i < optionRects.length; i++) {
    // 判斷是否點擊目前選項
    if (isInside(pointX, pointY, optionRects[i])) {
      // 記錄使用者選項
      selectedOption = i;

      // 設定已經作答
      hasAnswered = true;

      // 記錄動畫開始時間
      animationStartTime = millis();

      // 判斷使用者是否答對
      if (selectedOption === questions[currentQuestion].answer) {
        // 增加答對題數
        score++;
      }

      // 停止檢查其他選項
      break;
    }
  }
}

// 前往下一題
function goToNextQuestion() {
  // 增加題目索引
  currentQuestion++;

  // 重設作答狀態
  hasAnswered = false;

  // 重設選項索引
  selectedOption = -1;

  // 重新計算版面
  calculateLayout();
}

// 重新開始測驗
function restartQuiz() {
  // 將題目索引歸零
  currentQuestion = 0;

  // 將分數歸零
  score = 0;

  // 重設作答狀態
  hasAnswered = false;

  // 重設選項索引
  selectedOption = -1;

  // 重新計算版面
  calculateLayout();
}

// 當視窗大小改變時執行
function windowResized() {
  // 重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算版面
  calculateLayout();
}