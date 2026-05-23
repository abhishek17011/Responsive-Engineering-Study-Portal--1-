// =========================
// MOBILE NAVBAR
// =========================

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  navLinks.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', String(!expanded));
});


// =========================
// SHOW YEAR CONTENT
// =========================

const selectPrompt = document.querySelector('.select-prompt');
const comingSoonMessage = document.getElementById('comingSoonMessage');

function showYear(id){

  // Sab sections hide karo
  const sections = document.querySelectorAll('.year-content');

  sections.forEach(section => {
    section.classList.add('hidden');
  });

  // Hide any previous coming soon message
  if (comingSoonMessage) {
    comingSoonMessage.classList.add('hidden');
  }

  // Hide the initial prompt once a section is selected
  if (selectPrompt) {
    selectPrompt.classList.add('hidden');
  }

  const targetSection = document.getElementById(id);

  if (targetSection) {
    targetSection.classList.remove('hidden');

    // Smooth scroll to the selected year section
    window.scrollTo({
      top: targetSection.offsetTop - 70,
      behavior: 'smooth'
    });
    return;
  }

  // If the section doesn't exist, show the shared coming soon message
  if (comingSoonMessage) {
    comingSoonMessage.classList.remove('hidden');

    window.scrollTo({
      top: comingSoonMessage.offsetTop - 70,
      behavior: 'smooth'
    });
  }
}

// =========================
// CLEAN 1ST AND 2ND YEAR SEMESTER BUTTONS
// =========================

const branchLabels = {
  cse: 'Computer Science',
  ai: 'Artificial Intelligence',
  eee: 'Electrical and Electronics',
  civ: 'Civil Engineering',
  mech: 'Mechanical Engineering'
};

function createSemesterButtons(branch, semester, year){
  return `
    <div class="subject-card">
      <div class="buttons">
        <a href="pyq.html?branch=${branch}&year=${year}&semester=${semester}">PYQ</a>
        <a href="notes.html?branch=${branch}&year=${year}&semester=${semester}">Notes</a>
      </div>
    </div>
  `;
}

function createCommonSyllabusButton(branch, year){
  const branchName = branchLabels[branch] || 'Engineering';
  const yearLabel = year === 1 ? '1st' : year === 2 ? '2nd' : `${year}th`;
  return `
    <div class="subject-grid semester-actions common-syllabus">
      <div class="subject-card">
        <div class="buttons">
          <a href="syllabus.html?branch=${branch}&year=${year}">${branchName} ${yearLabel} Year Syllabus</a>
        </div>
      </div>
    </div>
  `;
}

[
  { id: 'cse1', branch: 'cse', year: 1, semesters: [1, 2] },
  { id: 'ai1', branch: 'ai', year: 1, semesters: [1, 2] },
  { id: 'eee1', branch: 'eee', year: 1, semesters: [1, 2] },
  { id: 'civ1', branch: 'civ', year: 1, semesters: [1, 2] },
  { id: 'mech1', branch: 'mech', year: 1, semesters: [1, 2] },
  { id: 'cse2', branch: 'cse', year: 2, semesters: [3, 4] },
  { id: 'ai2', branch: 'ai', year: 2, semesters: [3, 4] },
  { id: 'eee2', branch: 'eee', year: 2, semesters: [3, 4] },
  { id: 'civ2', branch: 'civ', year: 2, semesters: [3, 4] },
  { id: 'mech2', branch: 'mech', year: 2, semesters: [3, 4] }
].forEach(({ id, branch, year, semesters }) => {
  const section = document.getElementById(id);

  if (!section) {
    return;
  }

  const heading = section.querySelector('h2');
  const oldCommonSyllabus = section.querySelector('.common-syllabus');

  if (oldCommonSyllabus) {
    oldCommonSyllabus.remove();
  }

  if (heading) {
    heading.insertAdjacentHTML('afterend', createCommonSyllabusButton(branch, year));
  }

  const grids = section.querySelectorAll('.subject-grid:not(.common-syllabus)');
  const titles = section.querySelectorAll('.semester-title');

  if (!titles.length && grids.length) {
    const firstTitle = document.createElement('h3');
    firstTitle.className = 'semester-title';
    firstTitle.textContent = `Semester ${semesters[0]}`;
    grids[0].before(firstTitle);
  }

  if (grids[0]) {
    grids[0].classList.add('semester-actions');
    grids[0].innerHTML = createSemesterButtons(branch, semesters[0], year);
  }

  if (!grids[1] && grids[0]) {
    const secondTitle = document.createElement('h3');
    secondTitle.className = 'semester-title';
    secondTitle.textContent = `Semester ${semesters[1]}`;
    grids[0].after(secondTitle);

    const secondGrid = document.createElement('div');
    secondGrid.className = 'subject-grid semester-actions';
    secondGrid.innerHTML = createSemesterButtons(branch, semesters[1], year);
    secondTitle.after(secondGrid);
  } else if (grids[1]) {
    grids[1].classList.add('semester-actions');
    grids[1].innerHTML = createSemesterButtons(branch, semesters[1], year);
  }
});


// =========================
// ACTIVE NAV LINK
// =========================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

  let current = "";

  sections.forEach(section => {

    const sectionTop = section.offsetTop;

    if(pageYOffset >= sectionTop - 200){
      current = section.getAttribute("id");
    }

  });

  navItems.forEach(link => {

    link.classList.remove("active-link");

    if(link.getAttribute("href").includes(current)){
      link.classList.add("active-link");
    }

  });

});


// =========================
// SCROLL ANIMATION
// =========================

const cards = document.querySelectorAll('.branch-card, .subject-card');

window.addEventListener('scroll', () => {

  cards.forEach(card => {

    const cardTop = card.getBoundingClientRect().top;

    if(cardTop < window.innerHeight - 100){
      card.classList.add('show');
    }

  });

});


// =========================
// LOADING EFFECT
// =========================

window.addEventListener('load', () => {

  document.body.classList.add('loaded');

});


// =========================
// BACK TO TOP BUTTON
// =========================

// Button Create
const topBtn = document.createElement('button');

topBtn.innerHTML = "↑";

document.body.appendChild(topBtn);

topBtn.classList.add('top-btn');


// Show/Hide Button
window.addEventListener('scroll', () => {

  if(window.scrollY > 400){
    topBtn.style.display = 'block';
  }
  else{
    topBtn.style.display = 'none';
  }

});


// Scroll Top
topBtn.addEventListener('click', () => {

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

});


// =========================
// CONSOLE MESSAGE 😎
// =========================

console.log("Engineer Vault Loaded Successfully 🚀");
