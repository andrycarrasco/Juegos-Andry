const $button_ = document.querySelector('button');
const $level_ = document.querySelector('#level>span');
const $pie_ = document.querySelector('#pie');
const $$pieces_ = document.querySelectorAll('.piece');
const $record_ = document.querySelector('#record');
let pieces_ = [];

// No taps allow before start the game
$pie_.classList.add('avoid-tap');

/**
 * Generate next piece (number)
 * 1: green, 2: blue, 3: orange, 4: red
 */
function get_random_piece() { // generate a random number between 4 and 1
  return Math.floor(Math.random() * (4)) + 1;
}

/**
 * Show the sequence you should follow
 */
function show_sequence() {
  let i = 0,
    e;

  $pie_.classList.add('avoid-tap');

  (function blink() {
    e = document.getElementById(pieces_[i]);

    e.classList.remove('blink'); // remove class
    void e.offsetWidth; // "restart" -> triggering reflow
    e.classList.add('blink'); // show animation

    i++;

    if (i < pieces_.length) { // if there are more pieces
      setTimeout(blink, 1000); // wait 1s before show next one
    } else {
      setTimeout(function() { // wait 1s before allow user to tap 
        $pie_.classList.remove('avoid-tap');
      }, 1000);
    }
  })();
}

/**
 * Check sequence
 */
let check_sequence = function() {
  let i = 0;

  return function(piece) {
    if (typeof(piece) === 'undefined') { // reset
      i = 0;
    } else { // play
      if (piece === pieces_[i]) { // success
        i++;
        // Keep playing
        if (i >= pieces_.length) { // we have guessed all
          $level_.textContent = pieces_.length; // set level before add
          pieces_.push(get_random_piece()); // add one more
          show_sequence();
          i = 0; // check from the beggining
        }
      } else {
   
        $level_.textContent = '☹ you failed';
        document.getElementById(piece).classList.add('fail');
        $pie_.classList.add('avoid-tap');
        i = 0;
        // Save user level if there is an improvement
        if (localStorage.getItem("level") === null ||
          pieces_.length - 1 > localStorage.getItem("level")) {
          setTimeout(function() {
            let name = prompt('Would you like to save your score? Write your name:');
            if (!name) return;
            localStorage.setItem('name', name);
            localStorage.setItem('level', pieces_.length - 1);
            $record_.textContent = `${name} reached level ${pieces_.length - 1}`;
          }, 10);
        }
      }
    }
  }
}();

// Start game
$button_.addEventListener('click', function() {
  const $fail = document.querySelector('.fail');

  this.textContent = 'Restart';

  // Clear
  pieces_ = []; // reset sequence
  $level_.textContent = pieces_.length;
  if ($fail) $fail.classList.remove('fail');
  check_sequence(); // reset when no parameters

  // Start
  pieces_.push(get_random_piece()); // add the first one
  show_sequence();
});

// Click on one of the 4 pieces (numbers)
$$pieces_.forEach(e => {
  e.addEventListener('click', function() {
    check_sequence(Number(this.getAttribute('id')));
  });
});

/**
 * It makes Simon always visible in any device
 */
function set_viewport() {
  if (window.innerWidth >= window.innerHeight)
    document.body.classList.add('landscape');
  else // portrait
    document.body.classList.remove('landscape');
}

window.addEventListener('resize', set_viewport);

// Before any resize we have to set the viewport up
set_viewport();

// Last best winner
if (localStorage.getItem('name')) {
  $record_.textContent = `${localStorage.getItem('name')} reached 
  	level ${localStorage.getItem('level')}`;
}
