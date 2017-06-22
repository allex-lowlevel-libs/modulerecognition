function createNSFetcher (q, qlib) {

  function fetchNSS () {
    return q(window['.allexns.js'] || null);
  }

  return fetchNSS;
}

module.exports = createNSFetcher;

