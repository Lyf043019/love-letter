const scenes = {
  envelope: document.querySelector('#scene-envelope'),
  letter: document.querySelector('#scene-letter'),
  cute: document.querySelector('#scene-cute'),
  back: document.querySelector('#scene-back'),
  expanded: document.querySelector('#scene-expanded'),
};
const music = document.querySelector('#bg-music');
const musicToggle = document.querySelector('#music-toggle');
const musicLabel = document.querySelector('#music-label');
const toast = document.querySelector('#toast');
let toastTimer;
const sceneMessages = {
  envelope: '把这份小心意好好收下。',
  letter: '这封信，只写给你。',
  cute: '可可版的惊喜，送给可爱的你。',
  back: '换个角度，也还是喜欢你。',
  expanded: '把藏起来的心意，展开给你看。',
};

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function showScene(name) {
  Object.entries(scenes).forEach(([sceneName, scene]) => {
    const isVisible = sceneName === name;
    scene.hidden = !isVisible;
    scene.classList.toggle('scene--active', isVisible);
  });

  document.querySelectorAll('[data-options-target]').forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    document.querySelector(`#${trigger.dataset.optionsTarget}`).hidden = true;
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(sceneMessages[name]);
}

function setMusicButton(isPlaying) {
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicLabel.textContent = isPlaying ? '暂停音乐' : '播放音乐';
}

async function startMusic() {
  try {
    await music.play();
    setMusicButton(true);
  } catch {
    setMusicButton(false);
  }
}

document.querySelectorAll('[data-route]').forEach((button) => {
  button.addEventListener('click', () => {
    showScene(button.dataset.route);
    startMusic();
  });
});

document.querySelectorAll('[data-options-target]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const options = document.querySelector(`#${trigger.dataset.optionsTarget}`);
    const isOpening = options.hidden;
    options.hidden = !isOpening;
    trigger.setAttribute('aria-expanded', String(isOpening));
    if (isOpening) showToast('想看哪一面？慢慢选。');
  });
});

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    setMusicButton(false);
  }
});

music.addEventListener('ended', () => setMusicButton(false));
