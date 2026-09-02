import confetti from "canvas-confetti";

/* ==========================================
   REVOLUTIONARY EMOTION EFFECTS SYSTEM
   ========================================== */

// ==========================================
// FLIRTY - Romantic Hearts & Sparkles
// ==========================================
export function triggerFlirtyEffect() {
  // Main heart burst
  confetti({
    particleCount: 100,
    spread: 80,
    startVelocity: 40,
    origin: { x: 0.5, y: 0.5 },
    colors: ["#ff6b9d", "#ec4899", "#ff8fb8"],
    shapes: ["circle"],
    scalar: 1.2,
    ticks: 200,
  });

  // Secondary sparkle burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 120,
      startVelocity: 30,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#ffc857", "#ff6b9d", "#ffffff"],
      scalar: 0.8,
      ticks: 150,
    });
  }, 100);

  // Screen tint
  addEmotionTint("flirty");

  // Sound effect
  playEmotionSound("flirty");
}

// ==========================================
// HAPPY - Explosive Confetti Celebration
// ==========================================
export function triggerHappyEffect() {
  // Left burst
  confetti({
    particleCount: 100,
    spread: 90,
    startVelocity: 45,
    origin: { x: 0.2, y: 0.6 },
    colors: ["#ffc857", "#10b981", "#6366f1"],
    scalar: 1.3,
    ticks: 220,
  });

  // Right burst
  confetti({
    particleCount: 100,
    spread: 90,
    startVelocity: 45,
    origin: { x: 0.8, y: 0.6 },
    colors: ["#ffc857", "#10b981", "#6366f1"],
    scalar: 1.3,
    ticks: 220,
  });

  // Center top burst
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 50,
      origin: { x: 0.5, y: 0.2 },
      colors: ["#ffc857", "#ec4899", "#6366f1"],
      scalar: 1.1,
      ticks: 200,
    });
  }, 150);

  // Screen tint + pulse
  addEmotionTint("happy");
  pulseScreenBrightness();

  // Sound effect
  playEmotionSound("happy");
}

// ==========================================
// SAD - Emotional Rain & Glow
// ==========================================
export function triggerSadEffect(containerEl) {
  if (!containerEl) return;

  // More dramatic rain
  const dropCount = 40;
  const fragment = document.createDocumentFragment();
  const drops = [];

  for (let i = 0; i < dropCount; i++) {
    const drop = document.createElement("div");
    drop.className = "raindrop-sad";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.top = `${Math.random() * 20 - 10}%`;
    drop.style.animationDuration = `${1000 + Math.random() * 800}ms`;
    drop.style.animationDelay = `${Math.random() * 400}ms`;
    drop.style.width = `${2 + Math.random() * 3}px`;
    drop.style.opacity = `${0.3 + Math.random() * 0.4}`;
    fragment.appendChild(drop);
    drops.push(drop);
  }

  containerEl.appendChild(fragment);

  // Screen tint
  addEmotionTint("sad");

  // Sound effect
  playEmotionSound("sad");

  setTimeout(() => {
    drops.forEach((d) => d.remove());
  }, 2500);
}

// ==========================================
// ANGRY - Intense Shake & Screen Flash
// ==========================================
export function triggerAngryEffect(targetEl) {
  if (!targetEl) return;

  // Remove and readd for animation reset
  targetEl.classList.remove("shake-active");
  void targetEl.offsetWidth;
  targetEl.classList.add("shake-active");

  // Screen flash
  flashScreenRed();

  // Heavy confetti burst
  confetti({
    particleCount: 120,
    spread: 160,
    startVelocity: 50,
    origin: { x: 0.5, y: 0.5 },
    colors: ["#ff4f4f", "#ef4444", "#fca5a5"],
    scalar: 1.4,
    ticks: 250,
    gravity: 1.2,
  });

  // Screen tint
  addEmotionTint("angry");

  // Sound effect
  playEmotionSound("angry");

  setTimeout(() => targetEl.classList.remove("shake-active"), 450);
}

// ==========================================
// NEUTRAL - Subtle Pulse
// ==========================================
export function triggerNeutralEffect() {
  // Subtle confetti
  confetti({
    particleCount: 30,
    spread: 60,
    startVelocity: 20,
    origin: { x: 0.5, y: 0.5 },
    colors: ["#94a3b8", "#cbd5e1", "#f1f5f9"],
    scalar: 0.8,
    ticks: 150,
  });

  // Sound effect
  playEmotionSound("neutral");
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Add a temporary tint overlay to the screen
 */
function addEmotionTint(emotion) {
  let tintColor = "#6366f1";

  switch (emotion) {
    case "flirty":
      tintColor = "#ff6b9d";
      break;
    case "happy":
      tintColor = "#ffc857";
      break;
    case "sad":
      tintColor = "#6b8cff";
      break;
    case "angry":
      tintColor = "#ff4f4f";
      break;
    default:
      tintColor = "#94a3b8";
  }

  // Create tint overlay
  const tint = document.createElement("div");
  tint.className = "emotion-tint";
  tint.style.background = tintColor;
  tint.style.position = "fixed";
  tint.style.inset = "0";
  tint.style.zIndex = "125";
  tint.style.pointerEvents = "none";
  tint.style.opacity = "0.15";
  tint.style.animation = "fadeInOut 1.5s ease-in-out";
  document.body.appendChild(tint);

  setTimeout(() => tint.remove(), 1500);
}

/**
 * Flash screen red for angry emotion
 */
function flashScreenRed() {
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.inset = "0";
  flash.style.background = "#ff4f4f";
  flash.style.zIndex = "125";
  flash.style.pointerEvents = "none";
  flash.style.animation = "flash 0.4s ease-out";
  document.body.appendChild(flash);

  setTimeout(() => flash.remove(), 400);
}

/**
 * Pulse screen brightness for happy emotion
 */
function pulseScreenBrightness() {
  const pulse = document.createElement("div");
  pulse.style.position = "fixed";
  pulse.style.inset = "0";
  pulse.style.background = "white";
  pulse.style.zIndex = "125";
  pulse.style.pointerEvents = "none";
  pulse.style.animation = "brightnessPulse 0.6s ease-out";
  document.body.appendChild(pulse);

  setTimeout(() => pulse.remove(), 600);
}

/**
 * Play emotion-specific sound
 */
function playEmotionSound(emotion) {
  try {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    switch (emotion) {
      case "flirty":
        playTone(audioContext, 800, 0.1, 0.2);
        playTone(audioContext, 1000, 0.1, 0.25);
        break;
      case "happy":
        playTone(audioContext, 523.25, 0.15, 0.1); // C5
        playTone(audioContext, 659.25, 0.15, 0.2); // E5
        playTone(audioContext, 783.99, 0.15, 0.3); // G5
        break;
      case "sad":
        playTone(audioContext, 261.63, 0.2, 0.3); // C4
        playTone(audioContext, 196.0, 0.2, 0.5); // G3
        break;
      case "angry":
        playTone(audioContext, 150, 0.3, 0.1);
        playTone(audioContext, 150, 0.3, 0.15);
        break;
      case "neutral":
        playTone(audioContext, 440, 0.1, 0.2); // A4
        break;
      default:
        break;
    }
  } catch (e) {
    // Silently fail if audio context not available
  }
}

/**
 * Play a tone using Web Audio API
 */
function playTone(audioContext, frequency, duration, delay) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + duration);
}

/**
 * Main emotion effect runner
 */
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
    case "neutral":
      triggerNeutralEffect();
      break;
    default:
      break;
  }
}
