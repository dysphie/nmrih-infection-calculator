"use strict";
const healthSlider = document.getElementById("health-slider");
const healthText = document.getElementById("health-text");
const biteDmg = document.getElementById("bite-dmg");
const infectPctOutput = document.getElementById("infect-pct-output");
const infectChanceModifier = document.getElementById("infect-chance-modifier");
const survivalModifier = document.getElementById("survival-modifier");
const maxHealth = document.getElementById("max-health");
const infectChance = document.getElementById("infect-chance");
const gamemode = document.getElementsByName("gamemode");
const gamediff = document.getElementsByName("gamediff");
const cvars = document.getElementById("cvars");
for (let i = 0; i < cvars.children.length; i++) {
    const cvar = cvars.children[i];
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
        const radioBtn = gamediff[i];
        if (radioBtn.checked) {
            return radioBtn.id;
        }
    }
}
function getGamemode() {
    for (let i = 0; i < gamemode.length; i++) {
        const radioBtn = gamemode[i];
        if (radioBtn.checked) {
            return radioBtn.id;
        }
    }
}
function getInfectChance() {
    return parseFloat(infectChance.value);
}
function reComputeInfectChance() {
    const healthRatio = getHealth() / getMaxHealth();
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
