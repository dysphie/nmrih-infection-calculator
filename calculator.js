// Object cache
const $healthNumber = $('#health-number');
const $healthSlider = $('#health-slider');
const $infectionBarFill = $('#infection-bar > span');
const $infectionPct = $('#infection-pct');
const $infectionPctRaw = $('#infection-pct-raw');
// const $bgImage = $('#bg-image');

var $healthInputs = $healthNumber.add($healthSlider);

// Default values
var playerHealth = $healthNumber.val();
var gamemodeModifier = $('#gamemode-settings > input[type=radio]:checked').val();
var difficultyModifier = $('#difficulty-settings > input[type=radio]:checked').val();

console.log(`playerHealth = ${playerHealth}`);
console.log(`gamemodeModifier = ${gamemodeModifier}`);
console.log(`difficultyModifier = ${difficultyModifier}`);

// Keep health slider and input in sync
$('#health-number, #health-slider').on('input', function()
{
    $(this).siblings('#health-number, #health-slider').val(this.value);
    playerHealth = this.value;

    // Desaturate bg
    // $('#bg').css('opacity', `${playerHealth/100}`);

    console.log(`playerHealth = ${playerHealth}`);
    ComputeInfectionChance();
});

$('#gamemode-settings > input[type=radio]').on('click change', function(e) {
    console.log(`gamemodeModifier = ${e.target.value}`);
    gamemodeModifier = e.target.value;
    ComputeInfectionChance();
});

$('#difficulty-settings > input[type=radio]').on('click change', function(e) {
    console.log(`difficultyModifier = ${e.target.value}`);
    difficultyModifier = e.target.value;
    ComputeInfectionChance();
});

function GetColorForValue(val)
{
    var green = 0,
    red = 0;
    if (val >= 50) {
        green = 255 - Math.round(((val - 50) / 50) * 255);
        red = 255;
    } else {
        green = 255;
        red = Math.round(((val) / 50) * 255);
    }
    
    return "rgb(" + red + "," + green + ",0)";
}

function ComputeInfectionChance()
{
    let healthRatio = playerHealth / 100;
    let infectionRatio = 1 - healthRatio * difficultyModifier;
    let infectionChance = (100 * (Math.pow(infectionRatio, 2)) * gamemodeModifier).toFixed(1);

    if(infectionChance > 100)
        infectionChance = 100;

    console.log('infectionChance = ' + infectionChance);
    /* Recolor the results */
    infectionChanceColor = GetColorForValue(infectionChance);
    console.log('infectionChanceColor = ', infectionChanceColor);

    $infectionBarFill.css({
        'width': infectionChance + '%',
        'background': infectionChanceColor,
    });
    
    $infectionPct.html(infectionChance + '%').css('color', infectionChanceColor);
}

ComputeInfectionChance();

