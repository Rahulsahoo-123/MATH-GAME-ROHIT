// Shared quiz logic for quiz pages (each quiz page must define `QUESTIONS` array)
(function(){
  if(typeof QUESTIONS === 'undefined') return;

  // Correctly reference audio elements (assume <audio id="correctSound">)
  const correctSound = document.getElementById('correctSound');
  const wrongSound = document.getElementById('wrongSound');

  let currentIndex = 0;
  let answered = false;

  // DOM refs
  const qTitle = document.getElementById('quizTitle');
  const qProgress = document.getElementById('quizProgress');
  const questionText = document.getElementById('questionText');
  const optionsDiv = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');

  function init(){
    if(!Array.isArray(QUESTIONS) || QUESTIONS.length === 0){
      questionText.innerText = "No questions defined for this quiz.";
      return;
    }
    if(qTitle) qTitle.innerText = PAGE_TITLE || "Quiz";
    renderQuestion();
    nextBtn && nextBtn.addEventListener('click', nextQuestion);
    backBtn && backBtn.addEventListener('click', ()=> location.href = 'categories.html');
  }

  function renderQuestion(){
    answered = false;
    if(nextBtn) nextBtn.style.display = 'none';
    const q = QUESTIONS[currentIndex];
    if(qProgress) qProgress.innerText = `Q${currentIndex+1} / ${QUESTIONS.length}`;
    questionText.innerText = q.q;
    optionsDiv.innerHTML = '';
    
    q.opts.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'opt-btn';
      b.innerText = opt;
      b.addEventListener('click', ()=> selectAnswer(b, opt, q.a));
      optionsDiv.appendChild(b);
    });
  }

  function selectAnswer(button, selected, correct){
    if(answered) return;
    answered = true;

    Array.from(optionsDiv.children).forEach(ch => ch.disabled = true);

    if(selected === correct){
      button.classList.add('correct');
      safePlay(correctSound);
      markBox(currentIndex, true);
    } else {
      button.classList.add('wrong');
      Array.from(optionsDiv.children).forEach(ch => {
        if(ch.innerText === correct) ch.classList.add('correct');
      });
      safePlay(wrongSound);
      markBox(currentIndex, false);
    }

    if(nextBtn) nextBtn.style.display = 'inline-block';
  }

  function nextQuestion(){
    if(currentIndex + 1 < QUESTIONS.length){
      currentIndex++;
      renderQuestion();
      window.scrollTo({top:0, behavior:'smooth'});
    } else {
      alert('You completed this quiz — returning to categories.');
      location.href = 'categories.html';
    }
  }

  function markBox(index, correct){
    try{
      const pageKey = PAGE_ID || PAGE_TITLE || 'quiz';
      const raw = localStorage.getItem('mm_progress') || '{}';
      const store = JSON.parse(raw);
      store[pageKey] = store[pageKey] || {};
      store[pageKey][index] = correct ? 'correct' : 'wrong';
      localStorage.setItem('mm_progress', JSON.stringify(store));
    }catch(e){}
  }

  function safePlay(audioElem){
    try{
      if(!audioElem) return;
      audioElem.currentTime = 0;
      audioElem.play().catch(()=>{});
    }catch(e){}
  }

  // Expose init
  window.MM_QuizInit = init;
})();
