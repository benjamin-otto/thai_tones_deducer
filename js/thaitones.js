var classGroups = ['.mid-g', '.high-g', '.low-g'];
var toneGroups = ['.mark-g', '.no-mark-g'];
var tones = ['.ayk-g', '.dto-g', '.dtri-g', '.jat-g'];
var vowelGroups = ['.short-g', '.long-g'];
var isFinalOpen = false;
var selectedClassGroup = '';
var selectedVowelGroup = '';
var questionIndex = 1;

var owl = $('.questions-carousel').owlCarousel({
  loop: false,
  nav: false,
  items: 1,
  touchDrag: false,
  mouseDrag: false,
  pullDrag: false,
})

$().ready(function () {
  // All question containers same height
  setQuestionsHeight();

  // Question 1 radio buttons
  $('input[type=radio][name=class-group]').change(function () {
    disableNextButton(false);
    disableResetButton(false);
    selectedClassGroup = this.value;
    enableClassGroup('.' + selectedClassGroup);
    (selectedClassGroup == 'low-g' || selectedClassGroup == 'high-g')
      ? disableDtriJatRadios(true)
      : disableDtriJatRadios(false);
  });

  // Question 2 radio buttons
  $('input[type=radio][name=tone-group]').change(function () {
    if (this.value == 'no-tone') {
      enableToneGroup('.no-mark-g');
      disableNextButton(false);
    }
    else {
      enableTone('.' + this.value);
      disableNextButton(true);
    }
  });

  // Question 3 radio buttons
  $('input[type=radio][name=final-group]').change(function () {
    isFinalOpen = (this.value == 'open') ? true : false;
    if (this.value == 'closed-live') {
      disableDead(true);
      disableLive(false);
      disableDeadLong(false);
      disableNextButton(true);
    }
    else if (this.value == 'closed-dead') {
      disableDead(false);
      disableLive(true);
      disableDeadLong(false);
      ('low-g' == selectedClassGroup)
        ? disableNextButton(false)
        : disableNextButton(true);
    }
    else if (this.value == 'open') {
      disableDead(false);
      disableLive(false);
      disableDeadLong(true);
      disableNextButton(false);
    }
  });

  // Question 4 radio buttons
  $('input[type=radio][name=vowel-group]').change(function () {
    selectedVowelGroup = this.value;
    enableVowelGroup('.' + selectedVowelGroup);
    if (isFinalOpen) {
      if (selectedVowelGroup == 'short-g') {
        disableLive(true);
        disableDead(false);
      }
      else if (selectedVowelGroup == 'long-g') {
        disableLive(false)
        disableDead(true);
      }
    }
  });

  // Disable the after we've gone to the next question
  $('.carousel-nav .next').click(function () {
    owl.trigger('next.owl.carousel');
    disableNextButton(true);
    disablePrevButton(false);
    questionIndex++;
    if (questionIndex == 4) disableNextButton(true);
  })

  // If the user has just clicked back, then we can assume
  // the value selected on the current radio allows them to go forward
  $('.carousel-nav .prev').click(function () {
    owl.trigger('prev.owl.carousel');
    resetQuestion(questionIndex);
    disableNextButton(false);
    questionIndex--;
    if (questionIndex == 1) disablePrevButton(true);
  })

  $('.carousel-nav .reset').click(function () {
    owl.trigger('to.owl.carousel', [0, 300]);
    disableNextButton(true);
    disablePrevButton(true);
    disableResetButton(true);
    resetQuestion4();
    resetQuestion3();
    resetQuestion2();
    resetQuestion1();
  });
});

// Set question containers to the same height
function setQuestionsHeight() {
  var questions = ['.question-1', '.question-2', '.question-3', '.question-4'];
  var height = questions.reduce(function (height, q) {
    return ($(q).height() > height) ? $(q).height() : height;
  }, 0);
  questions.forEach(function (q) { $(q).height(height); });
}

function enableClassGroup(classGroup) {
  classGroups.forEach(function (cg) {
    (cg == classGroup)
      ? $(cg).removeClass('disabled-class-g')
      : $(cg).addClass('disabled-class-g')
  });
}

function disableDtriJatRadios(disabled) {
  $('#dtri-tone-mark').attr('disabled', disabled);
  $('#jat-tone-mark').attr('disabled', disabled);
}

function enableToneGroup(toneGroup) {
  toneGroups.forEach(function (tg) {
    (tg == toneGroup)
      ? $(tg).removeClass('disabled-tone-g')
      : $(tg).addClass('disabled-tone-g')
  });
}

function enableTone(tone) {
  enableToneGroup('.mark-g');
  tones.forEach(function (t) {
    (t == tone)
      ? $(t).removeClass('disabled-tone')
      : $(t).addClass('disabled-tone')
  });
}

function disableLive(disabled) {
  disabled
    ? $('.live-g').addClass('disabled-live')
    : $('.live-g').removeClass('disabled-live')
}

function disableDead(disabled) {
  disabled
    ? $('.dead-g').addClass('disabled-dead')
    : $('.dead-g').removeClass('disabled-dead')
}

function disableDeadLong(disabled) {
  disabled
    ? $('.dead-g.long-g').addClass('disabled-dead-long')
    : $('.dead-g.long-g').removeClass('disabled-dead-long');
}

function enableVowelGroup(vowelGroup) {
  vowelGroups.forEach(function (vg) {
    (vg == vowelGroup)
      ? $(vg).removeClass('disabled-vowel-group')
      : $(vg).addClass('disabled-vowel-group')
  });
}

function disableNextButton(disabled) {
  disabled
    ? $('.carousel-nav .next').addClass('disabled')
    : $('.carousel-nav .next').removeClass('disabled')
}

function disablePrevButton(disabled) {
  disabled
    ? $('.carousel-nav .prev').addClass('disabled')
    : $('.carousel-nav .prev').removeClass('disabled')
}

function disableResetButton(disabled) {
  disabled
    ? $('.carousel-nav .reset').addClass('disabled')
    : $('.carousel-nav .reset').removeClass('disabled')
}

function resetQuestion(index) {
  switch (index) {
    case 1:
      resetQuestion1();
      break;
    case 2:
      resetQuestion2();
      break;
    case 3:
      resetQuestion3();
      break;
    case 4:
      resetQuestion4();
      break;
    default:
      break;
  }
}

function resetQuestion1() {
  $('input[type=radio][name=class-group]').prop('checked', false);
  classGroups.forEach(function (cg) { $(cg).removeClass('disabled-class-g'); });
  disableDtriJatRadios(false);
  selectedClassGroup = '';
}

function resetQuestion2() {
  $('input[type=radio][name=tone-group]').prop('checked', false);
  toneGroups.forEach(function (tg) { $(tg).removeClass('disabled-tone-g'); });
  tones.forEach(function (t) { $(t).removeClass('disabled-tone'); });
}

function resetQuestion3() {
  $('input[type=radio][name=final-group]').prop('checked', false);
  disableLive(false);
  disableDead(false);
  disableDeadLong(false);
  isFinalOpen = false;
}

function resetQuestion4() {
  $('input[type=radio][name=vowel-group]').prop('checked', false);
  vowelGroups.forEach(function (vg) { $(vg).removeClass('disabled-vowel-group'); });
  if (isFinalOpen) {
    if (selectedVowelGroup == 'short-g')
      disableLive(false);
    else if (selectedVowelGroup == 'long-g')
      disableDead(false);
  }
  selectedVowelGroup = '';
}