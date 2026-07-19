// ===========================
// Pro Tools 四択問題集
// script.js Part1
// ===========================

// ---------- ホーム ----------
const homeScreen = document.getElementById("home-screen");
const beginnerMenu = document.getElementById("beginner-menu");
const quizScreen = document.getElementById("quiz-screen");

// ---------- ボタン ----------
const beginnerBtn = document.getElementById("beginner-btn");
const intermediateBtn = document.getElementById("intermediate-btn");
const allBtn = document.getElementById("all-btn");
const randomBtn = document.getElementById("random-btn");
const backBtn = document.getElementById("back-btn");

// ---------- A～D ----------
const a1Btn = document.getElementById("a1-btn");
const a2Btn = document.getElementById("a2-btn");
const b1Btn = document.getElementById("b1-btn");
const b2Btn = document.getElementById("b2-btn");
const c1Btn = document.getElementById("c1-btn");
const c2Btn = document.getElementById("c2-btn");
const c3Btn = document.getElementById("c3-btn");
const c4Btn = document.getElementById("c4-btn");
const d1Btn = document.getElementById("d1-btn");
const d2Btn = document.getElementById("d2-btn");
const d3Btn = document.getElementById("d3-btn");
const d4Btn = document.getElementById("d4-btn");

// ---------- 問題画面 ----------
const questionNumber = document.getElementById("question-number");
const questionText = document.getElementById("question");
const questionImage = document.getElementById("question-image");
const choicesDiv = document.getElementById("choices");
const progressBar = document.getElementById("progress-bar");
const finishBox = document.getElementById("finish");
const finalScore = document.getElementById("final-score");
const finalRate = document.getElementById("final-rate");

// ===========================
// 変数
// ===========================
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let randomMode = false;

// ===========================
// ホーム画面イベント
// ===========================
beginnerBtn.addEventListener("click", () => {
	homeScreen.classList.add("hidden");
	beginnerMenu.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
	beginnerMenu.classList.add("hidden");
	homeScreen.classList.remove("hidden");
});

intermediateBtn.addEventListener("click", () => {
	randomMode = false;
	quizQuestions = questions.filter(q => q.level === "intermediate");
	startQuiz();
});

allBtn.addEventListener("click", () => {
	randomMode = false;
	quizQuestions = [...questions];
	startQuiz();
});

randomBtn.addEventListener("click", () => {
	randomMode = true;
	quizQuestions = [...questions];
	startQuiz();
});

// ===========================
// A1～D4 ボタン
// ===========================
a1Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "A1"); randomMode = false; startQuiz(); });
a2Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "A2"); randomMode = false; startQuiz(); });
b1Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "B1"); randomMode = false; startQuiz(); });
b2Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "B2"); randomMode = false; startQuiz(); });
c1Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "C1"); randomMode = false; startQuiz(); });
c2Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "C2"); randomMode = false; startQuiz(); });
c3Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "C3"); randomMode = false; startQuiz(); });
c4Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "C4"); randomMode = false; startQuiz(); });
d1Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "D1"); randomMode = false; startQuiz(); });
d2Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "D2"); randomMode = false; startQuiz(); });
d3Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "D3"); randomMode = false; startQuiz(); });
d4Btn.addEventListener("click", () => { quizQuestions = questions.filter(q => q.category === "D4"); randomMode = false; startQuiz(); });

// ===========================
// クイズ開始
// ===========================
function startQuiz() {
	currentQuestion = 0;
	score = 0;
	userAnswers = [];

	beginnerMenu.classList.add("hidden");
	homeScreen.classList.add("hidden");
	quizScreen.classList.remove("hidden");
	finishBox.classList.add("hidden");

	const quizBox = document.querySelector(".quiz-box");
	quizBox.classList.remove("hidden");
	progressBar.style.width = "0%";

	showQuestion();
}

// ===========================
// 選択肢シャッフル（ランダムモード用）
// ===========================
function shuffleChoices(question) {
	const choices = [...question.choices];
	const correctChoice = choices[question.answer];

	for (let i = choices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[choices[i], choices[j]] = [choices[j], choices[i]];
	}

	return {
		level: question.level,
		category: question.category,
		image: question.image,
		question: question.question,
		choices: choices,
		answer: choices.indexOf(correctChoice)
	};
}

// ===========================
// 問題表示（★画像のクリア処理を追加してバグを完全修正）
// ===========================
function showQuestion() {
	let q = quizQuestions[currentQuestion];

	if (randomMode) {
		q = shuffleChoices(q);
		quizQuestions[currentQuestion] = q;
	}

	questionNumber.textContent = `問題 ${currentQuestion + 1} / ${quizQuestions.length}`;
	progressBar.style.width = ((currentQuestion + 1) / quizQuestions.length) * 100 + "%";

	// ===========================
	// 🛠️ 【ここを修正】前後の画像の競合・残像バグを防ぐ
	// ===========================
	// 1. まず現在のsrcを空にし、非表示クラスを入れて「完全に初期化」する
	questionImage.src = "";
	questionImage.classList.add("hidden");

	// 2. その上で、今回の問題に画像がある場合のみ再セットして表示する
	if (q.image) {
		questionImage.src = q.image;
		questionImage.classList.remove("hidden");
	}

	// 問題文
	questionText.textContent = q.question;
	choicesDiv.innerHTML = "";

	q.choices.forEach((choice, index) => {
		const button = document.createElement("button");
		button.textContent = choice;
		button.classList.add("choice-btn");
		button.dataset.index = index;
		choicesDiv.appendChild(button);
	});
}

// ===========================
// 回答処理（★緑の正解フラッシュを復活させ、振動だけを完全カット！）
// ===========================
choicesDiv.addEventListener("click", (event) => {
	if (!event.target.classList.contains("choice-btn")) {
		return;
	}

	const buttons = document.querySelectorAll(".choice-btn");
	buttons.forEach(button => {
		button.disabled = true;
	});

	const selected = Number(event.target.dataset.index);
	const correctAnswer = quizQuestions[currentQuestion].answer;
	userAnswers[currentQuestion] = selected;

	let isCorrect = (selected === correctAnswer);
	let viewDelay = isCorrect ? 400 : 2000;

	if (isCorrect) {
		score++;
		event.target.classList.add("correct-flash");
	} else {
		// 画面がブルブル揺れるコードは一切なし。静止したまま色だけが切り替わります。
		event.target.classList.add("incorrect-flash"); // 選んだ間違えボタンを赤に
		buttons[correctAnswer].classList.add("correct-flash"); // 同時に、正解ボタンを緑に光らせる
	}

	setTimeout(() => {
		currentQuestion++;
		
		if (currentQuestion < quizQuestions.length) {
			showQuestion();
		} else {
			showResult();
		}
	}, viewDelay);
});

// ===========================
// 結果画面
// ===========================
function showResult() {
	document.querySelector(".quiz-box").classList.add("hidden");
	finishBox.classList.remove("hidden");

	finalScore.textContent = `正答数：${score} / ${quizQuestions.length}`;
	const rate = Math.round(score / quizQuestions.length * 100);
	finalRate.textContent = `正答率：${rate}%`;

	const rank = document.createElement("h2");
	rank.classList.add("rank");

	if (rate === 100) {
		rank.textContent = "🏆 Sランク (パーフェクト！)";
		rank.style.color = "gold";
	} else if (rate >= 90) {
		rank.textContent = "🥇 Aランク (優秀です！)";
		rank.style.color = "#00ff88";
	} else if (rate >= 80) {
		rank.textContent = "🥈 Bランク (合格ライン突破！)";
		rank.style.color = "#00bfff";
	} else if (rate >= 70) {
		rank.textContent = "🥉 Cランク (もう少し頑張りましょう)";
		rank.style.color = "orange";
	} else {
		rank.textContent = "📚 不合格 (もう一度挑戦！)";
		rank.style.color = "#ff5555";
	}

	const oldRank = finishBox.querySelector(".rank");
	if (oldRank) oldRank.remove();
	finalRate.parentNode.insertBefore(rank, finalRate.nextSibling);

	const retryBtn = document.getElementById("retry-btn");
	retryBtn.onclick = () => {
		startQuiz();
	};

	const resultHomeBtn = document.getElementById("result-home-btn");
	resultHomeBtn.onclick = () => {
		quizScreen.classList.add("hidden");
		finishBox.classList.add("hidden");
		homeScreen.classList.remove("hidden");
	};

	const oldList = document.getElementById("result-list");
	if (oldList) oldList.remove();

	const resultList = document.createElement("div");
	resultList.id = "result-list";

	const title = document.createElement("h3");
	title.textContent = "答え合わせ";
	title.style.margin = "30px 0 15px 0";
	title.style.fontSize = "24px";
	resultList.appendChild(title);

	quizQuestions.forEach((q, index) => {
		const item = document.createElement("div");
		item.classList.add("answer-item");

		const correct = userAnswers[index] === q.answer;

		item.innerHTML = `
			<h4>問題 ${index + 1}</h4>
			${q.image ? `<img src="${q.image}">` : ""}
			<p>${q.question}</p>
			<p>あなたの回答：<span style="color: ${correct ? '#00ffaa' : '#ff5555'};"><strong>${q.choices[userAnswers[index]]}</strong></span></p>
			<p>正解：<span style="color: #00ffaa;"><strong>${q.choices[q.answer]}</strong></span></p>
			<p style="color:${correct ? "#00ffaa" : "#ff5555"}; font-size:22px; font-weight:bold; margin-top:10px;">
				${correct ? "⭕ 正解" : "❌ 不正解"}
			</p>
		`;
		resultList.appendChild(item);
	});

	finishBox.appendChild(resultList);
}