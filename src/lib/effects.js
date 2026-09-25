import confetti from "canvas-confetti";

// Flirty: soft pink/gold heart-toned confetti burst
export function triggerFlirtyEffect() {
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 28,
    origin: { x: 0.5, y: 0.85 },
    colors: ["#ff6b9d", "#ffc857", "#ffffff"],
    scalar: 0.9,
    ticks: 180,
  });
}

// Happy: bigger, brighter confetti burst from both sides
export function triggerHappyEffect() {
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 35,
    origin: { x: 0.3, y: 0.8 },
    colors: ["#ffc857", "#ff6b9d", "#6b8cff"],
  });
  confetti({
    particleCount: 80,
    spread: 100,
    startVelocity: 35,
    origin: { x: 0.7, y: 0.8 },
    colors: ["#ffc857", "#ff6b9d", "#6b8cff"],
  });
}

// Angry: brief screen shake, applied via CSS class toggle
export function triggerAngryEffect(targetEl) {
  if (!targetEl) return;
  targetEl.classList.remove("shake-active");
  // Force reflow so the animation can restart if triggered again quickly
  void targetEl.offsetWidth;
  targetEl.classList.add("shake-active");
  setTimeout(() => targetEl.classList.remove("shake-active"), 450);
}

// Sad: a brief rain overlay of falling drops
export function triggerSadEffect(containerEl) {
  if (!containerEl) return;
  const dropCount = 24;
  const fragment = document.createDocumentFragment();
  const drops = [];

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${800 + Math.random() * 600}ms`;
    drop.style.animationDelay = `${Math.random() * 300}ms`;
    fragment.appendChild(drop);
    drops.push(drop);
  }

  containerEl.appendChild(fragment);
  setTimeout(() => {
    drops.forEach((d) => d.remove());
  }, 1800);
}

export function runEmotionEffect(tag, { shakeTarget, rainContainer } = {}) {
  switch (tag) {
    case "flirty":
      triggerFlirtyEffect();
      break;
    case "happy":
      triggerHappyEffect();
      break;
    case "angry":
      triggerAngryEffect(shakeTarget);
      break;
    case "sad":
      triggerSadEffect(rainContainer);
      break;
    default:
      break;
  }
}
