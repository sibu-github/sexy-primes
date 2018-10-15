console.log("script loaded");

const PRIME_HUNT_INTERVAL = 100;
const RENDER_LIMIT = 20;
const INITIAL_PRIME_FETCH_LIMIT = 10 * 1000;

// DOM references
const pType = document.getElementById("ptype");
const pgDiv = document.getElementById("pgdiv");
const goButton = document.getElementById("go");
const list = document.getElementById("list");

// show Scroll To Top button
const showScrollToTop = () =>
  (document.getElementById("scrolltop").style.display = "block");

// hide Scroll To Top button
const hideScrollToTop = () =>
  (document.getElementById("scrolltop").style.display = "none");

// calculate primeGap value
let primeGap =
  pType.value === "twin"
    ? 2
    : pType.value === "cousin"
      ? 4
      : pType.value === "sexy"
        ? 6
        : 8;

// currIdx determines how far we have traversed in knownPrime list
let currIdx = 0;

// list of all known primes (keeping in memory for faster calculation)
const knownPrimes = [2, 3];

// check if a given number is prime
const isPrime = n => {
  for (let i = 0; i < knownPrimes.length; i++) {
    if (n % knownPrimes[i] === 0) {
      return false;
    }
  }
  return true;
};

// next next prime number of the last known prime
const getNextPrime = () => {
  // stop hunting when there too many to be shown
  if (knownPrimes.length > currIdx + 50000) {
    // console.log("skip hunting");
    return;
  }
  const lastKnownPrime = knownPrimes[knownPrimes.length - 1];
  let next = lastKnownPrime + 1;
  let found = false;
  while (!found) {
    if (isPrime(next)) {
      found = true;
    } else {
      next++;
    }
  }
  // console.log(next);
  knownPrimes.push(next);
};

// insert the list into the DOM
const addToList = p => {
  const li = document.createElement("li");
  const para = document.createElement("p");
  const node = document.createTextNode(`[${p[0]}, ${p[1]}]`);
  para.appendChild(node);
  li.appendChild(para);
  list.appendChild(li);
};

// clears the previous list i.e remove all li nodes from the DOM
const clearPreviousResults = () => {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
};

// traverse the knownPrimes list and filter out the
// prime pairs based on primeGap and add to the DOM
const displayList = () => {
  let count = 0;
  while (count < RENDER_LIMIT) {
    // if currIdx reaches the end of knownPrimes list then exit
    if (currIdx >= knownPrimes.length) {
      return;
    }

    const kp = knownPrimes[currIdx];
    for (let i = currIdx + 1; i < knownPrimes.length; i++) {
      const next = knownPrimes[i];
      const diff = next - kp;
      if (diff > primeGap) {
        break;
      }
      if (diff === primeGap) {
        addToList([kp, next]);
        count++;
      }
    }
    currIdx++;
  }
};

// reset the page when onChange or onClick event occurs
const resetPage = () => {
  clearPreviousResults();
  currIdx = 0;
  displayList();
};

// on change handler for Prime Gap type dropdown
pType.addEventListener("change", () => {
  if (pType.value === "other") {
    pgDiv.style.display = "block";
    document.getElementById("pgap").value = 8;
    document.getElementById("pgap").focus();
    primeGap = 8;
  } else {
    pgDiv.style.display = "none";
    primeGap =
      pType.value === "twin"
        ? 2
        : pType.value === "cousin"
          ? 4
          : pType.value === "sexy"
            ? 6
            : 8;
  }
  resetPage();
});

// attach onclick handler on go button
goButton.addEventListener("click", () => {
  const value = Number(document.getElementById("pgap").value);
  primeGap =
    isNaN(value) || value < 8 ? 8 : value % 2 !== 0 ? value + 1 : value;
  document.getElementById("pgap").value = primeGap;
  resetPage();
});

// attach ENTER key handler on the prime gap input field
document.getElementById("pgap").addEventListener("keyup", ({ keyCode }) => {
  if (keyCode === 13) {
    goButton.click();
  }
});

// load more content depending on the content height
// and scroll top position
const loadMoreContent = () => {
  const contentHeight = list.offsetHeight - 200;
  const y = window.pageYOffset + window.innerHeight;
  if (y >= contentHeight) {
    displayList();
  }
};

// attach window scroll event
window.onscroll = function() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    showScrollToTop();
  } else {
    hideScrollToTop();
  }
  loadMoreContent();
};

// smooth scroll on click of the Scroll To Top button
document.getElementById("scrolltop-button").addEventListener("click", () => {
  window.scroll({ top: 0, left: 0, behavior: "smooth" });
});

// onLoad function to be called once when page loaded
const onLoad = () => {
  // hide other prime gap input field
  pgDiv.style.display = "none";
  // hide Scroll To Top button
  hideScrollToTop();

  // first fetch 10000 primes to start with
  for (let i = 0; i < INITIAL_PRIME_FETCH_LIMIT; i++) {
    getNextPrime();
  }
  // display few initial list
  displayList();
  displayList();
  displayList();

  // start hunting prime numbers in interval
  setInterval(getNextPrime, PRIME_HUNT_INTERVAL);
};

onLoad();
