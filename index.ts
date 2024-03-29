
const healthSlider = document.getElementById("health-slider") as HTMLInputElement;
const healthText = document.getElementById("health-text") as HTMLInputElement;
const biteDmg = document.getElementById("bite-dmg") as HTMLInputElement;
const infectPctOutput = document.getElementById("infect-pct-output") as HTMLInputElement;
const infectChanceModifier = document.getElementById("infect-chance-modifier") as HTMLInputElement;
const survivalModifier = document.getElementById("survival-modifier") as HTMLInputElement;
const maxHealth = document.getElementById("max-health") as HTMLInputElement;
const infectChance = document.getElementById("infect-chance") as HTMLInputElement;

const gamemode = document.getElementsByName("gamemode");
const gamediff = document.getElementsByName("gamediff");

const cvars = document.getElementById("cvars") as HTMLInputElement;

for (let i = 0; i < cvars.children.length; i++) {
  const cvar = cvars.children[i] as HTMLInputElement;
  cvar.addEventListener("input", () => {
    reComputeInfectChance();
  });
}

for (let i = 0; i < gamemode.length; i++) {

  gamemode[i].addEventListener("change", () => {
    updateCvars();
  });
}

for (let i = 0; i < gamediff.length; i++) {

  gamediff[i].addEventListener("change", () => {
    updateCvars();
  });
}

if (healthSlider && healthText) {
  healthSlider.addEventListener("input", onHealthSliderChanged);
  healthText.addEventListener("input", onHealthInputChanged);
}


function onHealthSliderChanged() {
  healthText.value = healthSlider.value;
  reComputeInfectChance();
}

function onHealthInputChanged() {
  healthSlider.value = healthText.value;
  reComputeInfectChance();
}

if (biteDmg) {
  biteDmg.addEventListener("input", () => {
    const sliderMin = parseInt(biteDmg.value) + 1;
    healthSlider.min = sliderMin.toString();

    if (parseInt(healthSlider.value) <= sliderMin) {
      console.log(`Bump healthSlider to ${sliderMin}`);
      healthSlider.value = healthSlider.min;
      healthText.value = healthSlider.min;
    }
  });
}

if (maxHealth) {
  maxHealth.addEventListener("input", () => {
    const health = getHealth();
    const maxHealth = getMaxHealth();
    healthSlider.max = maxHealth.toString();

    if (health > maxHealth) {
      healthText.value = maxHealth.toString();
      healthSlider.value = maxHealth.toString();
    }
    reComputeInfectChance();
  });
}

function getHealth() {
  return parseInt(healthText.value);
}

function getMaxHealth() {
  return parseInt(maxHealth.value);
}

function getInfectChanceModifier() {
  return parseFloat(infectChanceModifier.value);
}

function getGamerulesModifier() {
  return parseFloat(survivalModifier.value);
}

function getDifficulty() {
  for (let i = 0; i < gamediff.length; i++) {
    const radioBtn = gamediff[i] as HTMLInputElement;
    if (radioBtn.checked) {
      return radioBtn.id;
    }
  }
}

function getGamemode() {
  for (let i = 0; i < gamemode.length; i++) {
    const radioBtn = gamemode[i] as HTMLInputElement;
    if (radioBtn.checked) {
      return radioBtn.id;
    }
  }
}

function getInfectChance()
{
  return parseFloat(infectChance.value);
}

function getBiteDmg() {
  return parseInt(biteDmg.value);
}

function reComputeInfectChance() {
  const healthRatio = (getHealth() - getBiteDmg()) / getMaxHealth();
  const infectionChance = 1.0 - healthRatio * getInfectChanceModifier();
  const finalInfChance = (infectionChance * infectionChance) * getGamerulesModifier() * getInfectChance();
  console.log(finalInfChance);
  infectPctOutput.textContent = `${(finalInfChance * 100).toFixed(2)}`;
}


function updateCvars() {
  const isNightmare = getDifficulty() === 'nightmare';
  survivalModifier.value = getGamemode() === 'nms' && !isNightmare ? '2.0' : '1.0';
  infectChanceModifier.value = isNightmare ? '0.14' : '0.975';
  reComputeInfectChance();
}

updateCvars();
